# MamaCare AI - Detailed Application Report

> URL: https://mamacare-ai-521331268908.us-west1.run.app/
> Built with: Google AI Studio (Express + Vite React SPA)
> Hosted on: Google Cloud Run (us-west1)
> Date audited: May 28, 2026

---

## 1. Overview

MamaCare AI is a maternal health platform targeting rural Kenya. It has two core missions:

1. **Pregnancy care** - AI-powered voice/clinical triage for expectant mothers
2. **Post-loss bereavement support** - grief tracking and emotional wellness for mothers who have suffered pregnancy loss

The app serves three user roles: **Mothers (patients)**, **Community Health Workers (CHWs)**, and **Clinicians/Medical Officers**.

---

## 2. Authentication & User Roles

### Login System
- Simple username + PIN authentication (no OAuth, no JWT tokens in demo)
- API: `POST /api/login` with `{username, passcode}` returns user profile + role
- PIN is the same for all demo accounts: `1234`

### Demo Accounts

| Role | Username | Name | Pathway |
|------|----------|------|---------|
| Mother (Pregnant) | `amina` | Amina Yusuf | Pregnancy Care, 32 weeks |
| Mother (Pregnant) | `fatima` | Fatima Al-Hassan | Pregnancy Care, 14 weeks |
| Mother (Post-Loss) | `chloe` | Chloe Mwangi | Loss Support, 4 weeks post-loss |
| Clinician | `midwife` | Midwife Beatrice | CHW Staff |
| Clinician | `doctor` | Dr. Christopher | Regional Medical Officer |
| Clinician | `provider` | Provider | Staff Coordinator |

### Registration
- Mothers can self-register via "Create a Continuous Care / Loss Recovery Account"
- Fields: name, phone, username, PIN, weeks pregnant, village location, primary language, diagnostic notes
- Pathway selection: "Active Pregnancy" or "Pregnancy Loss Support"
- Language options: Swahili, English, Pidgin, Somali

---

## 3. Mothers Portal (Patient View)

After logging in as a mother, the portal shows:

### 3.1 Patient Profile Bar
- Name, gestation stage, preferred language, regional outpost, assigned CHW

### 3.2 Navigation Tabs (Mothers)

| Tab | Description |
|-----|-------------|
| **AI Voice consult** | Main AI triage interface |
| **Roadmap & Recovery** | Weekly care checklist + kick counter |
| **Breathe Room** | Guided breathing therapy for anxiety/grief |
| **History & Analysis** | Past consultation logs and vitals history |
| **Grief Healing** | (Post-loss only) Bereavement-specific tools |

### 3.3 AI Voice Consult (Core Feature)

**2G GSM Call Simulator:**
- Simulates an incoming AI IVR call to a basic brick phone
- Conducts symptom checks in the mother's preferred language (e.g., Swahili)
- Voice Response toggle (ON/OFF) for text-to-speech output

**Interactive Preset Buttons (4 presets for pregnant context):**

| Preset | Language | Description |
|--------|----------|-------------|
| Severe Headache & Swelling | Swahili | 28+ weeks preeclampsia symptoms |
| Danger Alert: Spotting & Cramps | English | 16 weeks bleeding/cramping |
| Healthy: Normal morning check-in | Pidgin | Routine wellness check |
| Health inquiry: Nutrition | English | Iron/vitamin questions |

**AI Flow (tested with Swahili preset):**
1. Preset fills the text input with Swahili symptom description
2. User clicks send -> `POST /api/consult` with `{patientId, messages, incomingMessage}`
3. AI returns analysis including:
   - Risk level (HIGH/MEDIUM/LOW)
   - Primary concern (e.g., "Severe Preeclampsia / Gestational Hypertension")
   - Recommended actions in the patient's language
   - Referral needed flag + referral target
4. UI updates in real-time:
   - Risk assessment panel shows "HIGH RISK CASE"
   - Action protocols displayed in Swahili
   - CHW notification status changes to "SENT!"
   - Emergency care bridge shows "ALERTED"

