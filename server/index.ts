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

const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

// DB Pool configuration
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProd ? { rejectUnauthorized: false } : false,
});

// Run DB Migrations/Schema
async function runMigrations() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(sql);
      console.log('Database migrations completed successfully.');
    } else {
      console.log('schema.sql not found at', schemaPath);
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
    })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/patients (Register Patient)
app.post('/api/patients', async (req, res) => {
  const { name, age, pathway, language, assignedChw, stage } = req.body;
  const id = 'p' + Math.floor(100 + Math.random() * 900);
  const regDate = new Date().toISOString().split('T')[0];
  const initialHistory = JSON.stringify([{ date: regDate, level: 'LOW' }]);

  try {
    await pool.query(
      `INSERT INTO patients (id, name, age, pathway, risk_level, language, assigned_chw, stage, registration_date, risk_history) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [id, name, age, pathway, 'LOW', language, assignedChw || 'Unassigned', stage, regDate, initialHistory]
    );

    // Insert to action log
    const logId = 'a' + Math.floor(100 + Math.random() * 900);
    await pool.query(
      `INSERT INTO action_logs (id, patient_id, type, description, timestamp, performed_by) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [logId, id, 'Registration', `Patient registered for MamaCare programme — ${pathway} pathway`, new Date().toISOString(), assignedChw || 'System']
    );

    // Update KPI
    await pool.query("UPDATE kpis SET value = value + 1 WHERE key = 'total_mothers'");
    await pool.query("UPDATE kpis SET value = value + 1 WHERE key = 'caseload'");

    res.status(201).json({ id, name, age, pathway, riskLevel: 'LOW', language, assignedChw, stage });
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

// GET /api/analytics
app.get('/api/analytics', async (req, res) => {
  try {
    const chwRes = await pool.query('SELECT * FROM chw_performance');
    const referralsCount = await pool.query('SELECT COUNT(*) FROM referrals');
    const resolvedCount = await pool.query("SELECT COUNT(*) FROM referrals WHERE status = 'Resolved'");
    const activeCount = await pool.query("SELECT COUNT(*) FROM patients WHERE risk_level = 'HIGH'");

    const totalReferrals = parseInt(referralsCount.rows[0].count);
    const resolvedReferrals = parseInt(resolvedCount.rows[0].count);
    const resolutionRate = totalReferrals > 0 ? Math.round((resolvedReferrals / totalReferrals) * 100) : 0;

    res.json({
      kpis: {
        totalReferrals,
        avgResolutionTime: '4.2 hrs',
        followUpRate: '91%',
        emergencyEscalations: activeCount.rows[0].count,
      },
      chwPerformance: chwRes.rows.map((row) => ({
        chwName: row.chw_name,
        totalCases: row.total_cases,
        followUpRate: row.follow_up_rate,
        resolvedCases: row.resolved_cases,
        activeCases: row.active_cases,
      })),
      facilityPerformance: [
        { facility: 'Korle-Bu Teaching Hospital', referrals: 12, resolved: 10, successRate: 83, trend: 'up' },
        { facility: 'Komfo Anokye Teaching Hospital', referrals: 8, resolved: 6, successRate: 75, trend: 'down' },
        { facility: 'Greater Accra Regional Hospital', referrals: 5, resolved: 5, successRate: 100, trend: 'stable' },
      ],
      symptomTrend: [
        { month: 'Jan', headache: 4, bleeding: 1, fatigue: 12 },
        { month: 'Feb', headache: 6, bleeding: 2, fatigue: 15 },
        { month: 'Mar', headache: 8, bleeding: 0, fatigue: 10 },
        { month: 'Apr', headache: 12, bleeding: 3, fatigue: 18 },
        { month: 'May', headache: 15, bleeding: 4, fatigue: 20 },
      ]
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

// Serve frontend in production
if (isProd) {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
