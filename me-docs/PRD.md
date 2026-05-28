# MamaCare AI — Product Requirements Document (PRD)

> **Status:** Living Document — v1.0
> **Last Updated:** May 28, 2026
> **Repository:** `C:\Comp` (React 19 + Vite 7 + Supabase)

---

## Problem Statement

Pregnant women in underserved African communities have no way to receive regular medical check-ins between clinic visits. Women who suffer pregnancy loss receive almost zero follow-up care — physically or emotionally. Community Health Workers (CHWs) are overwhelmed with no system to prioritize who needs attention most. Health facilities have no visibility into what happens between visits. Language barriers and the lack of smartphones exclude the most vulnerable women from any digital health solution.

The mother should not need a smartphone. The mother should not need to read. The system should call **her**, listen to **her voice**, analyze her symptoms, and act.

---

## Solution

MamaCare AI is a **voice-first** maternal health platform. The core loop is:

1. **The system calls the mother** on any basic phone, in her local language
2. **AI listens to her voice** — collects symptoms, emotional state, pregnancy progress
3. **Risk is assessed** — low, medium, or high
4. **Action is taken** — advice, closer monitoring, or immediate escalation to a CHW/clinic
5. **The loop closes** — CHW follows up, records outcome, referral is tracked until resolved

Alongside voice calls, mothers can **pull information** through two mirrored channels:
- **USSD** — dial a shortcode on any basic phone to check status, report symptoms, get tips
- **Smartphone Dashboard** — the same USSD features rendered as a visual web app for mothers with smartphones

Both USSD and the smartphone dashboard expose **identical features and data**. The voice call remains the primary clinical intake. USSD and the dashboard are complementary self-service layers.

CHWs and healthcare providers get a full web dashboard for patient monitoring, case management, referral tracking, and analytics.

**The AI risk prediction model is deferred to a later phase** (dataset sourcing in progress). The prototype will use a rules-based triage engine that mimics AI output, designed so a real ML model can be swapped in later with zero frontend changes.

---

## User Stories

### Registration & Onboarding

1. As a CHW, I want to register a pregnant woman at a clinic or in the field, so that she enters the care system
2. As a CHW, I want to register a woman who has suffered pregnancy loss, so that she receives bereavement support
3. As a registering CHW, I want to capture the woman's phone number, preferred language, pregnancy stage, village location, and assigned CHW, so that the system can personalize her care
4. As a registering CHW, I want to select a care pathway (Active Pregnancy / Pregnancy Loss Support), so that the system routes her into the correct monitoring flow
5. As a mother, I want to receive a welcome call after registration explaining what MamaCare does and when to expect check-in calls, so that I understand the service

### Voice Call Check-ups (Primary Channel)

6. As a pregnant mother, I want MamaCare to call me regularly in my local language, so that I can report how I feel without needing to read or use an app
7. As a pregnant mother, I want the AI to ask me simple questions about symptoms (headache, bleeding, pain, swelling, fever, baby movement), so that my health is monitored between clinic visits
8. As a pregnant mother, I want the system to detect danger signs from my voice responses and alert a health worker immediately, so that I get help before it is too late
9. As a pregnant mother, I want to receive personalized health advice (nutrition, medication reminders, hydration, exercise), so that I can take care of myself between visits
10. As a pregnant mother, I want to know my risk level after each call, so that I understand urgency
11. As a pregnant mother, I want to be told which clinic to go to and given directions if my risk is high, so that I know what to do next
12. As a pregnant mother, I want the call frequency to increase automatically if my risk level rises, so that I am monitored more closely when I need it most
13. As a mother, I want the call to adapt to my pregnancy stage (first trimester vs third trimester questions differ), so that the screening is relevant to me

### Voice Call Check-ups — Post-Loss Pathway

