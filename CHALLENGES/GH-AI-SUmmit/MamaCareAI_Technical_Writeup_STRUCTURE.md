# MamaCare AI — Technical Write-Up Structure (Pre-Write Outline)

---

## Section 1: Executive Summary

Every year, over 700 women die daily from preventable pregnancy complications, with sub-Saharan Africa accounting for 70 percent of those deaths. In Ghana, fewer than one in three women have mobile internet, yet over 90 percent have access to a basic phone. The gap is not clinical knowledge; it is continuous contact between visits.

MamaCare AI proposes a voice-based platform that works on any basic GSM phone, no smartphone, no data, or download required. The system calls women in their local language, uses AI to triage reported symptoms, and alerts their community health worker when danger signs appear. It serves women across three stages: prenatal, postpartum, and bereavement. It includes an inbound hotline and a smartphone app for those who have one.

Deployed within Ghana's primary healthcare framework, from CHPS zones through district hospitals, the platform will leverage Africa's Talking for voice infrastructure and Khaya AI for local language speech recognition. Over 18 months, this initiative will reach tens of thousands of women across multiple regions, catching complications early and reducing the distance between a mother and the care she needs.

---

## Section 2: Problem Statement

Every day in 2023, over 700 women died from preventable causes related to pregnancy and childbirth, with sub-Saharan Africa accounting for approximately 70% of all maternal deaths worldwide (World Health Organization [WHO], 2025). In Ghana, the maternal mortality ratio stands at 308 deaths per 100,000 live births, more than four times the Sustainable Development Goal target of 70 per 100,000 (Ghana Health Service [GHS], 2024). Skilled birth attendance has risen to 79%, yet one in five women still delivers without a skilled provider (Ghana Statistical Service, 2023). These deaths are not inevitable. More than 75% could be prevented with timely care (WHO, 2025). The gap is not clinical knowledge. It is continuous contact between visits.

In the prenatal period, 96% of Ghanaian women attend antenatal care at least once, but first-trimester registration remains at 62% nationally and falls lower in rural districts (GHS, 2024). Between clinic visits, danger signs such as severe headache, vaginal bleeding, and reduced fetal movements develop at home, where no health worker is watching. Community Health Officers (CHOs) manage 200 to 400 patients each using paper-based registers and cannot follow up on every woman between appointments (Baatiema, 2025). Over 90% of Ghanaians have access to a basic GSM phone, but fewer than one in three women have mobile internet, and the gender gap in smartphone access widens in rural areas (GSMA, 2023). Existing digital maternal health tools require smartphones and data connections, excluding the women who need support most.

The postpartum period carries the highest risk. More than half of all maternal deaths occur in the postnatal period, with 65% of these within the first week after delivery (Moyo et al., 2024). Postpartum haemorrhage is the leading direct cause of maternal death, accounting for 25.7% to 40% of maternal deaths in sub-Saharan Africa (Sidze et al., 2025). The Ghana Health Service National Safe Motherhood Protocol identifies haemorrhage as the primary cause of maternal death in the postpartum period and recommends routine monitoring for heavy bleeding, fever, severe headache, and foul-smelling discharge (GHS, 2019). Yet adequate postnatal care reaches only 27.42% of women across sub-Saharan Africa (Mekonen et al., 2025). Fewer than three in ten women receive the postpartum monitoring that could detect complications before they become emergencies.

Pregnancy loss affects approximately two million families globally each year. Sub-Saharan Africa accounts for nearly half of all stillbirths worldwide, with a stillbirth rate of 21 per 1,000 births, nearly double the global target of 12 or fewer (UNICEF, 2025). The perinatal mental health consequences of stillbirth have been described as "neglected for too long" in low- and middle-income countries (Blencowe et al., 2024). Bereaved mothers in Ghana report that health workers withdraw after a loss, with one study documenting participant accounts that "the health caregivers did not care about me after the loss" (Amankwah et al., 2023, p. 140). The GHS Safe Motherhood Protocol mandates emotional support and grief counseling for women who experience fetal death, yet no systematic mechanism exists to deliver this care. The Lancet Obstetrics, Gynaecology, and Women's Health has called for a global framework for bereavement care after stillbirth (Edwards & Li, 2025). A WHO policy brief confirms that maternal mental health conditions are highly prevalent in Ghana, with significant adverse effects on maternal and child outcomes (WHO Regional Office for Africa, 2024).