**Microphone Input:**
- Supports voice recording for spoken intake
- Audio translated to clinic transcription text
- Manual text editing available

### 3.4 Roadmap & Recovery

**Weekly Care Checklist (for 32 weeks):**
- Iron & Folic Acid Supplement (checked/unchecked tracking)
- Hydration Intake Monitor (3L daily target)
- Blood Pressure Screening (urgent clinic visit flagged)

**Baby Kick Counter:**
- "Record Kick" button to count fetal movements
- Target: 10 kicks in 2-hour window
- Reset counter available

### 3.5 Breathe Room

- Guided box-breathing therapy interface
- "Begin Breathing Cycle" button
- Tracks daily practice cycles
- Designed for cortisol reduction, postpartum insomnia, and emotional panic

### 3.6 History & Analysis

**AI Voice Consultation History:**
- Lists all past AI screening sessions
- Shows: session number, date, risk level, primary concern, recommended actions, referral status

**Care & Vitals History Logs:**
- BP readings (systolic/diastolic in mmHg)
- Kick monitor counts
- Hydration levels
- Source (Patient / CHW / Midwife)
- Qualitative notes

### 3.7 Grief Healing (Post-Loss Only)

Available only for `chloe` (post-loss pathway). Shows:
- AI voice consultation history focused on grief assessment
- Care logs tracking: sleep cycles, coping index (out of 10), lochia/bleeding status
- Progress notes from counselor and patient self-reports

---

## 4. Clinician Terminal (Staff Dashboard)

Logged in as `doctor` (Dr. Christopher, Regional Medical Officer).

### 4.1 Dashboard Overview (Default View)

**KPI Stats:**
- Total Enlisted Mothers: 3
- Active High Risk: 2
- Pending Actions: 3
- Case Resolution Rate: 100%

**Symptom Distribution Spread:**
- Visual bar chart of all flagged symptoms across patients
- 8 symptoms tracked, each 13% (1 case each)

**Language Distribution:**
- Swahili, English, Pidgin - one patient each

**Community Referral Action Desk:**
- Filterable by case status (All / Pending / In Treatment / Resolved)
- Filterable by risk level (All / High / Medium / Low)
- Search by name or worker
- Each referral card shows:
  - Patient profile (name, stage)
  - Triage symptoms
  - Risk level badge
  - Assigned CHW officer
  - Status controls (Pending / Active / Resolved buttons)
  - Log/notes text input
  - Referral creation date

**CHW Zone Desktop:**
- Total Caseload: 6 (Zone 47-B)
- Pending Outreach Tasks: 4
- Unresolved Danger Referrals: 3

**Sub-sections within CHW Desktop:**

| Button | Description |
|--------|-------------|
| Prioritized Patient Registry | Clickable patient cards sorted by risk |
| Hospital Referral & Tracker | Transit dispatch management |
| CHW Interaction Logs | Historical notes |
| Offline USSD 2G Portal | Basic phone access simulation |

**AI Risk Escalation Feed (Live):**
- Real-time alerts showing risk level changes
- Example: "Amina Yusuf: Was Medium -> Is High, Severe Headache & Swelling reported over Swahili voice clinic"

**Patient Detail Panel (when a patient is selected):**
- Full dossier: outpost sector, nurse monitor, care stage
- Calculated risk trend (Escalating/Stable/Improving)
- Multi-language dialogue cues (Swa/Eng/Pid) for CHW preparation
- Opening greetings and warning sign checks in local language
- CHW counseling tips
- Intake consulting transcripts
- Post-visit notes input
- Direct clinic referral dispatch with hospital/vehicle/driver selection

**Hospital Directory (for referrals):**
- Kajiado Sub-County Referral Hospital (4.5 km)
- Machakos Town Maternity Wing (12.0 km)
- Seme Level 4 Dispensary (1.8 km)

### 4.2 Tab: Transit Tracker