14. As a post-loss mother, I want MamaCare to call me with compassionate grief support check-ins, so that I do not feel isolated after my loss
15. As a post-loss mother, I want the AI to ask about my physical recovery (bleeding, infection signs, pain), so that complications are caught early
16. As a post-loss mother, I want the AI to ask about my emotional state and coping, so that I receive appropriate mental health support
17. As a post-loss mother, I want to be offered family planning guidance when I am ready, so that I can prepare for the future
18. As a post-loss mother, I want to be connected to a real counselor if the AI detects severe distress, so that I get human support when I need it
19. As a post-loss mother, I want to hear audio testimonials from other loss survivors in my language, so that I know I am not alone
20. As a post-loss mother, I want to be offered the option to involve my partner or family in support calls, so that my support network understands what I am going through

### USSD Self-Service (Basic Phone Pull Channel)

21. As a mother with a basic phone, I want to dial a USSD shortcode to check my current risk level, so that I know my status without waiting for a call
22. As a mother with a basic phone, I want to report a symptom via USSD menu (headache, bleeding, pain, fever, less baby movement, swelling), so that the system records it immediately
23. As a mother with a basic phone, I want to indicate symptom severity (mild, moderate, severe) via USSD, so that the risk engine can assess urgency
24. As a mother with a basic phone, I want to see my next clinic appointment date and location via USSD, so that I do not miss it
25. As a mother with a basic phone, I want to receive care tips via USSD (nutrition, warning signs, exercise), so that I stay informed between calls
26. As a mother with a basic phone, I want an emergency option on USSD that immediately alerts the CHW and dispatches help, so that I can get urgent assistance
27. As a mother with a basic phone, I want the USSD menus to appear in my preferred language, so that I understand every option
28. As a mother with a basic phone, I want to view my last recorded blood pressure reading via USSD, so that I can track my vitals
29. As a mother with a basic phone, I want to see my last risk assessment and any pending actions via USSD, so that I know if I need to visit a clinic

### Smartphone Dashboard (Mother Pull Channel — Mirrors USSD)

30. As a mother with a smartphone, I want to log in to a simple web dashboard, so that I can see my health information visually
31. As a mother with a smartphone, I want to see my current risk level prominently on my dashboard, so that I immediately know my status
32. As a mother with a smartphone, I want to report symptoms by tapping buttons instead of navigating text menus, so that it is faster than USSD
33. As a mother with a smartphone, I want to see my next clinic appointment with location and directions, so that I can plan my visit
34. As a mother with a smartphone, I want to see my care tips in a readable feed, so that I can review them at my own pace
35. As a mother with a smartphone, I want an emergency button on my dashboard, so that I can trigger an alert with one tap
36. As a mother with a smartphone, I want to see my consultation history (dates, risk levels, AI recommendations), so that I can track my progress
37. As a mother with a smartphone, I want to log my own vitals between calls (blood pressure, baby kick count, hydration), so that the system has more data
38. As a mother with a smartphone, I want to access a guided breathing exercise, so that I can manage anxiety or grief between check-ins
39. As a mother with a smartphone, I want the dashboard to show the same information and operations as USSD, so that my experience is consistent regardless of which phone I use

### CHW Dashboard — Patient Queue & Monitoring

40. As a CHW, I want to see a prioritized list of all my patients sorted by risk level (highest first), so that I know who to visit first
41. As a CHW, I want to see a one-line reason next to each patient explaining why they are high risk, so that I can prepare before visiting
42. As a CHW, I want to receive a real-time alert when a patient's risk level escalates after a voice call, so that I can act immediately
43. As a CHW, I want to view a patient's full profile (demographics, call history, symptom timeline, risk trend, referrals, vitals), so that I have the complete picture
44. As a CHW, I want to see the history of all AI voice calls for a patient including what was said and what the AI recommended, so that I understand the context
45. As a CHW, I want to see a patient's risk trend over time (improving, stable, escalating), so that I can track progress
46. As a CHW, I want to see which language to use when I visit a patient, along with suggested opening greetings and warning-sign questions in that language, so that I can communicate effectively
47. As a CHW, I want to see a summary of my zone (total caseload, pending visits, unresolved high-risk cases), so that I can plan my day

### CHW Dashboard — Case Management & Referrals

