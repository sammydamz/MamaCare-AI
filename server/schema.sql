-- Idempotent schema for MamaCare AI prototype

-- Facilities
CREATE TABLE IF NOT EXISTS facilities (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    distance VARCHAR(50) NOT NULL,
    hours VARCHAR(100) NOT NULL,
    services TEXT[] NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL
);

-- Patients
CREATE TABLE IF NOT EXISTS patients (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    pathway VARCHAR(50) NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    language VARCHAR(50) NOT NULL,
    assigned_chw VARCHAR(255) NOT NULL,
    stage VARCHAR(100) NOT NULL,
    last_call_date VARCHAR(50),
    registration_date VARCHAR(50) NOT NULL,
    risk_history JSONB NOT NULL DEFAULT '[]'::jsonb,
    coping_index INT
);

-- Consultations
CREATE TABLE IF NOT EXISTS consultations (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) REFERENCES patients(id) ON DELETE CASCADE,
    patient_name VARCHAR(255) NOT NULL,
    date VARCHAR(50) NOT NULL,
    language VARCHAR(50) NOT NULL,
    symptoms TEXT[] NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    ai_summary TEXT NOT NULL,
    transcript JSONB NOT NULL DEFAULT '[]'::jsonb,
    triggered_referral BOOLEAN NOT NULL DEFAULT FALSE
);

-- Referrals
CREATE TABLE IF NOT EXISTS referrals (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) REFERENCES patients(id) ON DELETE CASCADE,
    patient_name VARCHAR(255) NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    status VARCHAR(50) NOT NULL,
    facility_id VARCHAR(50) REFERENCES facilities(id),
    facility_name VARCHAR(255) NOT NULL,
    assigned_chw VARCHAR(255) NOT NULL,
    outcome VARCHAR(255),
    reason TEXT,
    created_at VARCHAR(50) NOT NULL,
    timeline JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- Action Logs
CREATE TABLE IF NOT EXISTS action_logs (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) REFERENCES patients(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    timestamp VARCHAR(50) NOT NULL,
    performed_by VARCHAR(255) NOT NULL
);

-- CHW Performance
CREATE TABLE IF NOT EXISTS chw_performance (
    chw_name VARCHAR(255) PRIMARY KEY,
    total_cases INT NOT NULL,
    follow_up_rate INT NOT NULL,
    resolved_cases INT NOT NULL,
    active_cases INT NOT NULL
);

-- Risk Escalation Feed
CREATE TABLE IF NOT EXISTS risk_escalation_feed (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(50) REFERENCES patients(id) ON DELETE CASCADE,
    patient_name VARCHAR(255) NOT NULL,
    from_level VARCHAR(20) NOT NULL,
    to_level VARCHAR(20) NOT NULL,
    date VARCHAR(50) NOT NULL,
    reason TEXT NOT NULL
);

-- KPIs
CREATE TABLE IF NOT EXISTS kpis (
    key VARCHAR(50) PRIMARY KEY,
    value NUMERIC NOT NULL
);

-- Facility Performance (analytics)
CREATE TABLE IF NOT EXISTS facility_performance (
    facility_name VARCHAR(255) PRIMARY KEY,
    referrals INT NOT NULL,
    resolved INT NOT NULL,
    success_rate NUMERIC NOT NULL,
    trend VARCHAR(20) NOT NULL
);

-- Symptom Trend (analytics)
CREATE TABLE IF NOT EXISTS symptom_trend (
    month VARCHAR(20) PRIMARY KEY,
    headache INT NOT NULL,
    bleeding INT NOT NULL,
    fatigue INT NOT NULL,
    fever INT NOT NULL
);

-- Users
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    fullname VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT TRUE,
    occupation VARCHAR(255),
    company_name VARCHAR(255),
    phone VARCHAR(50),
    pic TEXT,
    language VARCHAR(10) DEFAULT 'en',
    is_admin BOOLEAN DEFAULT FALSE
);