Across all three stages, the root cause is the same. Women in Ghana face a health system structured around clinic visits, with no bridge between them. A voice-based platform that works on any GSM phone, requires no data or smartphone, and communicates in local languages can reach women where existing digital tools cannot. The problem is not that the clinical knowledge is absent. It is that the women who need help cannot reach the system, and the system cannot reach them.

---

## Section 3: Target Users & Beneficiaries

The primary beneficiaries are pregnant and postpartum women in low-resource, rural, and peri-urban communities across Ghana. Within this group, women who experience pregnancy loss (miscarriage, stillbirth, or neonatal death) are a critical subset who currently receive no systematic follow-up care despite being at elevated risk for postpartum haemorrhage, infection, and perinatal mental health conditions. All three groups share the same access barrier: they own basic GSM phones (over 90% of Ghanaians), but fewer than one in three have mobile internet, and the gender gap in smartphone access widens in rural areas (GSMA, 2023). MamaCare AI reaches them on the phone they already have, in their language, with no download and no data required.

Secondary beneficiaries are frontline health workers. Community Health Officers manage caseloads of 200 to 400 patients across all three care stages using paper-based registers, with no systematic way to identify which women need attention between visits (Baatiema, 2025). The clinical dashboard provides a live, risk-sorted view of each CHO's caseload, automatically surfacing HIGH-risk patients for follow-up without manual register scanning. Tertiary beneficiaries include midwives and medical doctors who receive escalation alerts, and district health administrators who use aggregate risk data for resource allocation and DHIMS2 reporting.

Beneficiaries will be engaged in design through co-development sessions with CHOs and women at CHPS facilities, including bereaved mothers recruited through community health committees and church-based support groups. Voice prototypes will be tested iteratively in facility settings before scale. Enrollment follows existing GHS pathways: CHPS compound visits, antenatal clinics, postpartum discharge, and midwife referral after pregnancy loss. Continued engagement is sustained through automated outbound call schedules that follow women across care stage transitions (prenatal to postpartum to bereavement), making the service part of their routine health journey.

---

## Section 4: Solution Overview

MamaCare AI is a voice-based maternal care platform that works on any GSM phone. No smartphone, no data plan, and no download are required. The platform supports three care stages, each with stage-specific symptom questionnaires and escalation thresholds drawn from the Ghana Health Service National Safe Motherhood Protocol: PRENATAL (routine check-ins with danger sign triage for conditions such as pre-eclampsia, haemorrhage, and sepsis), POSTPARTUM (monitoring for heavy bleeding, fever, foul-smelling discharge, and severe headache in the first 12 weeks after delivery), and BEREAVEMENT (mental health follow-up for women who have experienced pregnancy loss, including PHQ-2 screening and referral pathways).

Patients interact with the platform through four access channels: outbound IVR calls initiated by the system on a scheduled cadence, an inbound IVR hotline for unscheduled concerns, a web-based dashboard for health workers, and a USSD short code for self-service (appointment checks, risk result lookups). All voice interactions occur in the patient's local language. Audio is transcribed via Khaya AI ASR, which supports Twi, Fante, Ewe, Ga, and Dagbani. The transcribed text is classified by a DistilBERT model fine-tuned on 280 symptom anchors derived from the GHS Safe Motherhood Protocol, returning a triage level of LOW, MEDIUM, or HIGH.

Health workers access a real-time dashboard that displays their full caseload sorted by risk level across all three care stages. MEDIUM and HIGH classifications trigger alerts in the dashboard and SMS notifications to the assigned health worker with a summary of the patient's reported symptoms. The platform is cloud-hosted. Patient data is encrypted at rest and in transit. The system complies with Ghana's Data Protection Act 2012 (Act 843) and the Cybersecurity Act 2020 (Act 1038), with cross-border data processing notifications filed with the Data Protection Commission as required.

---

## Section 5: Care Stages & Patient Journey

