import { OpenAI } from 'openai';
import { ElevenLabsClient } from 'elevenlabs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const minimax = new OpenAI({ 
  apiKey: process.env.MINIMAX_API_KEY,
  baseURL: 'https://api.minimax.io/v1'
});
const elevenlabs = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

// In-memory state for calls
// Map sessionId -> CallState
interface Turn {
  speaker: 'AI' | 'Mother';
  text: string;
}

interface CallState {
  step: number; // 1: greeting sent, waiting for coping. 2: symptom check sent, waiting for symptoms. 3: ended
  patientId?: string;
  transcript: Turn[];
}

const activeCalls: Record<string, CallState> = {};

// Helper to generate speech using ElevenLabs and return a URL
// Since we need to provide a public URL to AT, we must serve the file
async function generateSpeechAndSave(text: string, filename: string): Promise<string> {
  try {
    const audioStream = await elevenlabs.generate({
      voice: "9Dbo4hEvXQ5l7MXGZFQA", // Olufunmilola (African/Nigerian female accent)
      text: text,
      model_id: "eleven_monolingual_v1"
    });

    const publicDir = path.join(__dirname, '../public/audio');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const filepath = path.join(publicDir, filename);
    const fileStream = fs.createWriteStream(filepath);

    // Stream the audio response to a file
    for await (const chunk of audioStream) {
      fileStream.write(chunk);
    }
    fileStream.end();

    // Wait for the stream to finish
    await new Promise((resolve) => fileStream.on('finish', () => resolve(undefined)));

    // Return the relative URL we can serve (assumes server is hosted at process.env.PUBLIC_URL or we just use a generic path)
    // For demo, we might need a tunneling service like ngrok if testing locally with AT
    const baseUrl = process.env.PUBLIC_URL || 'http://localhost:5000';
    return `${baseUrl}/audio/${filename}`;
  } catch (err) {
    console.error("ElevenLabs error:", err);
    throw err;
  }
}

// Transcribe audio from URL using Whisper
async function transcribeAudio(audioUrl: string): Promise<string> {
  try {
    // Download the audio file from AT
    const response = await fetch(audioUrl);
    const buffer = await response.arrayBuffer();
    
    // Save temporarily
    const tmpPath = path.join(__dirname, `tmp_${Date.now()}.wav`);
    fs.writeFileSync(tmpPath, Buffer.from(buffer));

    const transcription = await minimax.audio.transcriptions.create({
      file: fs.createReadStream(tmpPath),
      model: "minimax-asr", // Use a generic model name since we are routing to MiniMax
    });

    fs.unlinkSync(tmpPath); // cleanup
    return transcription.text;
  } catch (err) {
    console.error("Transcription error:", err);
    return "";
  }
}