48. As a CHW, I want to record a visit note after seeing a patient, so that the care loop is closed
49. As a CHW, I want to create a referral to a specific health facility for a patient, so that the patient gets specialized care
50. As a CHW, I want to assign an ambulance or transport for a referred patient, so that she can reach the facility
51. As a CHW, I want to track whether a referred patient actually arrived at the facility, so that no one falls through the cracks
52. As a CHW, I want to record the outcome of a referral (resolved, ongoing, lost to follow-up), so that cases are properly closed
53. As a CHW, I want to see a facility directory with name, distance, hours, services, and a click-to-call button, so that I can make quick referral decisions
54. As a CHW, I want to see all pending actions assigned to me, so that nothing is missed
55. As a CHW, I want to log a patient's vitals during a visit (blood pressure, fetal heart rate, weight, fundal height), so that the clinical record is up to date

### CHW Dashboard — Referral Tracking & Transit

56. As a CHW, I want to dispatch an ambulance and see live GPS tracking of the vehicle, so that I know the patient is being transported
57. As a CHW, I want to see a chronological dispatch log (departed, arrived at village, en route to hospital, admitted), so that I can monitor the transfer
58. As a CHW, I want automated SMS messages to be sent to the patient, the assigned CHW, and the receiving facility during a referral transit, so that everyone is informed
59. As a CHW, I want to manage my fleet (vehicles, drivers, availability), so that dispatch is efficient

### Provider / Supervisor Portal

60. As a provider, I want to see a dashboard with aggregate KPIs (total mothers, high-risk count, pending actions, resolution rate), so that I understand the overall situation
61. As a provider, I want to see symptom distribution across all patients, so that I can spot trends
62. As a provider, I want to see language distribution across patients, so that I can plan interpreter needs
63. As a provider, I want to see all referrals filtered by status and risk level, so that I can manage the referral queue
64. As a provider, I want to see facility-level analytics (referral rates, success rates, symptom spikes), so that I can identify underperforming facilities
65. As a provider, I want to export reports, so that I can share data with stakeholders
66. As a supervisor, I want to see all CHWs in my area and their follow-up rates, so that I can monitor performance
67. As a provider, I want to view the referral pipeline for any patient (call → risk assessment → CHW alert → referral → transport → facility admission → outcome), so that I can audit the care loop

### Post-Loss — CHW & Provider Tools

68. As a CHW, I want to see which of my patients are on the post-loss pathway, so that I can provide appropriate bereavement support
69. As a CHW, I want to log grief milestones for a post-loss mother (first week, first month, three months), so that her emotional recovery is tracked
70. As a CHW, I want to record physical recovery metrics for a post-loss mother (bleeding status, infection signs, sleep quality, coping index), so that her physical health is monitored
71. As a provider, I want to see which post-loss mothers have been flagged for counselor escalation, so that I can ensure they receive human support
72. As a provider, I want to see a solidarity group matching system that connects loss survivors to peer support groups, so that mothers have community

### System & Accessibility

73. As a mother, I want the system to work on any basic phone using only voice calls, so that I do not need a smartphone or internet
74. As a mother, I want the system to speak my local language (Swahili, English, Pidgin, Somali), so that I can participate fully
75. As a CHW working in an area with no internet, I want a USSD offline mode that keeps critical dashboard functions working, so that I am never without patient information
76. As a mother, I want my data to be encrypted end-to-end, so that my medical information is private
77. As a provider, I want patient data to stay within my country's borders, so that we comply with data protection laws
78. As a CHW, I want the system to work on low bandwidth, so that I can use it in rural areas with poor connectivity
79. As a mother, I want an offline IVR screening to run when the cloud AI is unreachable, so that I can still get a basic symptom check

### Notifications & Messaging

80. As a mother, I want to receive SMS reminders before my clinic appointments, so that I do not forget
81. As a mother, I want to receive SMS medication reminders, so that I take my supplements on schedule
82. As a CHW, I want to receive SMS alerts when one of my patients reports severe symptoms, so that I can respond quickly
83. As a mother, I want to receive my care tips via SMS if I do not have a smartphone, so that I still get health guidance between calls

