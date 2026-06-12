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
    coping_index INT,
    phone VARCHAR(50)
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
    triggered_referral BOOLEAN NOT NULL DEFAULT FALSE,
    audio_url TEXT
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

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY,
    ui_type VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL,
    is_read BOOLEAN DEFAULT false,
    timestamp VARCHAR(50) NOT NULL,
    pathway VARCHAR(50) NOT NULL
);

-- Communications
CREATE TABLE IF NOT EXISTS communications (
    id VARCHAR(50) PRIMARY KEY,
    pathway VARCHAR(50) NOT NULL,
    recipient_type VARCHAR(50) NOT NULL,
    recipient_count INTEGER NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    sent_at VARCHAR(50) NOT NULL
);

-- Schedules
CREATE TABLE IF NOT EXISTS schedules (
    id VARCHAR(50) PRIMARY KEY,
    pathway VARCHAR(50) NOT NULL,
    appointment_date VARCHAR(50) NOT NULL,
    appointment_time VARCHAR(50) NOT NULL,
    reminder_timing VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    patients_count INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at VARCHAR(50) NOT NULL
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
    ('p001', 'Abena Osei', 27, 'Pregnancy', 'HIGH', 'English', 'Grace Mensah', '32 weeks', '2026-05-27', '2025-12-10', '[{"date": "2025-12-10", "level": "LOW"}, {"date": "2026-03-15", "level": "MEDIUM"}, {"date": "2026-05-20", "level": "HIGH"}]'::jsonb, NULL),
    ('p002', 'Efua Mensah', 31, 'Post-Loss', 'MEDIUM', 'English', 'Comfort Asante', 'Post-loss: 4 months', '2026-05-26', '2026-02-01', '[{"date": "2026-02-01", "level": "HIGH"}, {"date": "2026-04-10", "level": "MEDIUM"}]'::jsonb, 5),
    ('p003', 'Akosua Addo', 23, 'Pregnancy', 'LOW', 'English', 'Grace Mensah', '18 weeks', '2026-05-25', '2026-01-20', '[{"date": "2026-01-20", "level": "LOW"}]'::jsonb, NULL),
    ('p004', 'Ama Serwaa', 34, 'Pregnancy', 'HIGH', 'English', 'Comfort Asante', '36 weeks', '2026-05-28', '2025-09-15', '[{"date": "2025-09-15", "level": "MEDIUM"}, {"date": "2025-12-20", "level": "MEDIUM"}, {"date": "2026-04-01", "level": "HIGH"}]'::jsonb, NULL),
    ('p005', 'Yaa Ansah', 26, 'Pregnancy', 'MEDIUM', 'English', 'Mercy Owusu', '24 weeks', '2026-05-24', '2025-11-30', '[{"date": "2025-11-30", "level": "LOW"}, {"date": "2026-03-20", "level": "MEDIUM"}]'::jsonb, NULL),
    ('p006', 'Esi Naadu', 29, 'Post-Loss', 'LOW', 'English', 'Mercy Owusu', 'Post-loss: 8 months', '2026-05-22', '2025-10-05', '[{"date": "2025-10-05", "level": "HIGH"}, {"date": "2025-12-15", "level": "MEDIUM"}, {"date": "2026-03-01", "level": "LOW"}]'::jsonb, 8)
ON CONFLICT DO NOTHING;

INSERT INTO consultations (id, patient_id, patient_name, date, language, symptoms, risk_level, ai_summary, transcript, triggered_referral) VALUES
    ('c001', 'p001', 'Abena Osei', '2026-05-27', 'English', ARRAY['severe headache', 'blurred vision', 'swollen feet'], 'HIGH', 'Patient reports severe headache persisting for 3 days, blurred vision, and noticeable swelling in both feet. Blood pressure reading at 150/95 mmHg. These symptoms are consistent with pre-eclampsia warning signs. Immediate referral recommended.', '[{"text": "Good morning Abena, how are you today? I heard you have a headache.", "speaker": "AI"}, {"text": "I am not feeling well at all. I have had this headache for three days, and my vision is getting blurry.", "speaker": "Mother"}, {"text": "Have you noticed any swelling in your feet or legs?", "speaker": "AI"}, {"text": "Yes, my feet are very swollen.", "speaker": "Mother"}, {"text": "I understand. You need to go to the hospital immediately so we can check on you and your baby.", "speaker": "AI"}]'::jsonb, TRUE),
    ('c002', 'p002', 'Efua Mensah', '2026-05-26', 'English', ARRAY['difficulty sleeping', 'persistent sadness', 'low appetite'], 'MEDIUM', 'Patient continues to experience grief-related symptoms 4 months post-loss. Sleep quality has slightly improved from Poor to Fair. Coping index remains at 5/10. Recommend continued counselling sessions and community support group referral.', '[{"text": "Hello Efua, how are you feeling?", "speaker": "AI"}, {"text": "Not good. I am not sleeping well, and I don''t even feel like eating.", "speaker": "Mother"}, {"text": "I see. Were you able to attend the counselling session today?", "speaker": "AI"}, {"text": "Yes, but the group support doesn''t seem to be working.", "speaker": "Mother"}]'::jsonb, FALSE),
    ('c003', 'p003', 'Akosua Addo', '2026-05-25', 'English', ARRAY['mild nausea', 'normal fatigue'], 'LOW', 'Patient reports mild nausea and normal pregnancy-related fatigue at 18 weeks. Blood pressure stable at 118/76 mmHg. Baby kick count is within normal range. No danger signs identified. Continue routine ANC schedule.', '[{"text": "Good morning Akosua, how are you?", "speaker": "AI"}, {"text": "I am fine, but I feel a little nauseous.", "speaker": "Mother"}, {"text": "That is normal. Are you feeling the baby kick?", "speaker": "AI"}, {"text": "Yes, the baby is kicking very well.", "speaker": "Mother"}]'::jsonb, FALSE),
    ('c004', 'p004', 'Ama Serwaa', '2026-05-28', 'English', ARRAY['reduced fetal movement', 'severe abdominal pain', 'dizziness'], 'HIGH', 'Patient at 36 weeks reports significantly reduced fetal movement (kick count: 4), severe abdominal pain, and episodes of dizziness. Blood pressure at 160/100 mmHg is critically elevated. URGENT: Immediate emergency referral activated for possible placental abruption.', '[{"text": "Ama, how are you feeling? Are you in pain?", "speaker": "AI"}, {"text": "My stomach hurts so much. Also, my baby is not kicking as much as usual.", "speaker": "Mother"}, {"text": "You need to go to the hospital right now. I am calling an ambulance to come pick you up.", "speaker": "AI"}]'::jsonb, TRUE),
    ('c005', 'p005', 'Yaa Ansah', '2026-05-24', 'English', ARRAY['mild back pain', 'occasional headaches'], 'MEDIUM', 'Patient at 24 weeks reports mild back pain and occasional headaches. Blood pressure slightly elevated at 135/88 mmHg, warranting closer monitoring. No proteinuria detected. Scheduled for follow-up in 1 week.', '[{"text": "Hello Yaa, how are you doing?", "speaker": "AI"}, {"text": "I have a bit of back pain and sometimes a headache.", "speaker": "Mother"}, {"text": "Okay. Are you still coming for your checkup next week?", "speaker": "AI"}, {"text": "Yes, I will be there next week.", "speaker": "Mother"}]'::jsonb, FALSE),
    ('c006', 'p006', 'Esi Naadu', '2026-05-22', 'English', ARRAY['improved mood', 'better sleep'], 'LOW', 'Patient shows continued improvement 8 months post-loss. Coping index increased to 8/10. Sleep quality improved to Good. Actively participating in community support group. Recommend transitioning to quarterly check-ins.', '[{"text": "Good morning Esi. How are you?", "speaker": "AI"}, {"text": "I am fine. I am sleeping much better and I feel much happier now.", "speaker": "Mother"}, {"text": "That is wonderful to hear! We will meet again next month.", "speaker": "AI"}]'::jsonb, FALSE)
ON CONFLICT DO NOTHING;

INSERT INTO referrals (id, patient_id, patient_name, risk_level, status, facility_id, facility_name, assigned_chw, outcome, reason, created_at, timeline) VALUES
    ('r001', 'p001', 'Abena Osei', 'HIGH', 'In Transit', 'f001', 'Korle-Bu Teaching Hospital', 'Grace Mensah', NULL, 'Pre-eclampsia warning signs detected', '2026-05-27T09:30:00Z', '[{"note": "Pre-eclampsia warning signs detected", "stage": "Referral Created", "timestamp": "2026-05-27T09:30:00Z"}, {"stage": "Ambulance Dispatched", "timestamp": "2026-05-27T09:45:00Z"}, {"note": "ETA 25 minutes", "stage": "In Transit", "timestamp": "2026-05-27T10:00:00Z"}]'::jsonb),
    ('r002', 'p004', 'Ama Serwaa', 'HIGH', 'Pending', 'f002', 'Komfo Anokye Teaching Hospital', 'Comfort Asante', NULL, 'Emergency: possible placental abruption at 36 weeks', '2026-05-28T08:15:00Z', '[{"note": "Emergency: possible placental abruption at 36 weeks", "stage": "Referral Created", "timestamp": "2026-05-28T08:15:00Z"}]'::jsonb),
    ('r003', 'p002', 'Efua Mensah', 'MEDIUM', 'Admitted', 'f003', 'Greater Accra Regional Hospital', 'Comfort Asante', 'Receiving grief counselling', 'Counselling referral for grief management', '2026-05-20T11:00:00Z', '[{"note": "Counselling referral for grief management", "stage": "Referral Created", "timestamp": "2026-05-20T11:00:00Z"}, {"stage": "In Transit", "timestamp": "2026-05-20T11:30:00Z"}, {"note": "Enrolled in intensive counselling programme", "stage": "Admitted", "timestamp": "2026-05-20T12:15:00Z"}]'::jsonb),
    ('r004', 'p003', 'Akosua Addo', 'LOW', 'Resolved', 'f004', 'Tamale Teaching Hospital', 'Grace Mensah', 'Routine check-up completed, all normal', 'Routine ANC check-up', '2026-05-10T14:00:00Z', '[{"note": "Routine ANC check-up", "stage": "Referral Created", "timestamp": "2026-05-10T14:00:00Z"}, {"stage": "In Transit", "timestamp": "2026-05-10T14:20:00Z"}, {"stage": "Admitted", "timestamp": "2026-05-10T15:00:00Z"}, {"note": "All vitals normal, follow-up in 4 weeks", "stage": "Resolved", "timestamp": "2026-05-10T16:30:00Z"}]'::jsonb)
ON CONFLICT DO NOTHING;

INSERT INTO action_logs (id, patient_id, type, description, timestamp, performed_by) VALUES
    ('a001', 'p001', 'Alert', 'Risk level escalated to HIGH - pre-eclampsia warning signs detected during AI consultation', '2026-05-27T09:28:00Z', 'System'),
    ('a002', 'p001', 'Referral', 'Emergency referral created to Korle-Bu Teaching Hospital', '2026-05-27T09:30:00Z', 'Grace Mensah'),
    ('a003', 'p004', 'Alert', 'Risk level escalated to HIGH - reduced fetal movement and critically elevated blood pressure (160/100)', '2026-05-28T08:12:00Z', 'System'),
    ('a004', 'p004', 'Referral', 'Emergency referral created to Komfo Anokye Teaching Hospital - possible placental abruption', '2026-05-28T08:15:00Z', 'Comfort Asante'),
    ('a005', 'p002', 'Call', 'Follow-up call completed - patient reports continued grief symptoms, coping index unchanged at 5/10', '2026-05-26T10:00:00Z', 'Comfort Asante'),
    ('a006', 'p003', 'Visit', 'Routine ANC visit completed - all vitals normal, pregnancy progressing well at 18 weeks', '2026-05-25T14:00:00Z', 'Grace Mensah'),
    ('a007', 'p005', 'Vitals', 'Blood pressure slightly elevated at 135/88 mmHg during routine check - scheduled follow-up in 1 week', '2026-05-24T11:30:00Z', 'Mercy Owusu'),
    ('a008', 'p006', 'Outcome', 'Quarterly review - coping index improved to 8/10, sleep quality rated Good. Transitioning to quarterly check-ins', '2026-05-22T09:00:00Z', 'Mercy Owusu'),
    ('a009', 'p001', 'Vitals', 'Blood pressure reading: 150/95 mmHg - above normal range', '2026-05-27T09:25:00Z', 'System'),
    ('a010', 'p004', 'Registration', 'Patient registered for MamaCare programme - high-risk pregnancy, age 34', '2025-09-15T08:00:00Z', 'Comfort Asante')
ON CONFLICT DO NOTHING;

INSERT INTO notifications (id, ui_type, payload, is_read, timestamp, pathway) VALUES
    ('n1', 'Item1', '{"userName": "Joe Lincoln", "avatar": "300-4.png", "description": "mentioned you in", "link": "Latest Trends", "label": "topic", "time": "18 mins ago", "specialist": "Web Design 2024", "text": "For an expert opinion, check out what Mike has to say on this topic!"}', false, '2026-06-12T08:00:00Z', 'Pregnancy'),
    ('n2', 'Item2', '{}', false, '2026-06-12T07:30:00Z', 'Pregnancy'),
    ('n3', 'Item3', '{"userName": "Guy Hawkins", "avatar": "300-27.png", "badgeColor": "offline", "description": "requested access to", "link": "AirSpace", "day": "project", "date": "14 hours ago", "info": "Dev Team"}', false, '2026-06-11T18:00:00Z', 'Pregnancy'),
    ('n4', 'Item4', '{}', false, '2026-06-11T16:00:00Z', 'Pregnancy'),
    ('n5', 'Item5', '{"userName": "Raymond Pawell", "avatar": "300-11.png", "badgeColor": "online", "description": "posted a new article", "link": "2024 Roadmap", "day": "", "date": "1 hour ago", "info": "Roadmap"}', false, '2026-06-12T07:00:00Z', 'Pregnancy'),
    ('n6', 'Item6', '{}', false, '2026-06-11T10:00:00Z', 'Pregnancy'),
    ('n7', 'Item13', '{}', false, '2026-06-12T08:00:00Z', 'Post-Loss'),
    ('n8', 'Item14', '{}', false, '2026-06-12T07:30:00Z', 'Post-Loss'),
    ('n9', 'Item15', '{}', false, '2026-06-11T18:00:00Z', 'Post-Loss'),
    ('n10', 'Item16', '{}', false, '2026-06-11T16:00:00Z', 'Post-Loss'),
    ('n11', 'Item3', '{"userName": "Benjamin Harris", "avatar": "300-30.png", "badgeColor": "offline", "description": "requested to upgrade plan", "link": "", "day": "", "date": "4 days ago", "info": "Marketing"}', false, '2026-06-08T10:00:00Z', 'Post-Loss'),
    ('n12', 'Item5', '{"userName": "Isaac Morgan", "avatar": "300-24.png", "badgeColor": "online", "description": "mentioned you in", "link": "Data Transmission", "day": "topic", "date": "6 days ago", "info": "Dev Team"}', false, '2026-06-06T10:00:00Z', 'Post-Loss')
ON CONFLICT DO NOTHING;

INSERT INTO communications (id, pathway, recipient_type, recipient_count, message, status, sent_at) VALUES
    ('c1', 'Pregnancy', 'all', 12, 'Hello, this is a wellness check-in from MamaCare. We are thinking of you. Please reply with how you are feeling today.', 'sent', '2026-06-11T09:00:00Z'),
    ('c2', 'Pregnancy', 'individual', 1, 'URGENT: If you are experiencing severe pain, heavy bleeding, or difficulty breathing, please visit the nearest facility immediately.', 'sent', '2026-06-10T14:30:00Z'),
    ('c3', 'Post-Loss', 'all', 5, 'MamaCare Tip: Make sure to stay hydrated today and eat iron-rich foods like spinach and beans.', 'sent', '2026-06-09T11:15:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO schedules (id, pathway, appointment_date, appointment_time, reminder_timing, message, patients_count, status, created_at) VALUES
    ('s1', 'Pregnancy', '2026-06-15', '10:00', '1day', 'Reminder: You have an upcoming appointment scheduled. Please contact us if you need to reschedule.', 3, 'active', '2026-06-12T08:00:00Z'),
    ('s2', 'Post-Loss', '2026-06-20', '14:00', '2days', 'Reminder: You have a scheduled follow-up. We are looking forward to seeing you.', 1, 'active', '2026-06-11T10:00:00Z')
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