A mother is enrolled in MamaCare AI by a health worker during an antenatal care registration (prenatal stage), at hospital discharge after delivery (postpartum stage), or when a pregnancy loss is recorded (bereavement stage). Verbal consent is obtained in the mother's local language. Baseline data collected includes name, phone number, expected date of delivery or delivery date, language preference, and care stage.

Each patient profile carries a `care_stage` field with three values: `prenatal`, `postpartum`, or `bereavement`. This field is set and updated manually by the health worker through the clinical dashboard. No algorithm transitions a patient between stages. The care stage determines the call schedule, symptom questionnaire content, triage thresholds, and escalation rules applied to that patient. Stage transitions are triggered by health worker action: prenatal to postpartum when delivery is confirmed, prenatal or postpartum to bereavement when a loss is recorded, and bereavement to discharged when the health worker determines follow-up is no longer needed.

In the prenatal track, the automated call schedule follows a fixed cadence tied to gestational age: monthly calls during the first trimester, biweekly calls during the second trimester, and weekly calls during the third trimester. The system continues weekly calls through 40 weeks and 6 days. From 41 weeks onward, calls increase to twice weekly, aligned with the standard clinical surveillance schedule for prolonged pregnancies. All calls check for danger signs drawn from the Ghana Health Service Safe Motherhood Protocol, including vaginal bleeding, severe headache, blurred vision, reduced fetal movement, fever, abdominal pain, and swelling of the face or hands. Each call is classified by the DistilBERT triage model using the PRENATAL care-stage prefix, returning a LOW, MEDIUM, or HIGH risk level.

The postpartum track begins when the health worker records a delivery and sets the patient's care stage to postpartum. The call schedule is determined by the health worker based on the patient's condition and clinical judgment. Symptom monitoring focuses on postpartum haemorrhage (heavy bleeding, more than one pad per hour), fever, foul-smelling discharge, severe headache indicating possible postpartum pre-eclampsia, painful urination, breast redness or swelling suggestive of mastitis, difficulty breathing, calf pain or swelling indicating possible deep vein thrombosis, and perineal wound concerns. The DistilBERT model applies the POSTPARTUM prefix for stage-appropriate triage.

The bereavement track begins when the health worker records a pregnancy loss (miscarriage, stillbirth, or neonatal death) in the dashboard and sets the care stage to bereavement. The purpose of this track is structured mental health follow-up for a group that receives no systematic support in the current health system. The call schedule is set by the health worker. Calls include PHQ-2 screening adapted for voice IVR administration to assess mood and anhedonia. The system flags distress indicators for review by the health worker, who handles all follow-up actions manually through the dashboard or by phone. No clinical action is automated.

Across all three tracks, the system sends an SMS alert to the assigned health worker whenever a call returns a MEDIUM or HIGH triage result. The alert includes a summary of the patient's reported symptoms. The health worker reviews the full patient context, past consultations, and risk history on the dashboard and decides on any follow-up action. All clinical decisions, referrals, and patient outreach are initiated manually by the health worker.

---

## Section 6: Access Channels

The platform provides four access channels designed to meet women wherever they are in terms of device type, connectivity, and digital literacy.

**Outbound IVR calls** are the primary channel. Africa's Talking Voice API places automated calls on a schedule determined by the patient's care stage and gestational or postnatal timeline. The patient hears a greeting in her language and responds to symptom questions using her voice. Responses are transcribed from the local language to English by the Khaya AI ASR API. The DistilBERT triage model classifies the risk level as LOW, MEDIUM, or HIGH. HIGH risk results trigger an immediate SMS alert and dashboard notification to the assigned health worker. MEDIUM risk results are logged for next-day health worker review. LOW risk results are logged without escalation.

**The inbound IVR hotline** provides a dedicated virtual number that mothers can call at any time to report new symptoms that arise between scheduled check-ins. The call flow is identical to the outbound channel: Khaya AI ASR transcription followed by DistilBERT triage, with alerts triggered for HIGH risk results. Inbound calls do not reset the outbound call schedule. The service is available 24 hours a day, seven days a week, with health workers engaged only for HIGH-risk escalations.

**The smart mobile application** provides an alternative channel for smartphone users to log in and interact directly with the AI agents. Patients can view their scheduled visits, track upcoming appointments, and see an overview of their risk monitoring history. The app uses the same backend API, triage model, and database as the voice channels. Health workers see all patient interactions from all channels in a single dashboard.