---

## Implementation Decisions

### Three-Chan nel Architecture

The system exposes three interfaces to mothers, all backed by the same API and database:

1. **Voice Call (push)** — System initiates. AI calls the mother on a scheduled basis. This is the primary clinical intake.
2. **USSD (pull)** — Mother initiates. She dials a shortcode on any basic phone. Text-menu interface.
3. **Smartphone Dashboard (pull)** — Mother initiates. She opens a web app on her smartphone. Visual card interface.

**USSD and the Smartphone Dashboard expose identical features** — same data, same operations, same API endpoints. The only difference is the presentation layer (text menus vs visual cards). This ensures a mother who switches from a basic phone to a smartphone (or vice versa) has a consistent experience.

### Module Breakdown

#### Deep Module: Triage Engine
Encapsulates all risk assessment logic. Takes structured symptom input, returns a risk level with recommended actions. Initially implemented as a rules-based engine. Designed so a real ML model can replace it with zero changes to calling code.

**Interface:**
```
Input:  { patientId, symptoms[], severity, gestationWeeks, pathway, history[] }
Output: { riskLevel: LOW|MEDIUM|HIGH, primaryConcern, recommendedActions[], referralNeeded, referralTarget?, confidence }
```

#### Deep Module: Alert Dispatcher
Handles all notification routing. Takes a risk assessment and patient record, determines who to notify and how (SMS, dashboard alert, ambulance dispatch). Single entry point for all escalation logic.

**Interface:**
```
Input:  { patient, riskAssessment, alertType }
Output: { alertsSent: [{ recipient, channel, status }], dispatchId }
```

#### Deep Module: Care Loop Manager
Tracks the full lifecycle of a care episode: registration → monitoring call → risk change → CHW alert → referral → transport → facility admission → outcome. Each state transition is recorded. Any actor in the system can advance the loop.

**Interface:**
```
Input:  { patientId, eventType, eventData, actorId, actorRole }
Output: { loopState, pendingActions[], isResolved }
```

#### Module: Session Manager (USSD)
Manages USSD session state — tracks which menu level the user is on, caches selections, handles timeouts. Sessions are keyed by phone number and expire after 3 minutes of inactivity.

#### Module: Consultation Engine
Handles the voice call AI conversation flow. Manages the dialog tree, language selection, symptom collection prompts, and response parsing. Produces structured symptom data that feeds into the Triage Engine.

#### Module: Vitals Recorder
Accepts vitals data from any source (voice call, USSD, dashboard, CHW manual entry). Validates ranges. Stores with source attribution and timestamp. Feeds into risk trend calculations.

#### Module: Multi-Language Renderer
All user-facing text (USSD menus, dashboard labels, SMS content, AI call scripts) is stored as keyed translations. Supports Swahili, English, Pidgin, and Somali. The system selects language based on the patient's profile.

### Database Schema (Supabase PostgreSQL)

Key tables:
- **patients** — demographics, pathway, language, gestation, phone, assigned CHW, current risk
- **consultations** — voice call records: transcript, symptoms extracted, risk assessment, AI recommendations
- **risk_assessments** — risk level history per patient (tracks changes over time)
- **vitals** — BP, kicks, hydration, weight, etc. with source attribution
- **referrals** — referral records: from, to, status, transport, outcome
- **care_loop_events** — every state transition in the care lifecycle
- **alerts** — notification log: recipient, channel, content, status
- **facilities** — health facility directory with location, services, hours
- **chw_zones** — CHW assignment zones and caseload summaries
- **users** — all system users (mothers, CHWs, providers) with role and auth
- **sms_log** — all SMS messages sent/received
- **grief_milestones** — post-loss emotional recovery tracking

### API Contract

All three mother-facing channels (voice, USSD, dashboard) hit the same API:

