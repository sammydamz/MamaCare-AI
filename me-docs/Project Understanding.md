# MamaCare AI — Detailed Project Understanding

## What It Is

MamaCare AI is a **voice-first maternal health platform** designed for low-resource African settings. It delivers continuous pregnancy and post-pregnancy-loss care through **automated phone calls** — no smartphone or internet required. A parallel dashboard equips Community Health Workers (CHWs) and healthcare providers with real-time monitoring, AI-driven risk detection, and case management tools.

---

## The Problem It Solves

- Pregnant women in underserved African communities lack regular medical check-ins
- Post-pregnancy loss (miscarriage, stillbirth) receives almost zero follow-up care — physically or emotionally
- CHWs are overwhelmed, have no prioritization system, and lose track of high-risk patients
- Health facilities have no visibility into what happens between visits
- Language barriers and phone-type barriers exclude the most vulnerable women

---

## How It Works (Core Flow)

1. **Registration** — Women are registered at a clinic or by a CHW
2. **Automated Calls** — MamaCare AI calls the woman regularly in her **preferred local language**
3. **Symptom Collection** — The AI asks simple questions about symptoms, feelings, and pregnancy progress via voice
4. **Risk Prediction** — AI analyzes responses and assigns a **risk level** (low / medium / high)
5. **Action** — Based on risk:
   - Low → personalized health advice, medication reminders
   - Medium → closer monitoring, health guidance
   - High → immediate alert to providers, emergency escalation, clinic referral
6. **Closed Loop** — CHW follows up, records outcome, referral is tracked until resolved

---

## Three User Personas

### 1. Pregnant Women (and Post-Loss Mothers)
- Receive scheduled voice calls on **any basic phone**
- Get symptom tracking, health guidance, medication/hospital visit reminders
- Post-loss mothers receive grief support, recovery monitoring, and family planning guidance
- Can be connected to peer survivors and real counselors

### 2. Community Health Workers (CHWs)
- Prioritized patient queue sorted by risk level
- Real-time risk alerts when a patient's tier changes
- Individual patient profiles (call history, symptoms, risk trends, referrals)
- Action log for visits, calls, referrals, outcomes
- Referral tracker (did the patient go to the facility?)
- Facility directory with distance, hours, services, click-to-call
- Zone summary (total caseload, pending visits, unresolved high-risk cases)
- **USSD offline mode** — works without internet

### 3. Healthcare Providers / Supervisors
- Supervisor view across all CHWs in their area
- Follow-up rate monitoring
- Facility-level analytics (referrals, follow-ups, symptom trends)
- Exportable reports

---

## AI Engine (Core Intelligence)

| Module | What It Does |
|--------|-------------|
| **Speech-to-Text NLP** | Converts voice responses, understands local African languages |
| **Risk Prediction ML Model** | Analyzes symptoms + behavior + history → predicts risk tier |
| **Clinical Decision Support (Triage)** | Categorizes risk and recommends actions (advise / monitor / escalate) |
| **Adaptive Care Pathways** | Switches modes automatically: pregnancy → post-loss → family planning |
| **Continuous Learning** | Updates model accuracy from real outcomes over time |

---

## Feature Breakdown

### For Pregnant Women
| Feature | Details |
|---------|---------|
| Health Monitoring | Automated voice calls, symptom tracking (bleeding, pain, fever), pregnancy stage tracking |
| Early Risk Detection | AI danger sign identification, complication prediction (preeclampsia, miscarriage risk) |
| Health Guidance | Personalized nutrition advice, medication reminders, hospital visit reminders |
| Smart Referrals | Alerts to healthcare providers, directions to nearby clinics, emergency escalation |
| Community | Peer support networks |

### For Post-Pregnancy Loss
| Feature | Details |
|---------|---------|
| Emotional Support | Compassionate voice interactions, regular check-ins, mental health prompts |
| Recovery Monitoring | Tracks bleeding/recovery progress, screens for infection/complications |
| Risk Detection After Loss | Identifies warning signs (sepsis, heavy bleeding), triggers urgent referrals |
| Future Care Support | Family planning guidance, next pregnancy preparation, fertility awareness |
| Peer Support | Group chat of peer survivors, audio testimonials in local languages |
| Partner/Family Engagement | Optional guidance calls/messages to the woman's support network |
| AI + Human Counselor | AI counselor available 24/7, escalation to real counselor when needed |