-- Seed data (use ON CONFLICT DO NOTHING to avoid duplicate inserts)
INSERT INTO facilities (id, name, distance, hours, services, phone, address) VALUES
    ('f001', 'Korle-Bu Teaching Hospital', '2.8 km', '24/7 Emergency', ARRAY['Obstetrics', 'Neonatal ICU', 'Emergency', 'Laboratory', 'Ultrasound'], '+233-30-267-3000', 'Guggisberg Avenue, Korle Gonno, Accra'),
    ('f002', 'Komfo Anokye Teaching Hospital', '5.4 km', '24/7 Emergency', ARRAY['Obstetrics', 'Gynaecology', 'Neonatal ICU', 'Surgery', 'Blood Bank', 'Emergency'], '+233-32-202-2301', 'Bantama High Street, Bantama, Kumasi'),
    ('f003', 'Greater Accra Regional Hospital', '4.2 km', '24/7 Emergency', ARRAY['Obstetrics', 'Mental Health', 'Social Work', 'Counselling', 'Laboratory'], '+233-30-222-8315', 'Castle Road, Ridge, Accra'),
    ('f004', 'Tamale Teaching Hospital', '9.1 km', 'Mon-Sat 7AM-9PM, Emergency 24/7', ARRAY['Obstetrics', 'Paediatrics', 'Emergency', 'Laboratory', 'Ultrasound'], '+233-37-202-2415', 'Hospital Road, Tamale')
ON CONFLICT DO NOTHING;

INSERT INTO users (id, username, email, password, first_name, last_name, fullname, email_verified, occupation, company_name, phone, pic, language, is_admin) VALUES
    ('user-001', 'sarahc', 'sarac@kbth.com', 'demo123', 'Sarah', 'Coffie', 'Sarah Coffie', true, 'Healthcare Professional', 'Korle Bu Teaching Hospital', '+233 20 123 4567', 'https://images.pexels.com/photos/29852895/pexels-photo-29852895.jpeg', 'en', true)
ON CONFLICT DO NOTHING;

INSERT INTO patients (id, name, age, pathway, risk_level, language, assigned_chw, stage, last_call_date, registration_date, risk_history, coping_index) VALUES
    ('p001', 'Abena Osei', 27, 'Pregnancy', 'HIGH', 'Twi', 'Grace Mensah', '32 weeks', '2026-05-27', '2025-12-10', '[{"date": "2025-12-10", "level": "LOW"}, {"date": "2026-03-15", "level": "MEDIUM"}, {"date": "2026-05-20", "level": "HIGH"}]'::jsonb, NULL),
    ('p002', 'Efua Mensah', 31, 'Post-Loss', 'MEDIUM', 'Fante', 'Comfort Asante', 'Post-loss: 4 months', '2026-05-26', '2026-02-01', '[{"date": "2026-02-01", "level": "HIGH"}, {"date": "2026-04-10", "level": "MEDIUM"}]'::jsonb, 5),
    ('p003', 'Akosua Addo', 23, 'Pregnancy', 'LOW', 'Twi', 'Grace Mensah', '18 weeks', '2026-05-25', '2026-01-20', '[{"date": "2026-01-20", "level": "LOW"}]'::jsonb, NULL),
    ('p004', 'Ama Serwaa', 34, 'Pregnancy', 'HIGH', 'Twi', 'Comfort Asante', '36 weeks', '2026-05-28', '2025-09-15', '[{"date": "2025-09-15", "level": "MEDIUM"}, {"date": "2025-12-20", "level": "MEDIUM"}, {"date": "2026-04-01", "level": "HIGH"}]'::jsonb, NULL),
    ('p005', 'Yaa Ansah', 26, 'Pregnancy', 'MEDIUM', 'Ga', 'Mercy Owusu', '24 weeks', '2026-05-24', '2025-11-30', '[{"date": "2025-11-30", "level": "LOW"}, {"date": "2026-03-20", "level": "MEDIUM"}]'::jsonb, NULL),
    ('p006', 'Esi Naadu', 29, 'Post-Loss', 'LOW', 'Ewe', 'Mercy Owusu', 'Post-loss: 8 months', '2026-05-22', '2025-10-05', '[{"date": "2025-10-05", "level": "HIGH"}, {"date": "2025-12-15", "level": "MEDIUM"}, {"date": "2026-03-01", "level": "LOW"}]'::jsonb, 8)
ON CONFLICT DO NOTHING;