**USSD self-service** operates on any phone without requiring a smartphone or data connection. Patients can dial a short code to check their next appointment date or view their last triage result. This channel provides quick, text-based access to essential information between voice interactions.

---

## Section 7: AI/ML Approach

The proposed AI approach uses a single DistilBERT model to classify reported symptoms into three triage levels -- LOW, MEDIUM, and HIGH -- based on the clinical thresholds defined in the Ghana Health Service National Safe Motherhood Protocol (GHS, 2019). The approach builds on a working prototype that demonstrated the feasibility of encoding protocol-derived clinical knowledge into a lightweight transformer model.

### 7.1 Semantic Anchor Dataset

During the grant period, we will develop a structured semantic anchor dataset in collaboration with a maternal health expert and the Clinical Support and Training Office (COSTO). Each anchor pairs a symptom description with a protocol-aligned triage level. For example, "I have a severe headache and my vision is blurred" during the prenatal stage maps to HIGH (suspected pre-eclampsia), while the same symptom in the bereavement stage maps to LOW (sleep deprivation). The dataset will cover all three care stages:

- **Prenatal:** Danger signs including severe headache, vaginal bleeding, reduced fetal movements, swollen hands/face, and fever, derived from the antenatal monitoring schedule in the Safe Motherhood Protocol.
- **Postpartum:** Danger signs including heavy bleeding, foul-smelling discharge, fever, severe headache, and breast engorgement with redness, derived from the postnatal monitoring schedule.
- **Bereavement:** Mental health distress indicators including persistent sadness, social withdrawal, and sleep disturbance, aligned with PHQ-2 screening criteria.

Each training example will be prepended with a care-stage prefix -- `[PRENATAL]`, `[POSTPARTUM]`, or `[BEREAVEMENT]` -- before tokenization. This enables a single model to learn stage-dependent risk weighting: the same symptom phrase receives a different triage level depending on the stage prefix.

### 7.2 Model Architecture

| Parameter | Value |
|-----------|-------|
| Base model | distilbert-base-multilingual-cased (134M parameters) |
| Training framework | Hugging Face Trainer |
| Learning rate | 2e-5 |
| Weight decay | 0.01 |
| Batch size | 8 |
| Number of epochs | 3 |
| Hosting | Hugging Face Inference Endpoint |
| Input format | [STAGE] patient-reported symptom text |

The model is selected for its small footprint (134M parameters), multilingual tokeniser, and suitability for the low-resource setting: inference runs on a single CPU endpoint with sub-second latency, appropriate for a voice-based system where the patient is on the phone.

### 7.3 Training and Evaluation

Training will use the semantic anchor dataset with stratified train-test splitting to ensure each care stage is represented in both sets. The three-way classification (LOW, MEDIUM, HIGH) will be evaluated using per-class precision, recall, and F1 score, tracked separately for each care stage.

A continuous feedback loop will be established: when a health worker disagrees with a triage classification, the corrected label will be logged and incorporated into periodic retraining cycles. Over the 18-month grant period, this feedback loop will progressively improve accuracy on real patient language beyond what the initial anchor dataset captures.

### 7.4 Speech Recognition Pipeline

Patient voice input is transcribed by Khaya AI, a local language ASR system developed by the Ghana NLP group that supports Twi, Fante, Ewe, Ga, and Dagbani. The transcribed English text is passed to the DistilBERT classifier. The full pipeline from voice input to triage output completes within the duration of a single IVR call.

---

## Section 8: Technical Architecture

### 8.1 End-to-End Pipeline
```
┌────────────────────────────────────────────────────────────┐
│                    ACCESS CHANNELS                          │
├─────────────────┬──────────────────┬───────────────────────┤
│ Outbound IVR    │ Inbound Hotline  │ Smart App             │
│ (AT Voice API)  │ (AT Voice API)   │ (React Native)        │
├─────────────────┴──────────────────┴───────────────────────┤
│                     USSD (AT USSD API)                      │
├────────────────────────────────────────────────────────────┤
│              Khaya AI ASR (audio → English text)            │
├────────────────────────────────────────────────────────────┤
│   DistilBERT Triage (prepend care_stage → classify)        │
├────────────────────────────────────────────────────────────┤
│      Africa's Talking SMS + Dashboard Alert                │
├────────────────────────────────────────────────────────────┤
│       Clinical Dashboard (React + Express + PG)             │
└────────────────────────────────────────────────────────────┘
```