**Live Ambulance GPS Hub:**
- Simulated GPS route visualization (village hub to hospital)
- Route waypoints: Kajiado Village Hub -> Bridge checkpoint -> Lukenya Highway Bend -> Hospital
- GPS Telemetry Feed: mission ID, coordinates, speed, status, route progress %
- Estimated time to integration

**Chronological Dispatch Logs:**
- Timestamped event log (e.g., "13:06:12 - Ambulance crew dispatched", "13:09:40 - Arrived at home outpost, BP: 145/95 mmHg")
- Full timeline from dispatch to arrival

**Automated SMS Terminal:**
- E2EE encrypted SMS sent to:
  1. Patient hotline (Swahili message with ETA)
  2. Assigned CHW (progress update)
  3. Receiving outpost nurse (admission notice)

**Fleet Operations:**
- Active transit missions list
- Each mission: patient name, status (COMPLETED/IDLE), base location, vehicle unit
- "Start GPS Watch" / "Reset Demo" controls

**Ambulance Dispatch Console:**
- Patient selection dropdown
- Custom pickup coordinates input
- Driver assignment (David Omondi, Grace Muthoni, CHW Joseph)
- Vehicle assignment (Ambulance A, CHW Patrol Mini, County Emergency)
- Destination hospital selection
- "Activate GPS Ambulance Dispatch" button

**Care-Loop Referral Checks:**
- RFID-based automatic patient ID matching at hospital gate

### 4.3 Tab: Care & Loss Logs

**KPI Stats:**
- Total Logs: 4
- Active Preg Logs: 2
- Bereavement Loss Logs: 2
- Avg. Rest / Pressure: 5.0 hrs / 138 mmHg

**Submit Care-Loop Checkpoints:**
- Target patient dropdown
- Author selection: Patient / CHW / Midwife / System AI
- Stream type auto-detects based on patient pathway (Pregnancy Care vs Loss Support)

**Pregnancy Care Parameters:**
- Systolic BP (spinbutton, 80-200 mmHg)
- Diastolic BP (spinbutton, 50-130 mmHg)
- Fetal kick counts (slider, 0-25)
- Hydration levels (slider, 0-5 L)
- Headache/vision alert checkbox
- Qualitative clinical assessment notes

**Visual Trends:**
- Systolic BP track chart (pregnancy stream)
- Grief Coping Index chart (loss support stream)
- Max values displayed per patient

**Historical Timeline:**
- Filterable by: All / Pregnancy / Loss Recovery
- Each log entry: patient, pathway, timestamp, vitals, qualitative notes, source
- Both pregnancy vitals (BP, kicks, water) and grief metrics (coping score, sleep, bleeding) shown

### 4.4 Tab: Sovereignty & AI

**Feature 30 - Encrypted Medical Workspaces:**
- SHA-256 E2EE encryption for all clinic data
- Toggle to disconnect encryption (demo)

**Feature 25 - Offline IVR Screening Simulator:**
- Works when cell towers are down
- Interactive IVR audio prompts for diagnostics and grief support
- Play buttons to hear sample prompts

**Feature 26 - Federated Learning Architecture:**
- Training runs locally on hospital routers
- Only ML weight updates shared with national centers (no raw data)
- Sovereign node clusters: Kajiado Server (AES256), Machakos Core (Active), Mombasa Outer (Synced)
- Complies with Kenyan Data Protection Act of 2019

**Feature 27 - Language Corpus Builder:**
- Swahili/Pidgin dialect fine-tuning
- Shows raw audio transcripts with English translation
- Clinicians can verify/edit translations and submit to corpus

**Feature 28 - Aggregate District Analytics:**
- Facility-level referral dashboard

| Health Center | Referrals | Resolved | Success Rate |
|--------------|-----------|----------|-------------|
| Kajiado Outpost | 45 | 42 | 93% |
| Machakos Town | 52 | 48 | 92% |
| Seme Level 4 | 30 | 29 | 96% |
| Mombasa Hub | 64 | 58 | 90% |