INSERT INTO consultations (id, patient_id, patient_name, date, language, symptoms, risk_level, ai_summary, transcript, triggered_referral) VALUES
    ('c001', 'p001', 'Abena Osei', '2026-05-27', 'Twi', ARRAY['severe headache', 'blurred vision', 'swollen feet'], 'HIGH', 'Patient reports severe headache persisting for 3 days, blurred vision, and noticeable swelling in both feet. Blood pressure reading at 150/95 mmHg. These symptoms are consistent with pre-eclampsia warning signs. Immediate referral recommended.', '[{"text": "Mema wo akye Abena, wo ho te sen nnɛ? Masan ate sɛ wo ti pae wo.", "speaker": "AI"}, {"text": "Me ho nnye koraa. Minya ti pae yi nnansa ni, ɛnna m''ani so repupuw me.", "speaker": "Mother"}, {"text": "Wahu sɛ wo nan ahome/akuku anaa?", "speaker": "AI"}, {"text": "Aane, me nan abobow koraa.", "speaker": "Mother"}, {"text": "Mate aseɛ. Ɛsɛ sɛ wokɔ asopiti ntɛmara na yɛahwɛ wo ne wo ba no yie.", "speaker": "AI"}]'::jsonb, TRUE),
    ('c002', 'p002', 'Efua Mensah', '2026-05-26', 'Fante', ARRAY['difficulty sleeping', 'persistent sadness', 'low appetite'], 'MEDIUM', 'Patient continues to experience grief-related symptoms 4 months post-loss. Sleep quality has slightly improved from Poor to Fair. Coping index remains at 5/10. Recommend continued counselling sessions and community support group referral.', '[{"text": "Ibotae Efua? Wo ho te dɛn?", "speaker": "AI"}, {"text": "Hom nnye koraa. Menda yie, ɛnna medidi mpo a mempɛ.", "speaker": "Mother"}, {"text": "Mate ase. Ɛnnɛ wotumi kɔɔ counselling afahyɛ no bi?", "speaker": "AI"}, {"text": "Nyew, naaso nkabom no nnuru baabiara.", "speaker": "Mother"}]'::jsonb, FALSE),
    ('c003', 'p003', 'Akosua Addo', '2026-05-25', 'Twi', ARRAY['mild nausea', 'normal fatigue'], 'LOW', 'Patient reports mild nausea and normal pregnancy-related fatigue at 18 weeks. Blood pressure stable at 118/76 mmHg. Baby kick count is within normal range. No danger signs identified. Continue routine ANC schedule.', '[{"text": "Maakye Akosua, wo ho te sen?", "speaker": "AI"}, {"text": "Me ho yɛ, nanso me bo repupuw me kakra.", "speaker": "Mother"}, {"text": "Ɛyɛ. Wo ba no tutu nso wote ne nka?", "speaker": "AI"}, {"text": "Aane, outubro yie paa.", "speaker": "Mother"}]'::jsonb, FALSE),
    ('c004', 'p004', 'Ama Serwaa', '2026-05-28', 'Twi', ARRAY['reduced fetal movement', 'severe abdominal pain', 'dizziness'], 'HIGH', 'Patient at 36 weeks reports significantly reduced fetal movement (kick count: 4), severe abdominal pain, and episodes of dizziness. Blood pressure at 160/100 mmHg is critically elevated. URGENT: Immediate emergency referral activated for possible placental abruption.', '[{"text": "Ama, wo ho te dɛn? Ɛyɛ ya paa?", "speaker": "AI"}, {"text": "Me yam repae me paa. Bio nso, me ba no ntutu koraa te sɛ daa no.", "speaker": "Mother"}, {"text": "Ntɛmara, ɛsɛ sɛ wokɔ asopiti sesiaa. Mɛbɔ dawur ama ambulance abɛfa wo.", "speaker": "AI"}]'::jsonb, TRUE),
    ('c005', 'p005', 'Yaa Ansah', '2026-05-24', 'Ga', ARRAY['mild back pain', 'occasional headaches'], 'MEDIUM', 'Patient at 24 weeks reports mild back pain and occasional headaches. Blood pressure slightly elevated at 135/88 mmHg, warranting closer monitoring. No proteinuria detected. Scheduled for follow-up in 1 week.', '[{"text": "Teekpa Yaa, te oye tɛŋ?", "speaker": "AI"}, {"text": "Minaa hejɔlɛ yɛ mikwɛŋ, eye mipaŋ fioo nso.", "speaker": "Mother"}, {"text": "Eye kpakpa. Hɛɛ mɔ mɛni okyɛɛ kɛbashi otsi nyɛŋma loo?", "speaker": "AI"}, {"text": "Hɛɛ, mɛba dɛŋŋ otsi ni baa lɛ mli.", "speaker": "Mother"}]'::jsonb, FALSE),
    ('c006', 'p006', 'Esi Naadu', '2026-05-22', 'Ewe', ARRAY['improved mood', 'better sleep'], 'LOW', 'Patient shows continued improvement 8 months post-loss. Coping index increased to 8/10. Sleep quality improved to Good. Actively participating in community support group. Recommend transitioning to quarterly check-ins.', '[{"text": "Ŋdi na wò Esi. Ɛfoa?", "speaker": "AI"}, {"text": "Mefo nyuie. Medɔ alɔ̃ nyuie, eye nye dzi nɔ fa fifia.", "speaker": "Mother"}, {"text": "Eyo, edze na wò! Míado go le ɣleti gbɔgbɔ mli.", "speaker": "AI"}]'::jsonb, FALSE)
