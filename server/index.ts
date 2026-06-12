import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/audio', express.static(path.join(__dirname, '../public/audio')));

const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

import { processRecordedSession } from './voice-agent.js';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildTriagePrompt } from './prompts.js';

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ dest: uploadDir });

// DB Pool configuration
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProd ? { rejectUnauthorized: false } : false,
});

// Run DB Migrations/Schema
async function runMigrations() {
  try {
    let schemaPath = path.join(__dirname, 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      schemaPath = path.join(__dirname, '../server/schema.sql');
    }
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(sql);
      console.log('Database migrations completed successfully.');
    } else {
      console.log('schema.sql not found at default and fallback paths');
    }
  } catch (error) {
    console.error('Error running migrations:', error);
  }
}

// Connect and Migrate
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client:', err.stack);
  } else {
    console.log('Successfully connected to PostgreSQL.');
    release();
    runMigrations();
  }
});

// --- API ENDPOINTS ---

// POST /api/voice/upload-recording/:patientId
app.post('/api/voice/upload-recording/:patientId', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }
    const result = await processRecordedSession(req.file.path, req.params.patientId as string, pool);
    
    // Clean up temp file
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.json(result);
  } catch (err: any) {
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    res.status(500).json({ error: err.message });
  }
});

// POST /api/login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }
    const user = result.rows[0];
    if (user.password !== password) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }
    
    // In a real app we would use JWT, but for demo we just return success
    res.json({
      access_token: 'demo-access-token',
      refresh_token: 'demo-refresh-token',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        fullname: user.fullname,
        email_verified: user.email_verified,
        occupation: user.occupation,
        company_name: user.company_name,
        phone: user.phone,
        pic: user.pic,
        language: user.language,
        is_admin: user.is_admin
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/user
app.get('/api/user', async (req, res) => {
  // Demo mock: returning the first user or mock user if no auth token is passed
  // In a real app, this would verify the token from the header
  try {
    const result = await pool.query('SELECT * FROM users LIMIT 1');
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const user = result.rows[0];
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      fullname: user.fullname,
      email_verified: user.email_verified,
      occupation: user.occupation,
      company_name: user.company_name,
      phone: user.phone,
      pic: user.pic,
      language: user.language,
      is_admin: user.is_admin
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard
app.get('/api/dashboard', async (req, res) => {
  try {
    const kpisResult = await pool.query('SELECT * FROM kpis');
    const kpis: Record<string, number> = {};
    kpisResult.rows.forEach((row) => {
      kpis[row.key] = Number(row.value);
    });

    const feedResult = await pool.query('SELECT * FROM risk_escalation_feed ORDER BY id DESC LIMIT 10');

    res.json({
      kpis: {
        totalMothers: kpis['total_mothers'] || 6,
        highRisk: kpis['high_risk'] || 2,
        pendingActions: kpis['pending_actions'] || 4,
        resolutionRate: kpis['resolution_rate'] || 78,
      },
      zoneSummary: {
        caseload: kpis['caseload'] || 6,
        pendingVisits: kpis['pending_visits'] || 4,
        unresolvedDanger: kpis['unresolved_danger'] || 2,
      },
      riskEscalationFeed: feedResult.rows.map((row) => ({
        patientId: row.patient_id,
        patientName: row.patient_name,
        fromLevel: row.from_level,
        toLevel: row.to_level,
        date: row.date,
        reason: row.reason,
      })),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/patients
app.get('/api/patients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patients ORDER BY risk_level DESC, name ASC');
    res.json(result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      age: row.age,
      pathway: row.pathway,
      riskLevel: row.risk_level,
      language: row.language,
      assignedChw: row.assigned_chw,
      stage: row.stage,
      lastCallDate: row.last_call_date,
      registrationDate: row.registration_date,
      riskHistory: row.risk_history,
      bloodPressure: row.blood_pressure,
      kickCount: row.kick_count,
      copingIndex: row.coping_index,
      sleepQuality: row.sleep_quality,
      bleedingStatus: row.bleeding_status,
      phone: row.phone,
    })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/patients (Register Patient)
app.post('/api/patients', async (req, res) => {
  const { name, age, pathway, language, assignedChw, stage, phone } = req.body;
  const id = 'p' + Math.floor(100 + Math.random() * 900);
  const regDate = new Date().toISOString().split('T')[0];
  const initialHistory = JSON.stringify([{ date: regDate, level: 'LOW' }]);

  try {
    await pool.query(
      `INSERT INTO patients (id, name, age, pathway, risk_level, language, assigned_chw, stage, registration_date, risk_history, phone) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [id, name, age, pathway, 'LOW', language, assignedChw || 'Unassigned', stage, regDate, initialHistory, phone || null]
    );

    // Insert to action log
    const logId = 'a' + Math.floor(100 + Math.random() * 900);
    await pool.query(
      `INSERT INTO action_logs (id, patient_id, type, description, timestamp, performed_by) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [logId, id, 'Registration', `Patient registered for MamaCare programme - ${pathway} pathway`, new Date().toISOString(), assignedChw || 'System']
    );

    // Update KPI
    await pool.query("UPDATE kpis SET value = value + 1 WHERE key = 'total_mothers'");
    await pool.query("UPDATE kpis SET value = value + 1 WHERE key = 'caseload'");

    res.status(201).json({ id, name, age, pathway, riskLevel: 'LOW', language, assignedChw, stage, phone });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/patients/:id/vitals
app.post('/api/patients/:id/vitals', async (req, res) => {
  const { id } = req.params;
  const { bloodPressure, kickCount, copingIndex } = req.body;
  const timestamp = new Date().toISOString();

  try {
    // Fetch patient
    const patientRes = await pool.query('SELECT * FROM patients WHERE id = $1', [id]);
    if (patientRes.rows.length === 0) {
       res.status(404).json({ error: 'Patient not found' });
       return;
    }
    const patient = patientRes.rows[0];

    // Determine new risk level if BP or coping index are extreme
    let newRisk = patient.risk_level;
    let explanation = '';
    if (bloodPressure) {
      const parts = bloodPressure.split('/');
      if (parts.length === 2) {
        const systolic = parseInt(parts[0]);
        const diastolic = parseInt(parts[1]);
        if (systolic >= 160 || diastolic >= 100) {
          newRisk = 'HIGH';
          explanation = `Critically elevated BP (${bloodPressure})`;
        } else if (systolic >= 140 || diastolic >= 90) {
          if (newRisk !== 'HIGH') newRisk = 'MEDIUM';
          explanation = `Elevated BP (${bloodPressure})`;
        }
      }
    }
    if (copingIndex && parseInt(copingIndex) <= 3) {
      newRisk = 'HIGH';
      explanation = `Critically low Coping Index (${copingIndex})`;
    }

    let updatedHistory = patient.risk_history;
    if (newRisk !== patient.risk_level) {
      updatedHistory.push({ date: timestamp.split('T')[0], level: newRisk });
      
      // Update escalation feed
      await pool.query(
        `INSERT INTO risk_escalation_feed (patient_id, patient_name, from_level, to_level, date, reason) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [id, patient.name, patient.risk_level, newRisk, timestamp.split('T')[0], explanation || 'Recorded vital metrics change']
      );

      // Adjust high risk counts
      if (newRisk === 'HIGH') {
        await pool.query("UPDATE kpis SET value = value + 1 WHERE key = 'high_risk'");
      } else if (patient.risk_level === 'HIGH') {
        await pool.query("UPDATE kpis SET value = value - 1 WHERE key = 'high_risk'");
      }
    }

    await pool.query(
      `UPDATE patients SET 
        blood_pressure = COALESCE($1, blood_pressure), 
        kick_count = COALESCE($2, kick_count), 
        coping_index = COALESCE($3, coping_index),
        risk_level = $4,
        risk_history = $5
       WHERE id = $6`,
      [bloodPressure || null, kickCount || null, copingIndex || null, newRisk, JSON.stringify(updatedHistory), id]
    );

    // Insert to action log
    const logId = 'a' + Math.floor(100 + Math.random() * 900);
    const desc = `Vitals updated: ${bloodPressure ? `BP: ${bloodPressure} ` : ''}${kickCount ? `Kick Count: ${kickCount} ` : ''}${copingIndex ? `Coping Index: ${copingIndex}` : ''}`;
    await pool.query(
      `INSERT INTO action_logs (id, patient_id, type, description, timestamp, performed_by) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [logId, id, 'Vitals', desc, timestamp, patient.assigned_chw || 'System']
    );

    res.json({ success: true, riskLevel: newRisk });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/patients/:id/visits
app.post('/api/patients/:id/visits', async (req, res) => {
  const { id } = req.params;
  const { visitType, notes } = req.body;
  const timestamp = new Date().toISOString();

  try {
    const patientRes = await pool.query('SELECT * FROM patients WHERE id = $1', [id]);
    if (patientRes.rows.length === 0) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }
    const patient = patientRes.rows[0];

    const logId = 'a' + Math.floor(100 + Math.random() * 900);
    await pool.query(
      `INSERT INTO action_logs (id, patient_id, type, description, timestamp, performed_by) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [logId, id, 'Visit', `${visitType} visit completed: ${notes}`, timestamp, patient.assigned_chw || 'System']
    );

    res.json({ success: true });
  } catch (err: any) {
     res.status(500).json({ error: err.message });
  }
});

// GET /api/consultations
app.get('/api/consultations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM consultations ORDER BY date DESC');
    res.json(result.rows.map((row) => ({
      id: row.id,
      patientId: row.patient_id,
      patientName: row.patient_name,
      date: row.date,
      language: row.language,
      symptoms: row.symptoms,
      riskLevel: row.risk_level,
      aiSummary: row.ai_summary,
      transcript: row.transcript,
      triggeredReferral: row.triggered_referral,
    })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/consultations
app.post('/api/consultations', async (req, res) => {
  const { patientId, transcript, language } = req.body;
  const id = 'c' + Math.floor(100 + Math.random() * 900);
  const timestamp = new Date().toISOString();

  try {
    // 1. Fetch Patient
    const patientRes = await pool.query('SELECT * FROM patients WHERE id = $1', [patientId]);
    if (patientRes.rows.length === 0) {
       res.status(404).json({ error: 'Patient not found' });
       return;
    }
    const patient = patientRes.rows[0];

    // 2. Extract and pre-process Patient Dialogue turns
    const patientTurns = transcript
      .filter((t: any) => t.speaker !== 'AI')
      .map((t: any) => t.text)
      .join(' ');
    // 3. Triage Classification via Gemini API
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    let matchedSymptoms: string[] = [];
    let aiSummary = 'Routine check-in.';
    let triageReason = 'No specific reason provided.';
    let triggeredReferral = false;

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });
      
      const fullTranscript = Array.isArray(transcript) ? transcript.map((t: any) => `${t.speaker}: ${t.text}`).join('\n') : '';
      const prompt = buildTriagePrompt(fullTranscript);
      
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const parsed = JSON.parse(responseText);
      
      if (Array.isArray(parsed.symptoms)) matchedSymptoms = parsed.symptoms;
      if (typeof parsed.summary === 'string') aiSummary = parsed.summary;
      if (['HIGH', 'MEDIUM', 'LOW'].includes(String(parsed.riskLevel).toUpperCase())) {
        riskLevel = String(parsed.riskLevel).toUpperCase() as 'LOW' | 'MEDIUM' | 'HIGH';
      }
      if (typeof parsed.triageReason === 'string') triageReason = parsed.triageReason;

      console.log(`Demo Triage completed by Gemini. Risk: ${riskLevel}. Reason: ${triageReason}`);
    } catch (error) {
      console.error("Gemini AI failed to process demo transcript:", error);
    }

    triggeredReferral = (riskLevel === 'HIGH' || riskLevel === 'MEDIUM');

    // 5. Insert Consultation Record
    await pool.query(
      `INSERT INTO consultations (id, patient_id, patient_name, date, language, symptoms, risk_level, ai_summary, transcript, triggered_referral)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [id, patientId, patient.name, timestamp.split('T')[0], language, matchedSymptoms, riskLevel, aiSummary, JSON.stringify(transcript), triggeredReferral]
    );

    if (riskLevel !== patient.risk_level) {
      const updatedHistory = patient.risk_history || [];
      updatedHistory.push({ date: timestamp.split('T')[0], level: riskLevel });

      await pool.query(
        `UPDATE patients SET risk_level = $1, risk_history = $2, last_call_date = $3 WHERE id = $4`,
        [riskLevel, JSON.stringify(updatedHistory), timestamp.split('T')[0], patientId]
      );
    } else {
      await pool.query(
        `UPDATE patients SET last_call_date = $1 WHERE id = $2`,
        [timestamp.split('T')[0], patientId]
      );
    }

    res.status(201).json({ 
      success: true, 
      consultationId: id, 
      riskLevel, 
      referralTriggered: false, 
      referralId: null 
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/referrals
app.get('/api/referrals', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM referrals ORDER BY created_at DESC');
    res.json(result.rows.map((row) => ({
      id: row.id,
      patientId: row.patient_id,
      patientName: row.patient_name,
      riskLevel: row.risk_level,
      status: row.status,
      facilityId: row.facility_id,
      facilityName: row.facility_name,
      assignedChw: row.assigned_chw,
      outcome: row.outcome,
      reason: row.reason,
      createdAt: row.created_at,
      timeline: row.timeline,
    })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/referrals
app.post('/api/referrals', async (req, res) => {
  const { patientId, facilityId, reason } = req.body;
  const id = 'r' + Math.floor(100 + Math.random() * 900);
  const timestamp = new Date().toISOString();

  try {
    const patientRes = await pool.query('SELECT * FROM patients WHERE id = $1', [patientId]);
    const facilityRes = await pool.query('SELECT * FROM facilities WHERE id = $1', [facilityId]);

    if (patientRes.rows.length === 0 || facilityRes.rows.length === 0) {
      res.status(404).json({ error: 'Patient or facility not found' });
      return;
    }

    const patient = patientRes.rows[0];
    const facility = facilityRes.rows[0];

    const timeline = JSON.stringify([
      { stage: 'Referral Created', timestamp, note: reason },
    ]);

    await pool.query(
      `INSERT INTO referrals (id, patient_id, patient_name, risk_level, status, facility_id, facility_name, assigned_chw, reason, created_at, timeline) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [id, patientId, patient.name, patient.risk_level, 'Pending', facilityId, facility.name, patient.assigned_chw, reason, timestamp, timeline]
    );

    // Insert to action log
    const logId = 'a' + Math.floor(100 + Math.random() * 900);
    await pool.query(
      `INSERT INTO action_logs (id, patient_id, type, description, timestamp, performed_by) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [logId, patientId, 'Referral', `Referral created to ${facility.name}. Reason: ${reason}`, timestamp, patient.assigned_chw]
    );

    res.status(201).json({ id, success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/referrals/:id
app.patch('/api/referrals/:id', async (req, res) => {
  const { id } = req.params;
  const { status, outcome, note } = req.body;
  const timestamp = new Date().toISOString();

  try {
    const referralRes = await pool.query('SELECT * FROM referrals WHERE id = $1', [id]);
    if (referralRes.rows.length === 0) {
      res.status(404).json({ error: 'Referral not found' });
      return;
    }
    const referral = referralRes.rows[0];
    const timeline = referral.timeline;

    timeline.push({
      stage: status,
      timestamp,
      note: note || undefined,
    });

    await pool.query(
      `UPDATE referrals SET 
        status = $1, 
        outcome = COALESCE($2, outcome), 
        timeline = $3 
       WHERE id = $4`,
      [status, outcome || null, JSON.stringify(timeline), id]
    );

    // Update action logs
    const logId = 'a' + Math.floor(100 + Math.random() * 900);
    await pool.query(
      `INSERT INTO action_logs (id, patient_id, type, description, timestamp, performed_by) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [logId, referral.patient_id, 'Outcome', `Referral status updated to ${status}.${outcome ? ` Outcome: ${outcome}` : ''}`, timestamp, referral.assigned_chw]
    );

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/facilities
app.get('/api/facilities', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM facilities ORDER BY name ASC');
    res.json(result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      distance: row.distance,
      hours: row.hours,
      services: row.services,
      phone: row.phone,
      address: row.address,
    })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/facilities
app.post('/api/facilities', async (req, res) => {
  const { name, distance, hours, services, phone, address } = req.body;
  const id = 'f' + Math.floor(100 + Math.random() * 900);

  try {
    await pool.query(
      `INSERT INTO facilities (id, name, distance, hours, services, phone, address) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, name, distance, hours, services, phone, address]
    );
    res.status(201).json({ id, name, distance, hours, services, phone, address });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/action-logs
app.get('/api/action-logs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM action_logs ORDER BY timestamp DESC');
    res.json(result.rows.map((row) => ({
      id: row.id,
      patientId: row.patient_id,
      type: row.type,
      description: row.description,
      timestamp: row.timestamp,
      performedBy: row.performed_by,
    })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Notifications
app.get('/api/notifications', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM notifications ORDER BY timestamp DESC');
    res.json(result.rows.map((row) => ({
      id: row.id,
      uiType: row.ui_type,
      payload: row.payload,
      isRead: row.is_read,
      timestamp: row.timestamp,
      pathway: row.pathway
    })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/notifications/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE notifications SET is_read = true WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.json({ success: true, notification: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics
// GET /api/analytics
app.get('/api/analytics', async (req, res) => {
  try {
    // KPI values
    const kpisResult = await pool.query('SELECT * FROM kpis');
    const kpisMap: Record<string, number> = {};
    kpisResult.rows.forEach((row) => {
      kpisMap[row.key] = Number(row.value);
    });
    const avgResolutionTime = kpisMap['avg_resolution_time_hrs']
      ? `${kpisMap['avg_resolution_time_hrs']} hrs`
      : 'N/A';
    // Compute follow-up rate from CHW performance
    const followUpRes = await pool.query('SELECT AVG(follow_up_rate) as avg_follow_up FROM chw_performance');
    const followUpRate = followUpRes.rows[0].avg_follow_up
      ? `${Math.round(followUpRes.rows[0].avg_follow_up)}%`
      : 'N/A';

    // Facility performance from DB
    const facilityPerfRes = await pool.query(
      'SELECT facility_name as facility, referrals, resolved, success_rate as successRate, trend FROM facility_performance'
    );
    const facilityPerformance = facilityPerfRes.rows.map((row) => ({
      facility: row.facility,
      referrals: row.referrals,
      resolved: row.resolved,
      successRate: row.successRate,
      trend: row.trend,
    }));

    // Symptom trend from DB
    const symptomTrendRes = await pool.query(
      'SELECT month, headache, bleeding, fatigue, fever FROM symptom_trend ORDER BY month'
    );
    const symptomTrend = symptomTrendRes.rows.map((row) => ({
      month: row.month,
      headache: row.headache,
      bleeding: row.bleeding,
      fatigue: row.fatigue,
      fever: row.fever,
    }));

    // CHW performance
    const chwRes = await pool.query('SELECT * FROM chw_performance');

    // Referral counts
    const referralsCount = await pool.query('SELECT COUNT(*) FROM referrals');
    const resolvedCount = await pool.query("SELECT COUNT(*) FROM referrals WHERE status = 'Resolved'");
    const activeCount = await pool.query("SELECT COUNT(*) FROM patients WHERE risk_level = 'HIGH'");
    const totalReferrals = parseInt(referralsCount.rows[0].count);
    const resolvedReferrals = parseInt(resolvedCount.rows[0].count);
    const resolutionRate = totalReferrals > 0 ? Math.round((resolvedReferrals / totalReferrals) * 100) : 0;

    res.json({
      kpis: {
        totalReferrals,
        avgResolutionTime,
        followUpRate,
        resolutionRate,
        emergencyEscalations: activeCount.rows[0].count,
      },
      chwPerformance: chwRes.rows.map((row) => ({
        chwName: row.chw_name,
        totalCases: row.total_cases,
        followUpRate: row.follow_up_rate,
        resolvedCases: row.resolved_cases,
        activeCases: row.active_cases,
      })),
      facilityPerformance,
      symptomTrend,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/export/analytics
app.get('/api/export/analytics', async (req, res) => {
  try {
    const chwRes = await pool.query('SELECT * FROM chw_performance');
    
    let csv = 'CHW Performance Report\n';
    csv += 'CHW Name,Total Cases,Follow-up Rate (%),Resolved Cases,Active Cases\n';
    chwRes.rows.forEach((row) => {
      csv += `"${row.chw_name}",${row.total_cases},${row.follow_up_rate},${row.resolved_cases},${row.active_cases}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=mamacare_analytics.csv');
    res.status(200).send(csv);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

  // POST /api/sms/send
  app.post('/api/sms/send', async (req, res) => {
    const { to, message, pathway, recipientType, recipientCount, type, appointmentDate, appointmentTime, reminderTiming } = req.body;
    if (!to || !message) {
      res.status(400).json({ error: 'Missing required fields: to, message' });
      return;
    }
    
    try {
      if (type === 'direct') {
        // Dynamic import to avoid issues with ES modules and CommonJS
        // @ts-ignore
        const africastalking = (await import('africastalking')).default;
        const AT = africastalking({
          apiKey: process.env.AFRICASTALKING_API_KEY || '',
          username: process.env.AFRICASTALKING_USERNAME || ''
        });
        
        const options = {
          to: Array.isArray(to) ? to : [to],
          message: message
        };
        
        const response = await AT.SMS.send(options);

        // Log to database
        const id = 'c' + Date.now();
        await pool.query(
          'INSERT INTO communications (id, pathway, recipient_type, recipient_count, message, status, sent_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [id, pathway || 'Unknown', recipientType || 'unknown', recipientCount || to.length, message, 'sent', new Date().toISOString()]
        );

        res.json({ success: true, response });
      } else if (type === 'schedule') {
        // For scheduling, we just log it to the schedules table
        const id = 's' + Date.now();
        await pool.query(
          'INSERT INTO schedules (id, pathway, appointment_date, appointment_time, reminder_timing, message, patients_count, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
          [id, pathway || 'Unknown', appointmentDate || '', appointmentTime || '', reminderTiming || 'none', message, recipientCount || to.length, 'active', new Date().toISOString()]
        );
        res.json({ success: true, status: 'scheduled' });
      } else {
        res.status(400).json({ error: 'Invalid type parameter. Use direct or schedule.' });
      }
    } catch (error: any) {
      console.error('Error sending SMS:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/communications/:pathway
  app.get('/api/communications/:pathway', async (req, res) => {
    try {
      const { pathway } = req.params;
      const result = await pool.query('SELECT * FROM communications WHERE pathway = $1 ORDER BY sent_at DESC', [pathway]);
      res.json(result.rows.map((row) => ({
        id: row.id,
        pathway: row.pathway,
        recipientType: row.recipient_type,
        recipientCount: row.recipient_count,
        message: row.message,
        status: row.status,
        sentAt: row.sent_at
      })));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/schedules/:pathway
  app.get('/api/schedules/:pathway', async (req, res) => {
    try {
      const { pathway } = req.params;
      const result = await pool.query('SELECT * FROM schedules WHERE pathway = $1 ORDER BY created_at DESC', [pathway]);
      res.json(result.rows.map((row) => ({
        id: row.id,
        pathway: row.pathway,
        appointmentDate: row.appointment_date,
        appointmentTime: row.appointment_time,
        reminderTiming: row.reminder_timing,
        message: row.message,
        patientsCount: row.patients_count,
        status: row.status,
        createdAt: row.created_at
      })));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

// GET /api/health
app.get('/api/health', async (req, res) => {
  try {
    // Check DB connection
    await pool.query('SELECT 1');
    res.json({
      status: 'UP',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error: any) {
    res.status(503).json({
      status: 'DOWN',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});

// Serve frontend in production
if (isProd) {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