The architecture follows a layered pipeline: access, speech recognition, AI triage, alerting, and storage. All channels converge on the same backend API, triage model, and database.

### 8.2 Telephony & Speech Services

Four services handle the voice layer:

- **Africa's Talking Voice API** routes outbound and inbound IVR calls, with DTMF input for structured symptom selection and voice recording for free-text responses.
- **Africa's Talking SMS API** delivers HIGH-risk alerts containing the patient's name, reported symptoms, and triage summary to the assigned health worker's phone.
- **Africa's Talking USSD API** provides a self-service channel for appointment checks and risk result lookups without requiring a smartphone or data connection.
- **Khaya AI** transcribes local language audio (Twi, Fante, Ewe, Ga, and Dagbani) into English text for classification.

### 8.3 Smart App Integration

The smart mobile application connects to the same REST API as the clinical dashboard. Users authenticate via token rather than phone number. Structured symptom submissions pass through the same triage endpoint and alerting pipeline as voice interactions. Push notifications via Firebase Cloud Messaging serve as an alternative to voice calls for scheduled check-ins.

### 8.4 Cloud Infrastructure

| Layer | Technology |
|-------|-----------|
| Frontend | React (web), React Native (mobile) |
| Backend | Express.js (Node.js) |
| Database | PostgreSQL |
| Hosting | Railway (containerized) |
| AI Hosting | Hugging Face Inference Endpoint |
| Push Notifications | Firebase Cloud Messaging |

The platform is containerised and deployed on Railway, which provides automatic scaling, TLS termination, and environment management. Patient data is stored in a managed PostgreSQL instance with encryption at rest.

### 8.5 Data Flow

1. A patient answers an outbound IVR call or dials the inbound hotline. Voice input is captured through Africa's Talking Voice API.
2. Khaya AI ASR transcribes the audio into English text. If the patient uses DTMF to select symptoms from a structured menu, the selection is mapped directly to text.
3. The system prepends the patient's current care stage (`[PRENATAL]`, `[POSTPARTUM]`, or `[BEREAVEMENT]`) to the transcribed text.
4. The DistilBERT classifier returns a triage level: LOW, MEDIUM, or HIGH.
5. If HIGH, an SMS alert is sent to the assigned health worker via Africa's Talking SMS API, and a real-time notification is pushed to the dashboard via WebSocket.
6. If MEDIUM, the result is logged and surfaced in the dashboard for next-day review.
7. If LOW, the result is logged only.
8. All interaction data is stored in PostgreSQL with encryption at rest.

---

## Section 9: Clinical Dashboard

Health workers access a real-time web dashboard that displays their full caseload sorted by risk level, with HIGH-risk patients listed first. The dashboard is built with React and communicates with the Express.js backend via WebSocket for live alerts.

### 9.1 Features

The patient list can be filtered by care stage (prenatal, postpartum, bereavement). Each patient detail view shows the full history of check-ins, triage results, and call transcripts. Stage transition controls allow the health worker to mark a delivery, record a pregnancy loss, or discharge a patient. The call schedule view lists upcoming automated calls and allows the health worker to trigger a manual call when needed.

### 9.2 Roles & Access Control

| Role | Access |
|------|--------|
| Community Health Officer | Assigned patients only |
| Midwife or Doctor | All patients in their facility |
| District Health Administrator | Aggregate data only, no patient-level personally identifiable information |

### 9.3 Outcome Tracking Dashboard

The dashboard includes an outcome tracking view aligned with Dr Alim Swarray-Deen's evaluation framework. It surfaces primary outcome metrics (danger signs identified, median time to provider notification, referral completion), secondary clinical indicators linked to DHIMS2 (severe maternal morbidity, preterm birth, stillbirth, NICU admission), and implementation metrics (call completion rate, AI accuracy, provider response time, patient satisfaction).

---