ON CONFLICT DO NOTHING;

INSERT INTO referrals (id, patient_id, patient_name, risk_level, status, facility_id, facility_name, assigned_chw, outcome, reason, created_at, timeline) VALUES
    ('r001', 'p001', 'Abena Osei', 'HIGH', 'In Transit', 'f001', 'Korle-Bu Teaching Hospital', 'Grace Mensah', NULL, 'Pre-eclampsia warning signs detected', '2026-05-27T09:30:00Z', '[{"note": "Pre-eclampsia warning signs detected", "stage": "Referral Created", "timestamp": "2026-05-27T09:30:00Z"}, {"stage": "Ambulance Dispatched", "timestamp": "2026-05-27T09:45:00Z"}, {"note": "ETA 25 minutes", "stage": "In Transit", "timestamp": "2026-05-27T10:00:00Z"}]'::jsonb),
    ('r002', 'p004', 'Ama Serwaa', 'HIGH', 'Pending', 'f002', 'Komfo Anokye Teaching Hospital', 'Comfort Asante', NULL, 'Emergency: possible placental abruption at 36 weeks', '2026-05-28T08:15:00Z', '[{"note": "Emergency: possible placental abruption at 36 weeks", "stage": "Referral Created", "timestamp": "2026-05-28T08:15:00Z"}]'::jsonb),
    ('r003', 'p002', 'Efua Mensah', 'MEDIUM', 'Admitted', 'f003', 'Greater Accra Regional Hospital', 'Comfort Asante', 'Receiving grief counselling', 'Counselling referral for grief management', '2026-05-20T11:00:00Z', '[{"note": "Counselling referral for grief management", "stage": "Referral Created", "timestamp": "2026-05-20T11:00:00Z"}, {"stage": "In Transit", "timestamp": "2026-05-20T11:30:00Z"}, {"note": "Enrolled in intensive counselling programme", "stage": "Admitted", "timestamp": "2026-05-20T12:15:00Z"}]'::jsonb),
    ('r004', 'p003', 'Akosua Addo', 'LOW', 'Resolved', 'f004', 'Tamale Teaching Hospital', 'Grace Mensah', 'Routine check-up completed, all normal', 'Routine ANC check-up', '2026-05-10T14:00:00Z', '[{"note": "Routine ANC check-up", "stage": "Referral Created", "timestamp": "2026-05-10T14:00:00Z"}, {"stage": "In Transit", "timestamp": "2026-05-10T14:20:00Z"}, {"stage": "Admitted", "timestamp": "2026-05-10T15:00:00Z"}, {"note": "All vitals normal, follow-up in 4 weeks", "stage": "Resolved", "timestamp": "2026-05-10T16:30:00Z"}]'::jsonb)
ON CONFLICT DO NOTHING;

