-- Drop existing tables if they exist
DROP TABLE IF EXISTS action_logs;
DROP TABLE IF EXISTS referrals;
DROP TABLE IF EXISTS consultations;
DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS facilities;
DROP TABLE IF EXISTS kpis;
DROP TABLE IF EXISTS risk_escalation_feed;
DROP TABLE IF EXISTS chw_performance;

-- Create Facilities table
CREATE TABLE facilities (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    distance VARCHAR(50) NOT NULL,
    hours VARCHAR(100) NOT NULL,
    services TEXT[] NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL
);

-- Create Patients table
CREATE TABLE patients (
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
    blood_pressure VARCHAR(50),
    kick_count INT,
    coping_index INT,
    sleep_quality VARCHAR(50),
    bleeding_status VARCHAR(50)
);

-- Create Consultations table
CREATE TABLE consultations (
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

-- Create Referrals table
CREATE TABLE referrals (
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

-- Create Action Logs table
CREATE TABLE action_logs (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) REFERENCES patients(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    timestamp VARCHAR(50) NOT NULL,
    performed_by VARCHAR(255) NOT NULL
);

-- Create CHW Performance table
CREATE TABLE chw_performance (
    chw_name VARCHAR(255) PRIMARY KEY,
    total_cases INT NOT NULL,
    follow_up_rate INT NOT NULL,
    resolved_cases INT NOT NULL,
    active_cases INT NOT NULL
);

-- Create Risk Escalation Feed table
CREATE TABLE risk_escalation_feed (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(50) REFERENCES patients(id) ON DELETE CASCADE,
    patient_name VARCHAR(255) NOT NULL,
    from_level VARCHAR(20) NOT NULL,
    to_level VARCHAR(20) NOT NULL,
    date VARCHAR(50) NOT NULL,
    reason TEXT NOT NULL
);

-- Create KPIs table
CREATE TABLE kpis (
    key VARCHAR(50) PRIMARY KEY,
    value NUMERIC NOT NULL
);

-- Seed Facilities
INSERT INTO facilities (id, name, distance, hours, services, phone, address) VALUES
('f001', 'Maitama District Hospital', '3.2 km', '24/7 Emergency', ARRAY['Obstetrics', 'Neonatal ICU', 'Emergency', 'Laboratory', 'Ultrasound'], '+234-9-5230-000', 'Umaru Musa Yar''Adua Way, Maitama, Abuja'),
('f002', 'National Hospital Abuja', '5.8 km', '24/7 Emergency', ARRAY['Obstetrics', 'Gynaecology', 'Neonatal ICU', 'Surgery', 'Blood Bank', 'Emergency'], '+234-9-5240-000', 'Independence Avenue, Central District, Abuja'),
('f003', 'Lagos University Teaching Hospital', '12.1 km', '24/7 Emergency', ARRAY['Obstetrics', 'Mental Health', 'Social Work', 'Counselling', 'Laboratory'], '+234-1-5850-000', 'Idi-Araba, Surulere, Lagos'),
('f004', 'Enugu State University Teaching Hospital', '7.4 km', 'Mon-Sat 7AM-9PM, Emergency 24/7', ARRAY['Obstetrics', 'Paediatrics', 'Emergency', 'Laboratory', 'Ultrasound'], '+234-42-2530-000', 'Park Lane, GRA, Enugu');

-- Seed Patients
INSERT INTO patients (id, name, age, pathway, risk_level, language, assigned_chw, stage, last_call_date, registration_date, risk_history, blood_pressure, kick_count, coping_index, sleep_quality, bleeding_status) VALUES
('p001', 'Amina Ibrahim', 27, 'Pregnancy', 'HIGH', 'Hausa', 'Hadiza Bello', '32 weeks', '2026-05-27', '2025-12-10', '[{"date": "2025-12-10", "level": "LOW"}, {"date": "2026-03-15", "level": "MEDIUM"}, {"date": "2026-05-20", "level": "HIGH"}]'::jsonb, '150/95 mmHg', 8, NULL, NULL, NULL),
('p002', 'Chloe Adeyemi', 31, 'Post-Loss', 'MEDIUM', 'Yoruba', 'Funke Alabi', 'Post-loss: 4 months', '2026-05-26', '2026-02-01', '[{"date": "2026-02-01", "level": "HIGH"}, {"date": "2026-04-10", "level": "MEDIUM"}]'::jsonb, NULL, NULL, 5, 'Fair', 'None'),
('p003', 'Fatima Okonkwo', 23, 'Pregnancy', 'LOW', 'Igbo', 'Ngozi Eze', '18 weeks', '2026-05-25', '2026-01-20', '[{"date": "2026-01-20", "level": "LOW"}]'::jsonb, '118/76 mmHg', 12, NULL, NULL, NULL),
('p004', 'Adama Musa', 34, 'Pregnancy', 'HIGH', 'Hausa', 'Hadiza Bello', '36 weeks', '2026-05-28', '2025-09-15', '[{"date": "2025-09-15", "level": "MEDIUM"}, {"date": "2025-12-20", "level": "MEDIUM"}, {"date": "2026-04-01", "level": "HIGH"}]'::jsonb, '160/100 mmHg', 4, NULL, NULL, NULL),
('p005', 'Ngochi Nwankwo', 26, 'Pregnancy', 'MEDIUM', 'Igbo', 'Ngozi Eze', '24 weeks', '2026-05-24', '2025-11-30', '[{"date": "2025-11-30", "level": "LOW"}, {"date": "2026-03-20", "level": "MEDIUM"}]'::jsonb, '135/88 mmHg', 10, NULL, NULL, NULL),
('p006', 'Bisi Ogunleye', 29, 'Post-Loss', 'LOW', 'Yoruba', 'Funke Alabi', 'Post-loss: 8 months', '2026-05-22', '2025-10-05', '[{"date": "2025-10-05", "level": "HIGH"}, {"date": "2025-12-15", "level": "MEDIUM"}, {"date": "2026-03-01", "level": "LOW"}]'::jsonb, NULL, NULL, 8, 'Good', 'None');

-- Seed Consultations
INSERT INTO consultations (id, patient_id, patient_name, date, language, symptoms, risk_level, ai_summary, transcript, triggered_referral) VALUES
('c001', 'p001', 'Amina Ibrahim', '2026-05-27', 'Hausa', ARRAY['severe headache', 'blurred vision', 'swollen feet'], 'HIGH', 'Patient reports severe headache persisting for 3 days, blurred vision, and noticeable swelling in both feet. Blood pressure reading at 150/95 mmHg. These symptoms are consistent with pre-eclampsia warning signs. Immediate referral recommended.', '[{"text": "Sannu Amina, yaya lafiyar ku a yau? Na ji labarin ciwon kai ku.", "speaker": "AI"}, {"text": "Lafiya ba ta da kyau. Na ci ciwon kai na tsawon kwanaki uku kuma na ga abubuwa ba su da kyau.", "speaker": "Mother"}, {"text": "Kuna ganin wani canji a kafafu ku?", "speaker": "AI"}, {"text": "Ee, kafafu na sun kumbura sosai.", "speaker": "Mother"}, {"text": "Na gane matsalar. Zan tura ku asibiti da sauri don duba lafiyar ku da jaririn ku.", "speaker": "AI"}]'::jsonb, TRUE),
('c002', 'p002', 'Chloe Adeyemi', '2026-05-26', 'Yoruba', ARRAY['difficulty sleeping', 'persistent sadness', 'low appetite'], 'MEDIUM', 'Patient continues to experience grief-related symptoms 4 months post-loss. Sleep quality has slightly improved from Poor to Fair. Coping index remains at 5/10. Recommend continued counselling sessions and community support group referral.', '[{"text": "Bawo ni Chloe? Se alafia ni?", "speaker": "AI"}, {"text": "Eeyan ko too daadaa. Ojo oniruuru ti n sun, ati pe erin pe mi.", "speaker": "Mother"}, {"text": "Mo royin re. Se o ti lo ibi ipadanu to gba ni?", "speaker": "AI"}, {"text": "Bee ni, sugbon ko too pese atilereyin to un se.", "speaker": "Mother"}]'::jsonb, FALSE),
('c003', 'p003', 'Fatima Okonkwo', '2026-05-25', 'Igbo', ARRAY['mild nausea', 'normal fatigue'], 'LOW', 'Patient reports mild nausea and normal pregnancy-related fatigue at 18 weeks. Blood pressure stable at 118/76 mmHg. Baby kick count is within normal range. No danger signs identified. Continue routine ANC schedule.', '[{"text": "Nno Fatima, kedu ka i mere?", "speaker": "AI"}, {"text": "A dim mma, mana na-enwe mgbe ụfọdụ na-eso nri.", "speaker": "Mother"}, {"text": "O dị mma. Gbasara ịma nwa, ị na-ahụkwaghị ọgba aghara?", "speaker": "AI"}, {"text": "Mba, nwa na-agagharị nke ọma.", "speaker": "Mother"}]'::jsonb, FALSE),
('c004', 'p004', 'Adama Musa', '2026-05-28', 'Hausa', ARRAY['reduced fetal movement', 'severe abdominal pain', 'dizziness'], 'HIGH', 'Patient at 36 weeks reports significantly reduced fetal movement (kick count: 4), severe abdominal pain, and episodes of dizziness. Blood pressure at 160/100 mmHg is critically elevated. URGENT: Immediate emergency referral activated for possible placental abruption.', '[{"text": "Adama, yaya lafiyar ku? Kai tsanani ne?", "speaker": "AI"}, {"text": "Ina jin zafi mai tsanani a ciki. Kuma jaririn baya motsawa kamar yadda ya saba.", "speaker": "Mother"}, {"text": "Da sauri, muna bukatar ku je asibiti nan take. Zan tura muku agajin gaggawa.", "speaker": "AI"}]'::jsonb, TRUE),
('c005', 'p005', 'Ngochi Nwankwo', '2026-05-24', 'Igbo', ARRAY['mild back pain', 'occasional headaches'], 'MEDIUM', 'Patient at 24 weeks reports mild back pain and occasional headaches. Blood pressure slightly elevated at 135/88 mmHg, warranting closer monitoring. No proteinuria detected. Scheduled for follow-up in 1 week.', '[{"text": "Ndeewo Ngochi, kedu ka ahụ ike dị?", "speaker": "AI"}, {"text": "O siri ike n\'ukwu azụ m, ma na-enwe isi ọma ụfọdụ.", "speaker": "Mother"}, {"text": "Anyị ga-achọ iso gi gbaa mbọ. Biko bịa ọzọ n\'izu na-abịa.", "speaker": "AI"}]'::jsonb, FALSE),
('c006', 'p006', 'Bisi Ogunleye', '2026-05-22', 'Yoruba', ARRAY['improved mood', 'better sleep'], 'LOW', 'Patient shows continued improvement 8 months post-loss. Coping index increased to 8/10. Sleep quality improved to Good. Actively participating in community support group. Recommend transitioning to quarterly check-ins.', '[{"text": "Bawo ni Bisi? Nibo lo wa loni?", "speaker": "AI"}, {"text": "Mo d\'ara pupọ nisisiyi. Sun mi dara, ati pe mo nifẹ si awọn iṣẹ ṣiṣe.", "speaker": "Mother"}, {"text": "Eyi n dara! A o pade ni osu to nbo.", "speaker": "AI"}]'::jsonb, FALSE);

-- Seed Referrals
INSERT INTO referrals (id, patient_id, patient_name, risk_level, status, facility_id, facility_name, assigned_chw, outcome, reason, created_at, timeline) VALUES
('r001', 'p001', 'Amina Ibrahim', 'HIGH', 'In Transit', 'f001', 'Maitama District Hospital', 'Hadiza Bello', NULL, 'Pre-eclampsia warning signs detected', '2026-05-27T09:30:00Z', '[{"note": "Pre-eclampsia warning signs detected", "stage": "Referral Created", "timestamp": "2026-05-27T09:30:00Z"}, {"stage": "Ambulance Dispatched", "timestamp": "2026-05-27T09:45:00Z"}, {"note": "ETA 25 minutes", "stage": "In Transit", "timestamp": "2026-05-27T10:00:00Z"}]'::jsonb),
('r002', 'p004', 'Adama Musa', 'HIGH', 'Pending', 'f002', 'National Hospital Abuja', 'Hadiza Bello', NULL, 'Emergency: possible placental abruption at 36 weeks', '2026-05-28T08:15:00Z', '[{"note": "Emergency: possible placental abruption at 36 weeks", "stage": "Referral Created", "timestamp": "2026-05-28T08:15:00Z"}]'::jsonb),
('r003', 'p002', 'Chloe Adeyemi', 'MEDIUM', 'Admitted', 'f003', 'Lagos University Teaching Hospital', 'Funke Alabi', 'Receiving grief counselling', 'Counselling referral for grief management', '2026-05-20T11:00:00Z', '[{"note": "Counselling referral for grief management", "stage": "Referral Created", "timestamp": "2026-05-20T11:00:00Z"}, {"stage": "In Transit", "timestamp": "2026-05-20T11:30:00Z"}, {"note": "Enrolled in intensive counselling programme", "stage": "Admitted", "timestamp": "2026-05-20T12:15:00Z"}]'::jsonb),
('r004', 'p003', 'Fatima Okonkwo', 'LOW', 'Resolved', 'f004', 'Enugu State University Teaching Hospital', 'Ngozi Eze', 'Routine check-up completed, all normal', 'Routine ANC check-up', '2026-05-10T14:00:00Z', '[{"note": "Routine ANC check-up", "stage": "Referral Created", "timestamp": "2026-05-10T14:00:00Z"}, {"stage": "In Transit", "timestamp": "2026-05-10T14:20:00Z"}, {"stage": "Admitted", "timestamp": "2026-05-10T15:00:00Z"}, {"note": "All vitals normal, follow-up in 4 weeks", "stage": "Resolved", "timestamp": "2026-05-10T16:30:00Z"}]'::jsonb);

-- Seed Action Logs
INSERT INTO action_logs (id, patient_id, type, description, timestamp, performed_by) VALUES
('a001', 'p001', 'Alert', 'Risk level escalated to HIGH — pre-eclampsia warning signs detected during AI consultation', '2026-05-27T09:28:00Z', 'System'),
('a002', 'p001', 'Referral', 'Emergency referral created to Maitama District Hospital', '2026-05-27T09:30:00Z', 'Hadiza Bello'),
('a003', 'p004', 'Alert', 'Risk level escalated to HIGH — reduced fetal movement and critically elevated blood pressure (160/100)', '2026-05-28T08:12:00Z', 'System'),
('a004', 'p004', 'Referral', 'Emergency referral created to National Hospital Abuja — possible placental abruption', '2026-05-28T08:15:00Z', 'Hadiza Bello'),
('a005', 'p002', 'Call', 'Follow-up call completed — patient reports continued grief symptoms, coping index unchanged at 5/10', '2026-05-26T10:00:00Z', 'Funke Alabi'),
('a006', 'p003', 'Visit', 'Routine ANC visit completed — all vitals normal, pregnancy progressing well at 18 weeks', '2026-05-25T14:00:00Z', 'Ngozi Eze'),
('a007', 'p005', 'Vitals', 'Blood pressure slightly elevated at 135/88 mmHg during routine check — scheduled follow-up in 1 week', '2026-05-24T11:30:00Z', 'Ngozi Eze'),
('a008', 'p006', 'Outcome', 'Quarterly review — coping index improved to 8/10, sleep quality rated Good. Transitioning to quarterly check-ins', '2026-05-22T09:00:00Z', 'Funke Alabi'),
('a009', 'p001', 'Vitals', 'Blood pressure reading: 150/95 mmHg — above normal range', '2026-05-27T09:25:00Z', 'System'),
('a010', 'p004', 'Registration', 'Patient registered for MamaCare programme — high-risk pregnancy, age 34', '2025-09-15T08:00:00Z', 'Hadiza Bello');

-- Seed CHW Performance
INSERT INTO chw_performance (chw_name, total_cases, follow_up_rate, resolved_cases, active_cases) VALUES
('Hadiza Bello', 2, 95, 0, 2),
('Funke Alabi', 2, 88, 1, 1),
('Ngozi Eze', 2, 92, 1, 1);

-- Seed Risk Escalation Feed
INSERT INTO risk_escalation_feed (patient_id, patient_name, from_level, to_level, date, reason) VALUES
('p001', 'Amina Ibrahim', 'MEDIUM', 'HIGH', '2026-05-20', 'Pre-eclampsia warning signs: severe headache, blurred vision, elevated BP 150/95'),
('p004', 'Adama Musa', 'MEDIUM', 'HIGH', '2026-04-01', 'Persistently elevated blood pressure at 36 weeks gestation'),
('p005', 'Ngochi Nwankwo', 'LOW', 'MEDIUM', '2026-03-20', 'Blood pressure trending upward, mild headaches reported'),
('p002', 'Chloe Adeyemi', 'HIGH', 'MEDIUM', '2026-04-10', 'Coping index improved from 3 to 5, sleep quality improved to Fair'),
('p006', 'Bisi Ogunleye', 'MEDIUM', 'LOW', '2026-03-01', 'Consistent improvement in coping index and sleep quality over 5 months');

-- Seed KPIs
INSERT INTO kpis (key, value) VALUES
('total_mothers', 6),
('high_risk', 2),
('pending_actions', 4),
('resolution_rate', 78),
('caseload', 6),
('pending_visits', 4),
('unresolved_danger', 2);
