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

  const consultationId = 'c-voice-' + Date.now();
  const today = new Date().toISOString().split('T')[0];
  const demoPatientId = 'p-prenatal-1781234133256-0';

  // 3. Run LangChain triage pipeline and fetch previous risk level concurrently
  const [triage, prevRiskRes] = await Promise.all([
    triageTranscript(fullText),
    pool.query(
      'SELECT risk_level FROM patients WHERE id = $1',
      [demoPatientId]
    )
  ]);
  const prevRiskLevel = prevRiskRes.rows[0]?.risk_level || 'LOW';

  // 4. Save consultation and updates to DB concurrently
  const dbPromises = [];

  dbPromises.push(
    pool.query(
      `INSERT INTO consultations
       (id, patient_id, patient_name, date, language, symptoms,
        risk_level, ai_summary, transcript, triggered_referral)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        consultationId,
        demoPatientId,
        'Nana Yaa',
        today,
        'English',
        triage.symptoms,
        triage.riskLevel,
        triage.summary,
        JSON.stringify(formattedTranscript),
        false,
      ]
    )
  );

  // 5. Update patient risk level
  if (triage.riskLevel !== prevRiskLevel) {
    dbPromises.push(
      pool.query(
        'UPDATE patients SET risk_level = $1 WHERE id = $2',
        [triage.riskLevel, demoPatientId]
      )
    );

    // Insert into risk escalation feed
    dbPromises.push(
      pool.query(
        `INSERT INTO risk_escalation_feed
         (patient_id, patient_name, from_level, to_level, date, reason)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          demoPatientId,
          'Nana Yaa',
          prevRiskLevel,
          triage.riskLevel,
          today,
          triage.triageReason,
        ]
      )
    );
  }

  // 6. Push notification to dashboard
  const notifId = 'n-voice-' + Date.now();
  const symptomList = triage.symptoms.join(', ');
  const notificationTitle =
    triage.riskLevel === 'HIGH'
      ? `High Risk: Nana Yaa — ${symptomList}`
      : triage.riskLevel === 'MEDIUM'
        ? `Medium Risk: Nana Yaa — ${symptomList}`
        : `Low Risk: Nana Yaa — routine check-in`;

  dbPromises.push(
    pool.query(
      `INSERT INTO notifications
       (id, ui_type, payload, is_read, timestamp, pathway)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        notifId,
        'voice-triage',
        JSON.stringify({
          title: notificationTitle,
          riskLevel: triage.riskLevel,
          patientId: demoPatientId,
          patientName: 'Nana Yaa',
          symptoms: triage.symptoms,
          summary: triage.summary,
          consultationId,
          trigger: 'voice-call',
        }),
        false,
        new Date().toISOString(),
        'Pregnancy',
      ]
    )
  );

  // 7. Log action
  dbPromises.push(
    pool.query(
      `INSERT INTO action_logs
       (id, patient_id, type, description, timestamp, performed_by)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        'log-el-' + Date.now(),
        demoPatientId,
        'Voice Call',
        `Voice triage: ${triage.riskLevel} — ${triage.triageReason}`,
        new Date().toISOString(),
        'LangChain (ElevenLabs to Gemini)',
      ]
    )
  );

  await Promise.all(dbPromises);

  console.log(
    `[Webhook] Processed ${data.conversation_id}: ` +
    `${triage.riskLevel} risk — ${triage.symptoms.join(', ')}`
  );
}