## Section 10: Expected Outcomes & Metrics

The evaluation follows the framework developed by Dr Alim Swarray-Deen (University of Ghana Medical School), organised across four domains: primary clinical outcomes, secondary clinical outcomes, implementation outcomes, and system performance outcomes.

### 10.1 Primary Outcome
| Metric | Measure | Collection Method |
|--------|---------|------------------|
| Proportion of women with danger signs identified | % of enrolled women flagged HIGH/MEDIUM at least once | Dashboard analytics |
| Median time from symptom onset to provider notification | Hours/minutes between call timestamp and alert acknowledgement | System logs |
| Proportion successfully referred and reviewed | % of HIGH alerts resulting in documented clinical review | Health worker confirmation in dashboard |

### 10.2 Secondary Outcomes — Clinical
| Metric | Phase Measured | Data Source |
|--------|---------------|-------------|
| Severe maternal morbidity | Phase 3-4 (scale) | DHIMS2 linkage |
| Preterm birth | Phase 3-4 | DHIMS2 linkage |
| Stillbirth | Phase 3-4 | DHIMS2 linkage |
| NICU admission | Phase 3-4 | DHIMS2 linkage |

### 10.3 Secondary Outcomes — Implementation
| Metric | Phase Measured | Data Source |
|--------|---------------|-------------|
| Acceptability | Phase 2 (pilot) | Endline survey |
| Feasibility | Phase 2 | Process data + qualitative interviews |
| Adoption | Phase 2-3 | Enrollment rate, call answer rate |
| Retention | Phase 2-3 | % still active at 6 months |
| Fidelity | Phase 2-3 | % scheduled calls completed per protocol |

### 10.4 Secondary Outcomes — System
| Metric | Phase Measured | Data Source |
|--------|---------------|-------------|
| Call completion rate | Phase 2+ | Africa's Talking logs |
| AI accuracy (sensitivity/specificity) | Phase 2+ | Comparison with CHO assessment |
| Provider response time | Phase 2+ | Time from alert to dashboard open |
| User satisfaction | Phase 2+ | Survey (patients + health workers) |

---

## Section 11: Data Ethics & Protection

Patient data is encrypted in transit (TLS 1.3) and at rest (AES-256). Access is controlled through role-based access control: health workers see only their assigned patients, and district administrators access aggregate data only. The triage model receives de-identified text without patient identifiers.

Verbal informed consent is obtained from each woman during enrollment in her local language, explaining what data is collected, how it is used, and her right to withdraw at any time. The system complies with the Ghana Data Protection Act 2012 (Act 843) and Ministry of Health data governance guidelines. Cross-border data processing notifications will be filed with the Data Protection Commission as required.

Bereavement records receive additional access restrictions given the heightened sensitivity of mental health data. Data retention follows Ghana health record retention laws, and patients may request deletion of their records at any time. Research outputs will comply with the Gates Foundation Open Access Policy; patient data is never shared.

---

## Section 12: Scalability & Sustainability

The platform is designed to scale without hardware deployment: it works on any GSM phone and the cloud architecture scales linearly with call volume. Adding a new region requires only enrolling new health workers and patients, not installing infrastructure.

Integration with DHIMS2 enables the platform to feed into government reporting systems, making it sustainable within Ghana's existing health information architecture. The AI model and dataset will be open-sourced, avoiding vendor lock-in for the Ghana Health Service.

The business model follows a B2G SaaS approach: a free tier for public CHPS zones funded through the grant and government partnerships, with a premium tier for private maternity homes. The AI model improves with use through the continuous feedback loop. Khaya AI currently covers five Ghanaian languages with an expansion roadmap, allowing geographic growth without rebuilding the voice layer.

---

## Section 13: Updated Work Plan

Work is organised in four phases spanning the 18-month grant period, building on a completed foundation phase.

### Phase 1 — Foundation (Complete)
- Fine-tuned DistilBERT triage model from GHS Safe Motherhood Protocol anchors (prenatal)
- Built IVR call flow with Africa's Talking (outbound)
- Developed clinical dashboard (React, Express.js, PostgreSQL)
- Deployed prototype on Railway