| Endpoint | Method | Used By | Purpose |
|----------|--------|---------|---------|
| `/api/patients` | GET | CHW, Provider | List patients (filterable by risk, CHW, pathway) |
| `/api/patients/:id` | GET | CHW, Provider | Single patient profile |
| `/api/consult` | POST | Voice, USSD, Dashboard | Submit symptoms, get risk assessment |
| `/api/consultations/:patientId` | GET | All | Call/consultation history |
| `/api/vitals` | POST | Dashboard, CHW | Record vitals |
| `/api/vitals/:patientId` | GET | Dashboard, CHW | Vitals history |
| `/api/referrals` | GET/POST | CHW, Provider | Referral management |
| `/api/referrals/:id` | PATCH | CHW, Provider | Update referral status |
| `/api/alerts` | GET | CHW, Provider | Alert history |
| `/api/analytics` | GET | Provider | Aggregate dashboard data |
| `/api/facilities` | GET | All | Facility directory |
| `/api/auth/login` | POST | All | Authentication |
| `/api/ussd/session` | POST | USSD Gateway | USSD session webhook |
| `/api/sms/webhook` | POST | SMS Gateway | Inbound SMS handling |

### USSD ↔ Dashboard Feature Parity

| Feature | USSD Path | Dashboard Path | Same API |
|---------|-----------|----------------|----------|
| Check risk level | Menu → "My Health Status" | Dashboard card | `GET /api/patients/:id` |
| Report symptom | Menu → "Report Symptom" → select → severity | Tap symptom button → severity picker | `POST /api/consult` |
| Next appointment | Menu → "Next Clinic Visit" | Appointment card | `GET /api/patients/:id` |
| Care tips | Menu → "Care Tips" | Tips feed | `GET /api/patients/:id` (tips derived from gestation) |
| Emergency | Menu → "Emergency Help" | Emergency button | `POST /api/alerts` (type: emergency) |
| Last vitals | Menu → "Health Status" → "Last BP" | Vitals card | `GET /api/vitals/:patientId` |

### Auth Model

- **Mothers:** Authenticated by phone number. Voice calls match by caller ID. USSD matches by dialing number. Dashboard uses phone + PIN login.
- **CHWs:** Email/password login (Supabase Auth). Access scoped to their assigned patients and zone.
- **Providers:** Email/password login (Supabase Auth). Access scoped to their facility/region.

### USSD Gateway

Uses Africa's Talking USSD API. The gateway sends HTTP POST webhooks to our server with session state. Our USSD Session Manager reads the current session, renders the appropriate menu, and returns a text response. Session state stored in Redis with 3-minute TTL.

---

## Prototype Scope (Phase 1)

This PRD describes the full product vision. The **prototype** will deliver a vertical slice that demonstrates the core loop end-to-end:

### In Prototype

- Mother registration (via CHW dashboard)
- Simulated voice call flow (AI conversation → symptom collection → risk assessment)
- Rules-based triage engine (placeholder for ML model)
- CHW dashboard: prioritized patient queue, risk alerts, patient profiles, visit notes
- CHW dashboard: referral creation and tracking
- Provider dashboard: aggregate KPIs, symptom distribution, referral queue
- USSD service: all 5 menu options (health status, report symptom, next appointment, care tips, emergency)
- Smartphone dashboard: mirrored USSD features (risk card, symptom reporter, appointment card, tips feed, emergency button)
- Post-loss pathway: grief check-in calls, coping index tracking, counselor escalation flag
- SMS alerts to CHWs on high-risk escalation
- Multi-language support: Swahili, English
- Supabase database with full schema
- Demo data: 3 patients (pregnant high-risk, pregnant low-risk, post-loss)

### Deferred to Later Phases