export async function handleVoiceCallback(req: any, res: any, pool: any) {
  const { sessionId, isActive, callerNumber, recordingUrl } = req.body;

  if (isActive === '0') {
    // Call ended. We should save the transcript to DB.
    const state = activeCalls[sessionId];
    if (state) {
      console.log("Call ended. Transcript:", state.transcript);
      try {
        let phoneStr = callerNumber;
        if (phoneStr && !phoneStr.startsWith('+')) {
          phoneStr = '+' + phoneStr;
        }
        const patientRes = await pool.query('SELECT * FROM patients WHERE phone = $1 OR phone = $2', [callerNumber, phoneStr]);
        if (patientRes.rows.length > 0) {
          const patient = patientRes.rows[0];
          const id = 'c' + Math.floor(100 + Math.random() * 900);
          const date = new Date().toISOString().split('T')[0];
          
          const triggeredReferral = state.transcript.some(t => t.text.includes('feedback') && t.speaker === 'AI');
          
          await pool.query(
            `INSERT INTO consultations (id, patient_id, patient_name, date, language, symptoms, risk_level, ai_summary, transcript, triggered_referral) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [id, patient.id, patient.name, date, patient.language, [], patient.risk_level, 'Automated Voice Agent Call', JSON.stringify(state.transcript), triggeredReferral]
          );
        }
      } catch (err) {
        console.error('Failed saving voice transcript:', err);
      }
      delete activeCalls[sessionId];
    }
    return res.send(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`);
  }

  // Initialize state if new call
  if (!activeCalls[sessionId]) {
    activeCalls[sessionId] = { step: 0, transcript: [] };
  }

  const state = activeCalls[sessionId];

  try {
    let responseText = "";
    
    if (state.step === 0) {
      // Step 0: Initial Greeting
      responseText = "Hello, this is your MamaCare assistant. How are you doing today? On a scale of 1 to 10, how well are you coping with your pregnancy?";
      state.step = 1;
    } else if (state.step === 1 && recordingUrl) {
      // Step 1: Processing coping index response
      const userText = await transcribeAudio(recordingUrl);
      state.transcript.push({ speaker: 'Mother', text: userText });

      responseText = "Thank you for sharing. Are you experiencing any physical symptoms right now, such as headaches, bleeding, or reduced baby movement?";
      state.step = 2;
    } else if (state.step === 2 && recordingUrl) {
      // Step 2: Processing symptom response
      const userText = await transcribeAudio(recordingUrl);
      state.transcript.push({ speaker: 'Mother', text: userText });

      // Call LLM to evaluate if there are symptoms
      const completion = await minimax.chat.completions.create({
        model: "abab6.5-chat",
        messages: [
          { role: "system", content: "You are evaluating a prenatal mother's response about her symptoms. If she mentions any negative symptoms (headache, bleeding, pain, fatigue, etc), reply exactly with 'SYMPTOM'. If she says she is fine or no symptoms, reply exactly with 'CLEAR'." },
          { role: "user", content: userText }
        ]
      });

      const llmResult = completion.choices[0].message.content?.trim();
      
      if (llmResult === 'SYMPTOM') {
        responseText = "Thank you for sharing. I've noted your symptoms, and a healthcare provider will contact you shortly with feedback. Take care.";
      } else {
        responseText = "I'm glad to hear you are doing well. Keep up the great work, and we will check in on you again soon. Goodbye.";
      }
      state.step = 3;
    }

    if (responseText) {
      state.transcript.push({ speaker: 'AI', text: responseText });
      
      const audioFilename = `resp_${sessionId}_${state.step}.mp3`;
      const audioUrl = await generateSpeechAndSave(responseText, audioFilename);

      let xmlResponse = `<?xml version="1.0" encoding="UTF-8"?><Response>`;
      xmlResponse += `<Play url="${audioUrl}" />`;
      
      if (state.step < 3) {
        xmlResponse += `<Record finishOnKey="#" maxLength="15" playBeep="true" />`;
      }
      xmlResponse += `</Response>`;

      res.setHeader('Content-Type', 'application/xml');
      return res.send(xmlResponse);
    }

  } catch (error) {
    console.error("Voice pipeline error:", error);
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say>Sorry, I am having trouble connecting right now. Goodbye.</Say>
      </Response>`;
    res.setHeader('Content-Type', 'application/xml');
    return res.send(fallbackXml);
  }
}

export async function initiateAICall(req: any, res: any, pool: any) {
  const { patientId } = req.body;
  
  try {
    const patientRes = await pool.query('SELECT * FROM patients WHERE id = $1', [patientId]);
    if (patientRes.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    const patient = patientRes.rows[0];
    if (!patient.phone) {
      return res.status(400).json({ error: 'Patient has no phone number' });
    }

    const africastalking = (await import('africastalking')).default;
    const AT = africastalking({
      apiKey: process.env.AFRICASTALKING_API_KEY || '',
      username: process.env.AFRICASTALKING_USERNAME || 'sandbox'
    });

    const voice = AT.VOICE;
    const callRes = await voice.call({
      callFrom: process.env.AFRICASTALKING_PHONE_NUMBER || '+254711082000',
      callTo: [patient.phone]
    });

    res.json({ success: true, message: 'Call initiated', callRes });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