INSERT INTO action_logs (id, patient_id, type, description, timestamp, performed_by) VALUES
    ('a001', 'p001', 'Alert', 'Risk level escalated to HIGH — pre-eclampsia warning signs detected during AI consultation', '2026-05-27T09:28:00Z', 'System'),
    ('a002', 'p001', 'Referral', 'Emergency referral created to Korle-Bu Teaching Hospital', '2026-05-27T09:30:00Z', 'Grace Mensah'),
    ('a003', 'p004', 'Alert', 'Risk level escalated to HIGH — reduced fetal movement and critically elevated blood pressure (160/100)', '2026-05-28T08:12:00Z', 'System'),
    ('a004', 'p004', 'Referral', 'Emergency referral created to Komfo Anokye Teaching Hospital — possible placental abruption', '2026-05-28T08:15:00Z', 'Comfort Asante'),
    ('a005', 'p002', 'Call', 'Follow-up call completed — patient reports continued grief symptoms, coping index unchanged at 5/10', '2026-05-26T10:00:00Z', 'Comfort Asante'),
    ('a006', 'p003', 'Visit', 'Routine ANC visit completed — all vitals normal, pregnancy progressing well at 18 weeks', '2026-05-25T14:00:00Z', 'Grace Mensah'),
    ('a007', 'p005', 'Vitals', 'Blood pressure slightly elevated at 135/88 mmHg during routine check — scheduled follow-up in 1 week', '2026-05-24T11:30:00Z', 'Mercy Owusu'),
    ('a008', 'p006', 'Outcome', 'Quarterly review — coping index improved to 8/10, sleep quality rated Good. Transitioning to quarterly check-ins', '2026-05-22T09:00:00Z', 'Mercy Owusu'),
    ('a009', 'p001', 'Vitals', 'Blood pressure reading: 150/95 mmHg — above normal range', '2026-05-27T09:25:00Z', 'System'),
    ('a010', 'p004', 'Registration', 'Patient registered for MamaCare programme — high-risk pregnancy, age 34', '2025-09-15T08:00:00Z', 'Comfort Asante')
ON CONFLICT DO NOTHING;

INSERT INTO chw_performance (chw_name, total_cases, follow_up_rate, resolved_cases, active_cases) VALUES
    ('Grace Mensah', 2, 95, 0, 2),
    ('Comfort Asante', 2, 88, 1, 1),
    ('Mercy Owusu', 2, 92, 1, 1)
ON CONFLICT DO NOTHING;

INSERT INTO risk_escalation_feed (patient_id, patient_name, from_level, to_level, date, reason) VALUES
    ('p001', 'Abena Osei', 'MEDIUM', 'HIGH', '2026-05-20', 'Pre-eclampsia warning signs: severe headache, blurred vision, elevated BP 150/95'),
    ('p004', 'Ama Serwaa', 'MEDIUM', 'HIGH', '2026-04-01', 'Persistently elevated blood pressure at 36 weeks gestation'),
    ('p005', 'Yaa Ansah', 'LOW', 'MEDIUM', '2026-03-20', 'Blood pressure trending upward, mild headaches reported'),
    ('p002', 'Efua Mensah', 'HIGH', 'MEDIUM', '2026-04-10', 'Coping index improved from 3 to 5, sleep quality improved to Fair'),
    ('p006', 'Esi Naadu', 'MEDIUM', 'LOW', '2026-03-01', 'Consistent improvement in coping index and sleep quality over 5 months')
ON CONFLICT DO NOTHING;

INSERT INTO kpis (key, value) VALUES
    ('total_mothers', 6),
    ('high_risk', 2),
    ('pending_actions', 4),
    ('resolution_rate', 78),
    ('caseload', 6),
    ('pending_visits', 4),
    ('unresolved_danger', 2),
    ('avg_resolution_time_hrs', 4.2)
ON CONFLICT DO NOTHING;

INSERT INTO facility_performance (facility_name, referrals, resolved, success_rate, trend) VALUES
    ('Korle-Bu Teaching Hospital', 5, 1, 80, 'up'),
    ('Komfo Anokye Teaching Hospital', 3, 0, 0, 'down'),
    ('Greater Accra Regional Hospital', 2, 2, 100, 'up'),
    ('Tamale Teaching Hospital', 1, 0, 0, 'down')
ON CONFLICT DO NOTHING;

INSERT INTO symptom_trend (month, headache, bleeding, fatigue, fever) VALUES
    ('Jan', 2, 0, 1, 0),
    ('Feb', 3, 1, 2, 0),
    ('Mar', 4, 0, 3, 0),
    ('Apr', 5, 1, 4, 1),
    ('May', 3, 0, 2, 0)
ON CONFLICT DO NOTHING;