**Feature 32 - Multi-Stakeholder Loop:**
- 4-step closed-loop ecosystem visualization:
  1. Village Mother registers and speaks to voice diagnostic clinic
  2. AI predicts risk level and triggers auto-alerts on 2G GSM
  3. CHW verifies warnings, records logs, assigns ambulance transfers
  4. Hospital checks in the mother, resolving case to close the medical loop

---

## 5. API Endpoints Discovered

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients` | List all patient profiles |
| GET | `/api/referrals` | List all referrals |
| GET | `/api/analytics` | Aggregate analytics (symptom/language distribution, KPIs) |
| GET | `/api/consultations/:patientId` | Get consultation history for a patient |
| GET | `/api/logs` | Get care-loop vital logs |
| POST | `/api/login` | Authenticate user (returns role + profile) |
| POST | `/api/consult` | AI consultation (sends symptom text, returns risk analysis) |

**Backend:** Express.js (`x-powered-by: Express`), served via Google Frontend on Cloud Run.

---

## 6. Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React SPA (Vite bundled) |
| Backend | Express.js (Node.js) |
| AI | Google AI Studio (Gemini API for clinical analysis) |
| Hosting | Google Cloud Run |
| Database | In-memory / file-based (demo mode, resets via "Reset Demo Data") |
| Encryption | SHA-256 E2EE (claimed) |
| Voice | Web Speech API + simulated IVR |
| Auth | Simple username + PIN |

---

## 7. Notable UX Patterns

- **Role-based routing:** Landing page switches between Mothers Portal and Clinician Terminal based on login
- **Contextual UI:** Post-loss users see "Grief Healing" tab instead of pregnancy-specific tools
- **Multi-language:** AI responses delivered in patient's preferred language (Swahili, English, Pidgin)
- **Real-time polling:** Frontend polls `/api/patients`, `/api/referrals`, `/api/analytics`, `/api/consultations`, `/api/logs` every few seconds (high frequency of 304 responses observed)
- **Demo-friendly:** "Reset Demo Data" button on landing page restores default state

---

## 8. Feature Summary Matrix

| Feature | Mother (Pregnant) | Mother (Post-Loss) | Clinician |
|---------|:-:|:-:|:-:|
| AI Voice Consult | Yes | Yes | Yes (via CHW) |
| Symptom Presets | Yes (4 presets) | Yes (4 presets) | - |
| Risk Assessment | View own | View own | View all patients |
| Breathe Room | Yes | Yes | - |
| Roadmap / Recovery | Yes (checklist + kicks) | Yes (checklist) | - |
| History & Analysis | Yes (own records) | Yes (own records) | Yes (all patients) |
| Grief Healing | No | Yes | - |
| Referral Dispatch | No | No | Yes |
| Transit Tracker | No | No | Yes |
| Care & Loss Logs | No | No | Yes (submit + view) |
| Sovereignty & AI | No | No | Yes |
| Patient Registration | Yes | Yes | Yes |
| Ambulance Dispatch | No | No | Yes |
| CHW Zone Desktop | No | No | Yes |
| Federated Learning | No | No | Yes |
| Language Corpus | No | No | Yes |
| District Analytics | No | No | Yes |
| Offline IVR | No | No | Yes |
| SMS Alerts | No | No | Yes |
| Encryption Controls | No | No | Yes |

---

## 9. Key Observations

1. **Heavily demo/prototype-oriented** - The app is clearly a Google AI Studio prototype with simulated data, GPS routes, and in-memory storage
2. **No real database persistence** - "Reset Demo Data" button suggests all data is ephemeral
3. **Aggressive polling** - Frontend polls 5 API endpoints every few seconds, generating heavy 304 traffic
4. **No real auth** - PIN-based login with no session tokens or JWT
5. **AI responses are genuine** - The `/api/consult` endpoint returns real Gemini-generated clinical analysis with Swahili-language recommendations
6. **Feature count is ambitious** - The app claims 32+ features but many are UI shells with simulated data
7. **Medical disclaimers present** - Footer states "For professional clinical supervision and training contexts only"