### Phase 2 — Enhancement + Local Language Pilot (Months 1-4 of grant)
- Add `care_stage` field and stage-aware prefix to triage pipeline
- Generate postpartum + bereavement anchors, retrain model
- Implement inbound hotline via Africa's Talking
- Develop native smart app (structured symptom checklist)
- Integrate Khaya AI ASR for Akan (Twi/Fante)
- Build outcome tracking dashboard (Dr Alim metrics)
- Conduct 50-patient pilot in peri-urban CHPS zone
- Pilot covers all three tracks: prenatal, postpartum, bereavement
- Validate triage accuracy against CHO assessments
- Collect patient satisfaction data

### Phase 3 — Refinement + Scale Planning (Months 5-8)
- Retrain model with pilot data
- Add MEDIUM-risk follow-up workflows (automated SMS reminders for CHW review)
- Extend Khaya AI to Ewe and Ga
- Develop training materials for health workers
- Engage Ghana Health Service and district health directorates
- Refine mental health screening protocols based on pilot feedback

### Phase 4 — Regional Deployment (Months 9-18)
- Deploy across 10 CHPS zones in two regions (southern + northern)
- Train CHOs and midwives on dashboard + app
- Establish clinical oversight committee at district level
- Link with DHIMS2 for clinical outcome tracking
- Publish findings and open-source expanded model and dataset
- Develop deployment playbook for national rollout

### Key Deliverables
- Functional IVR in Akan (outbound + inbound)
- Smart app (iOS + Android)
- Validated triage accuracy report (prenatal + postpartum + bereavement)
- Mental health screening protocol for bereaved mothers
- Integration with at least one district health information system
- Scale-ready deployment playbook

---

## Section 14: Team

The team brings together public health, AI engineering, and health data science expertise, all based in Ghana.

- **Rosemond Osei** leads public health strategy, clinical partnerships, and community engagement. Her background in maternal health programming ensures the solution is grounded in Ghana's health system realities.
- **Samuel Danquah Ankapong** leads AI/ML engineering and full-stack development. He built the prototype and will lead the semantic anchor dataset development, model training, and platform architecture.
- **Grace Ametepi** leads data science and health technology research, including the monitoring, evaluation, and learning framework, outcome tracking, and evidence generation.

---

## Section 15: Partnerships

The platform is built on established partnerships with technology providers and health system stakeholders.

| Partner | Role | Status |
|---------|------|--------|
| Africa's Talking | Voice, USSD, and SMS infrastructure | Integrated, prototype live |
| Ghana NLP / Khaya AI | Ghanaian language speech recognition | Integration planned in Phase 2 |
| Ghana Health Service | National deployment via the CHPS framework | Under discussion |
| GAIN (Ghana AI Research Network) | Research collaboration and peer review | Under discussion |
| Railway | Cloud hosting and deployment infrastructure | Active |
| Hugging Face | Model hosting and inference endpoints | Active |

During the grant period, we will formalise partnerships with COSTO (Clinical Support and Training Office) for clinical oversight and a maternal health expert consultant for semantic anchor dataset validation.

---

## Section 16: Alignment with Grant Criteria

The proposed platform directly addresses the four evaluation criteria of the SheConnects Digital Accelerator: Africa.

### 16.1 Digital Technology Integration (25 points)
- Four-channel access (IVR outbound, IVR inbound, smart app, USSD)
- Voice-first, low-bandwidth, works on basic phones
- Khaya AI for local language ASR
- Stage-aware AI triage

### 16.2 Inclusive Design and Safe Use (25 pts)
- Women-centered: designed around the phone she already has
- Accommodates: limited time, shared devices, no/low connectivity, low literacy
- Local language voice interaction
- Bereavement track with trauma-informed mental health support

### 16.3 Partnership Networks (25 pts)
- Africa's Talking (telecom infrastructure)
- Ghana NLP / Khaya AI (language technology)
- Ghana Health Service / CHPS (delivery at scale)
- GAIN (research ecosystem)

### 16.4 Credible Pathway to Scale (25 pts)
- 50,000+ women reachable via existing GSM infrastructure
- Cloud architecture scales linearly
- Continuous improvement through feedback loop
- Open-source + B2G sustainability model
- Phased rollout: pilot → 10 zones → national deployment playbook

---