### For Healthcare Workers (Dashboard)
| Feature | Details |
|---------|---------|
| Dashboard & Monitoring | View all patients, risk levels, symptom tracking, engagement metrics |
| Real-Time Alerts | Notifications for high-risk cases, emergency escalation |
| Case Management | Patient records, notes, follow-up tracking |
| Reporting & Insights | Patient trend analytics, high-risk tracking, exportable reports |

### System & Accessibility
| Feature | Details |
|---------|---------|
| Basic Phone Support | Works on any phone — voice calls only, no smartphone needed |
| Local Languages | Supports multiple African languages |
| Automated Scheduling | Smart call scheduling based on risk level and pregnancy stage |
| Privacy & Security | End-to-end encryption, secure data handling, federated privacy-preserving architecture |
| Low Bandwidth | Works in areas with poor connectivity |
| Offline Mode | Simplified IVR screening when cloud AI is unreachable; USSD offline dashboard |
| Data Localization | Patient data stays within country borders |

---

## Technical Stack (Current Codebase)

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 19 + TypeScript |
| Build Tool | Vite 7 |
| UI Framework | Metronic 9 (Tailwind CSS 4) with ReUI components |
| Routing | React Router 7 |
| State / Data Fetching | TanStack React Query 5 |
| Forms | React Hook Form + Zod validation |
| Auth | Supabase Auth (email/password + Google OAuth) |
| Database / Backend | Supabase (PostgreSQL) |
| Charts | ApexCharts + Recharts |
| Maps | Leaflet + React Leaflet |
| Styling | Tailwind CSS 4, Radix UI, Motion (animations) |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   MamaCare AI                        │
├──────────────┬──────────────────┬───────────────────┤
│  Voice AI    │   CHW Dashboard  │  Provider Portal  │
│  (Phone)     │   (Web App)      │  (Web App)        │
│              │                  │                    │
│  ┌────────┐  │  ┌────────────┐  │  ┌─────────────┐  │
│  │STT/NLP │  │  │Risk Queue  │  │  │Analytics    │  │
│  │Risk ML │  │  │Alerts      │  │  │Reports      │  │
│  │Triage  │  │  │Case Mgmt   │  │  │Supervision  │  │
│  │TTS     │  │  │Referrals   │  │  │Facility Data│  │
│  └────────┘  │  └────────────┘  │  └─────────────┘  │
├──────────────┴──────────────────┴───────────────────┤
│              Supabase (Auth + DB + Realtime)         │
└─────────────────────────────────────────────────────┘
```

---

## Key Principles

1. **Voice-first, phone-agnostic** — any basic phone works, no app download
2. **Language-inclusive** — local African languages, not just English
3. **Closed-loop care** — registration → monitoring → alert → referral → follow-up → outcome tracked
4. **CHW-centered design** — prioritized queues, offline mode, simplified workflows
5. **Privacy by design** — data stays in-country, end-to-end encryption
6. **AI-augmented, not AI-replaced** — AI triages and recommends, humans make final decisions

---

## What Exists Now vs. What Needs To Be Built

### What Exists (Current Codebase)
- Metronic 9 React template with Supabase auth
- Base UI components, routing, layout system
- Login/signup flow (email + Google OAuth)

### What Needs To Be Built
- **Voice AI pipeline** (STT, NLP, risk model, TTS) — likely via Twilio/Africa's Talking + cloud AI
- **CHW Dashboard** (risk queue, alerts, case management, referrals)
- **Patient profiles** with call history, symptom trends, risk timelines
- **Provider/Supervisor portal**
- **Referral tracking system**
- **Post-loss care module** (grief support flow, peer matching, counselor escalation)
- **Offline/USSD mode**
- **Multi-language voice support**
- **Admin analytics and reporting**
- **Database schema** for patients, calls, symptoms, risk scores, referrals, outcomes

---

## Hackathon Scope Considerations

For a hackathon MVP, the highest-impact slices would be:
1. **CHW Dashboard** with mock patients and risk queue (most visual, demo-friendly)
2. **Simulated voice call flow** (show the AI conversation → risk assessment pipeline)
3. **Patient profile** with risk timeline and symptom tracking
4. **Alert/escalation system** (real-time notification when risk changes)

These demonstrate the core value prop: **AI-powered risk detection → prioritized CHW action → closed-loop care.**
