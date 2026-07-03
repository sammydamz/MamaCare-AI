import { triageTranscript, type TriageResult } from './triage-chain.js';

interface TranscriptEntry {
  role: 'agent' | 'user';
  message: string;
  time_in_call_secs: number;
}

interface WebhookPayload {
  type: 'post_call_transcription' | 'post_call_audio' | 'call_initiation_failure';
  data: {
    agent_id: string;
    conversation_id: string;
    status: string;
    transcript: TranscriptEntry[];
    analysis: {
      transcript_summary: string;
      call_successful: string;
    };
    metadata: {
      call_duration_secs: number;
      start_time_unix_secs: number;
    };
  };
}

export async function processPostCallWebhook(
  payload: WebhookPayload,
  pool: any
) {
  if (payload.type !== 'post_call_transcription') {
    console.log(`[Webhook] Skipping ${payload.type} event`);
    return;
  }

  const { data } = payload;

  // 1. Build full text from user turns
  const userMessages = data.transcript
    .filter((t: TranscriptEntry) => t.role === 'user')
    .map((t: TranscriptEntry) => t.message);

  const fullText = userMessages.join(' ');

  if (!fullText.trim()) {
    console.log('[Webhook] Empty transcript, skipping');
    return;
  }

  // 2. Format structured transcript
  const formattedTranscript = data.transcript.map((t: TranscriptEntry) => ({
    speaker: t.role === 'user' ? 'Mother' : 'AI',
    text: t.message,
  }));

  // 3. Run LangChain triage pipeline
  const triage: TriageResult = await triageTranscript(fullText);

  // 4. Save consultation to DB
  const consultationId = 'c_el_' + Date.now();
  const today = new Date().toISOString().split('T')[0];

  await pool.query(
    `INSERT INTO consultations
     (id, patient_id, patient_name, date, language, symptoms,
      risk_level, ai_summary, transcript, triggered_referral)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      consultationId,
      'demo-patient',
      'Demo Patient',
      today,
      'English',
      triage.symptoms,
      triage.riskLevel,
      triage.summary,
      JSON.stringify(formattedTranscript),
      triage.triggeredReferral,
    ]
  );

  // 5. Update patient risk level if escalated
  if (triage.riskLevel === 'HIGH' || triage.riskLevel === 'MEDIUM') {
    await pool.query(
      'UPDATE patients SET risk_level = $1 WHERE id = $2',
      [triage.riskLevel, 'demo-patient']
    );
  }

  // 6. Log action
  await pool.query(
    `INSERT INTO action_logs
     (id, patient_id, type, description, timestamp, performed_by)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      'log_el_' + Date.now(),
      'demo-patient',
      'Call',
      `Voice triage: ${triage.riskLevel} — ${triage.triageReason}`,
      new Date().toISOString(),
      'LangChain (ElevenLabs → Gemini)',
    ]
  );

  console.log(
    `[Webhook] Processed ${data.conversation_id}: ` +
    `${triage.riskLevel} risk — ${triage.symptoms.join(', ')}`
  );
}