## Appendices
- A: GHS Safe Motherhood Protocol — Prenatal Danger Sign Anchors
- B: Postpartum Danger Sign Anchors (proposed)
- C: Mental Health Screening Protocol (proposed, adapted from PHQ-9)
- D: Budget Breakdown (reference to SCDA Budget Guidelines)
- E: References

---

## References

Mensah Abrampah, N. A., Okwaraji, Y. B., You, D., Hug, L., Maswime, S., Pule, C., Blencowe, H., & Jackson, D. (2023). Global stillbirth policy review: Outcomes and implications ahead of the 2030 Sustainable Development Goal agenda. *International Journal of Health Policy and Management*, *12*(1), 7391. https://doi.org/10.34172/ijhpm.2023.7391

Amankwah, B., Ani-Amponsah, M., Mahama, M., Gyepi-Garbrah, A., Richardson, D., Mensah, O. N., & Ofosu-Poku, R. (2023). "The health caregivers did not care about me after the loss": Maternal experiences of perinatal loss in the Kumasi Metropolitan Area, Ghana. *Journal of Social Work in End-of-Life & Palliative Care*, *19*(2), 133-149. https://doi.org/10.1080/15524256.2023.2220078

Baatiema, L. (2025). Strengthening maternal healthcare in Ghana: Utilizing the community-based health planning and services model as a vehicle. *Frontiers in Global Women's Health*, *6*, 1590452. https://doi.org/10.3389/fgwh.2025.1590452

Blencowe, H., Campbell, O., Kerac, T., Stafford, R., Tripathi, V., & Filippi, V. (2024). Neglected for too long: Perinatal mental health impacts of stillbirth in low- and middle-income countries. *BJOG: An International Journal of Obstetrics & Gynaecology*, *132*(4), 563-572. https://doi.org/10.1111/1471-0528.18051

Edwards, D., & Li, W. (2025). Bereavement care after stillbirth: Need for a global framework. *The Lancet Obstetrics, Gynaecology, and Women's Health*, *1*(1), e13-e14. https://doi.org/10.1016/j.lanogw.2025.100021

Ghana Health Service. (2019). *National safe motherhood protocol* (Revised ed.). Ministry of Health, Republic of Ghana.

Ghana Health Service. (2024). *District Health Information Management System (DHIMS 2) annual report, 2024*. Ministry of Health, Republic of Ghana.

Ghana Statistical Service. (2023). *Ghana Demographic and Health Survey 2022: Key indicators report*. GSS, GHS, and ICF.

GSMA. (2023). *The mobile gender gap report 2023*. GSMA Connected Women.

Mekonen, E. G., Workneh, B. S., Zegeye, A. F., & Tamir, T. T. (2025). Only three out of ten women received adequate postnatal care in sub-Saharan Africa: Evidence from 20 countries demographic and health surveys (2015-2022). *BMC Pregnancy and Childbirth*, *25*(1), 138. https://doi.org/10.1186/s12884-025-07276-x

Moyo, E., Moyo, P., Dzinamarira, T., & Ross, A. (2024). Postpartum women's experiences of postnatal care in sub-Saharan Africa: A qualitative evidence synthesis. *Birth*, *51*(3), 421-433. https://doi.org/10.1111/birt.12872

Sidze, L., Moore, J. L., Carlo, W. A., Mwenechanya, M., Chomba, E., Hemingway-Foday, J. J., & Goldenberg, R. L. (2025). Intrapartum oral azithromycin for maternal infection prophylaxis and the risk of postpartum hemorrhage: A secondary analysis of the A-PLUS trial. *International Journal of Gynecology & Obstetrics*. Advance online publication. https://doi.org/10.1002/ijgo.70777

UNICEF. (2025). *Standing up for stillbirth: Current estimates and key interventions*. United Nations Children's Fund. https://data.unicef.org/resources/standing-up-for-stillbirth-report/

World Health Organization. (2025). *Maternal mortality: Key facts*. https://www.who.int/news-room/fact-sheets/detail/maternal-mortality

WHO Regional Office for Africa. (2024). *Strengthening maternal mental health in Ghana* [Policy brief]. World Health Organization.

---

_End of technical write-up structure. All 16 sections drafted._