- ML risk prediction model (dataset sourcing in progress — rules engine in prototype)
- Real telephony integration (Twilio / Africa's Talking voice calls — simulated in prototype)
- Federated learning architecture
- Offline IVR screening
- Language corpus builder
- Live ambulance GPS tracking (simulated in prototype)
- Partner/family engagement calls
- Peer survivor group chat
- Data export and reporting
- Kenyan Data Protection Act compliance certification
- Production USSD shortcode negotiation with telcos
- Facility-level district analytics dashboard

---

## Testing Decisions

### What Makes a Good Test

Tests should verify **external behavior**, not implementation details. A test for the Triage Engine should verify that given a set of symptoms and patient context, the correct risk level and recommended actions are returned — not that a specific internal rule was evaluated. Tests should survive the swap from rules-based engine to ML model.

### Modules to Test

1. **Triage Engine** — Most critical module. Test with various symptom combinations, edge cases (contradictory symptoms, missing data), and pathway differences (pregnancy vs post-loss). These tests should pass identically whether the engine is rules-based or ML-based.

2. **Alert Dispatcher** — Verify correct routing: high-risk pregnancy → CHW SMS + dashboard alert + ambulance dispatch. Medium-risk → CHW dashboard alert only. Post-loss severe distress → counselor escalation.

3. **Care Loop Manager** — Verify state transitions: registration → first call → risk change → CHW alert → referral → transport → admission → outcome. Test that the loop cannot be closed without an outcome record.

4. **USSD Session Manager** — Verify menu navigation, session timeout, and that every USSD operation produces the same database changes as the equivalent dashboard operation.

5. **API Integration** — Verify that USSD webhook and Dashboard REST call for the same operation (e.g., report symptom) produce identical database records.

### Prior Art

The codebase uses React Hook Form with Zod for validation schemas. Tests should follow the same pattern: define input schemas with Zod, validate at the API boundary, and test against those schemas.

---

## Out of Scope

- **AI/ML model training** — Dataset sourcing and model development is a separate workstream. The prototype uses a deterministic rules engine.
- **Real telephony infrastructure** — No actual phone calls in the prototype. Voice calls are simulated through the web UI.
- **Production USSD shortcode** — Requires telco negotiation. Prototype uses Africa's Talking sandbox.
- **HIPAA / Kenyan Data Protection Act certification** — Architecture is designed for compliance but formal certification is out of scope.
- **Federated learning** — Research-phase feature. Not in prototype.
- **Offline IVR** — Requires local router deployment. Not in prototype.
- **Peer support group chat** — Complex social feature. Deferred.
- **Billing / subscription management** — Platform is free for mothers in prototype.
- **Admin panel** — User management and system configuration is handled directly in Supabase dashboard for the prototype.
- **Mobile native app** — Web-only for prototype. PWA considerations deferred.

---

## Further Notes

### Why Mirror USSD on the Dashboard

The decision to make USSD and the smartphone dashboard identical is deliberate. In the target communities, phone ownership is fluid — a mother may borrow a smartphone today and use a basic phone tomorrow. If the dashboard offers features that USSD does not, it creates a two-tier system where smartphone access determines care quality. By keeping feature parity, the clinical experience is consistent regardless of device.

The voice call remains the richest interaction (natural language, emotional tone detection, complex symptom collection). USSD and dashboard are self-service complements — they let mothers check status and report urgent symptoms between scheduled calls.

### Triage Engine Swap Strategy

The rules-based triage engine in the prototype is not a throwaway. It defines the **interface contract** that the ML model must satisfy. When the ML model is ready, it plugs into the same `TriageEngine` interface. All tests written against the rules engine should pass against the ML model without modification. This means the ML model's output must conform to the same shape: `{ riskLevel, primaryConcern, recommendedActions, referralNeeded, referralTarget, confidence }`.

### Three-Channel Data Flow

```
Voice Call ──→ Consultation Engine ──→ Triage Engine ──→ Alert Dispatcher
                                          │
USSD ───────→ Session Manager ────────────┤
                                          │
Dashboard ──→ API ───────────────────────┘
                                          │
                                          ▼
                                    Care Loop Manager
                                          │
                                          ▼
                                    Supabase (DB)
                                          │
                                          ▼
                                    CHW Dashboard ◄── Provider Dashboard
```

Every interaction — whether it starts as a voice call, a USSD session, or a dashboard tap — flows through the same Triage Engine and Care Loop Manager. There is one source of truth per patient.

### Language Strategy

The prototype ships with Swahili and English. The multi-language renderer is built to accept new languages without code changes — translations are keyed in the database. Adding Pidgin or Somali is a data task, not an engineering task.
