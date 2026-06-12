import { OpenAI } from 'openai';
import { ElevenLabsClient } from 'elevenlabs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { GoogleGenerativeAI } from '@google/generative-ai';

let geminiClient: GoogleGenerativeAI;

function getGeminiClient() {
  if (!geminiClient) {
    geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');
  }
  return geminiClient;
}
const elevenlabs = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY || 'dummy_key' });

import * as Minio from 'minio';

let minioClient: Minio.Client;
let bucketName: string;

function getMinioClient() {
  if (!minioClient) {
    minioClient = new Minio.Client({
      endPoint: process.env.AWS_ENDPOINT_URL_S3 ? process.env.AWS_ENDPOINT_URL_S3.replace('https://', '').replace('http://', '').split(':')[0] : (process.env.MINIO_ENDPOINT || 'localhost'),
      port: parseInt(process.env.MINIO_PORT || '443'),
      useSSL: process.env.MINIO_USE_SSL !== 'false',
      accessKey: process.env.AWS_ACCESS_KEY_ID || process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.MINIO_SECRET_KEY || 'minioadmin'
    });
    bucketName = process.env.AWS_S3_BUCKET || process.env.MINIO_BUCKET || 'mamacare-audio';
  }
  return { client: minioClient, bucket: bucketName };
}

export async function processRecordedSession(audioPath: string, patientId: string, pool: any) {
  try {
    // 1. Upload to MinIO
    const { client, bucket } = getMinioClient();
    const objectName = `audio_${Date.now()}.wav`;
    const exists = await client.bucketExists(bucket).catch(() => false);
    if (!exists) {
      await client.makeBucket(bucket, 'us-east-1').catch(console.error);
    }
    await client.fPutObject(bucket, objectName, audioPath, {});
    // Get presigned URL
    const audioUrl = await client.presignedGetObject(bucket, objectName, 7 * 24 * 60 * 60); // 7 days

    // 2. Transcribe the audio via ElevenLabs Speech-to-Text (Scribe)
    let fullTranscript = '';
    try {
      const audioData = fs.readFileSync(audioPath);
      const blob = new Blob([audioData], { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('file', blob, `audio_${Date.now()}.wav`);
      formData.append('model_id', 'scribe_v1');

      const res = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
        method: 'POST',
        headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY || '' },
        body: formData
      });
      
      if (!res.ok) {
        throw new Error(`ElevenLabs API error: ${res.status} ${await res.text()}`);
      }
      
      const result = await res.json();
      fullTranscript = result.text || '';
    } catch (e) {
      console.error("ElevenLabs ASR error:", e);
      throw e;
    }

    // 4. Extract Symptoms, Summary, Risk Level, and Transcript via Gemini using new sophisticated prompt
    let symptoms: string[] = [];
    let aiSummary = 'No summary generated.';
    let riskLevel = 'Low';
    let triageReason = 'Routine check-in or common symptoms';
    let structuredTranscript = [{ role: 'system', message: fullTranscript }];
    
    try {
      if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set in .env");
      
      const genAI = getGeminiClient();
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });
      
      // Dynamic import to support ES modules if needed, or just require
      const { buildTriagePrompt } = await import('./prompts.js');
      const prompt = buildTriagePrompt(fullTranscript);
      
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const parsed = JSON.parse(responseText);
      
      if (Array.isArray(parsed.symptoms)) symptoms = parsed.symptoms;
      if (typeof parsed.summary === 'string') aiSummary = parsed.summary;
      if (Array.isArray(parsed.structuredTranscript)) structuredTranscript = parsed.structuredTranscript;
      if (['HIGH', 'MEDIUM', 'LOW'].includes(String(parsed.riskLevel).toUpperCase())) {
        riskLevel = String(parsed.riskLevel).toUpperCase();
      }
      if (typeof parsed.triageReason === 'string') triageReason = parsed.triageReason;
      
      console.log(`Triage completed by Gemini. Risk: ${riskLevel}. Reason: ${triageReason}`);
    } catch (error) {
      console.error("Gemini AI failed to process transcript:", error);
    }

    const transcriptJson = JSON.stringify(structuredTranscript);
    let triggeredReferral = (riskLevel === 'HIGH' || riskLevel === 'MEDIUM');

    // 4. Get Patient Info to save to database correctly
    const patientRes = await pool.query('SELECT * FROM patients WHERE id = $1', [patientId]);
    if (patientRes.rows.length === 0) {
      throw new Error('Patient not found');
    }
    const patient = patientRes.rows[0];

    // 5. Save to database
    const id = 'c' + Math.floor(1000 + Math.random() * 9000);
    const date = new Date().toISOString().split('T')[0];

    await pool.query(
      `INSERT INTO consultations 
      (id, patient_id, patient_name, date, language, symptoms, risk_level, ai_summary, transcript, triggered_referral, audio_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        id, 
        patientId, 
        patient.name, 
        date, 
        patient.language, 
        symptoms, 
        riskLevel, 
        aiSummary, 
        transcriptJson,
        triggeredReferral,
        audioUrl
      ]
    );

    // Update patient risk level if high or medium
    if (riskLevel === 'High' || riskLevel === 'Medium') {
      await pool.query('UPDATE patients SET risk_level = $1 WHERE id = $2', [riskLevel, patientId]);
    }

    if (fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
    }

    return { success: true, transcript: fullTranscript, symptoms, riskLevel, audioUrl };
  } catch (error) {
    if (fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
    }
    console.error("Error processing recorded session:", error);
    throw error;
  }
}
