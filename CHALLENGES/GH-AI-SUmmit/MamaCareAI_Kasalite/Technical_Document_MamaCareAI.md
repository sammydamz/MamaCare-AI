# KASALITE — TECHNICAL DOCUMENTATION

## THE PROBLEM

MamaCare AI is specifically developed for the AI for Reproductive Health in Africa Innovation Challenge (HASH) under Track I: Access to Comprehensive Early Pregnancy Loss Care, and entered into the Ghana AI Innovation Challenge (July 2026).

Every year, women die from pregnancy complications that could have been prevented. According to the World Health Organization's Maternal Mortality fact sheet (April 2025), over 700 women died every day in 2023 from preventable causes related to pregnancy and childbirth. Sub-Saharan Africa accounted for around 70% of all maternal deaths. The maternal mortality ratio in low-income countries was 346 per 100,000 live births, compared to 10 per 100,000 in high-income countries. The WHO estimates that more than 75% of all maternal deaths are preventable with timely care. Women are not dying because we lack the knowledge to save them. They are dying because the care does not reach them in time.

Most maternal care is built around clinic visits. A woman attends her appointment, receives advice, and goes home. What happens between that visit and the next one is largely invisible to the health system.

This gap is where most deaths occur. Research shows that the majority of maternal deaths happen not during facility deliveries, but in the days and weeks before and after, when women are at home and out of contact with care providers. Data across multiple countries in sub-Saharan Africa shows that fewer than 43% of women received the recommended four or more antenatal care visits.[3] Postnatal care coverage is even lower, with fewer than 30% of women receiving a check within two days of delivery, which is the period of highest risk.[4]

The primary target users and beneficiaries of MamaCare AI are:

- **Pregnant and Post-Loss Mothers:** Specifically those residing in low-resource, rural, and peri-urban communities across Ghana. These mothers typically rely on basic feature phones, have limited or no mobile data connectivity, and may communicate primarily in local dialects rather than English.
- **Community Health Workers (CHWs) & Midwives:** Frontline health workers who manage massive patient caseloads (often 200-400 patients per nurse) with paper-based systems. MamaCare AI acts as a triaging copilot, prioritizing their daily follow-up queue.
- **District Health Administrators:** Managers who require aggregate, real-time data on maternal outcomes and referral compliance to allocate scarce resources.

Maternal mortality in Sub-Saharan Africa remains a pressing humanitarian crisis, accounting for approximately 70% of all global maternal deaths. The maternal mortality ratio in West Africa stands at roughly 542 deaths per 100,000 live births, compared to fewer than 10 in high-income regions. Over 75% of these deaths are preventable with timely intervention.

Traditional digital health solutions rely heavily on smartphone applications or high-bandwidth internet connectivity. However, across rural Sub-Saharan Africa, fewer than one in three individuals have access to mobile internet, and a persistent 20% gender gap in mobile internet usage further disadvantages women. By contrast, basic voice-based GSM coverage reaches over 90% of the population. MamaCare AI leverages this existing low-tech telephonic infrastructure, communicating in local Ghanaian languages like Twi, Fante, Ewe, Ga, and Dagbani, bypassing barriers of digital illiteracy and lack of internet access.

## SOLUTION OVERVIEW

MamaCare AI is a voice-based maternal care platform. It keeps women connected to health support throughout their pregnancy through regular, automated phone calls, while giving healthcare workers a clear, real-time picture of their patients so they can act quickly when someone needs help.

The platform was built around one central question: what does almost every woman in a low-resource setting already have access to? The answer is a basic phone. Not a smartphone. Not an internet connection. Just a phone that can make and receive calls. MamaCare AI works on that phone, in her language, without asking her to download anything or learn a new system. She just has to pick up when it calls. The platform integrates voice-based interaction with clinical risk detection, enabling automated check-ins and clinical decision support to manage pregnancy cases efficiently.

When a woman is enrolled in MamaCare AI by a health worker, a community volunteer, or through a simple call herself, she begins receiving regular check-in calls. The timing of these calls is tied to her stage of pregnancy, so the questions she is asked are always relevant to where she is in her journey.

The calls feel like a conversation, not a questionnaire. The platform asks how she has been feeling, whether she has noticed any changes (such as bleeding, pain, or fever), and tracks her symptoms continuously. It listens to her answers and responds in a way that makes sense for her situation. If she mentions a headache, it asks a follow-up question. If she describes something that sounds like a warning sign, the system takes note.

When the platform detects something that may need attention, it acts. It may give her clear guidance on what to do, alert her health worker right away, or in urgent situations, contact the nearest facility with her details and a summary of what she reported. This happens automatically, without her needing to know who to call or how to escalate the situation herself. Between these check-ins, the platform also supports her more broadly, reminding her when to take her medications, offering practical guidance on nutrition, and explaining clearly which symptoms mean she should go to a hospital without waiting.

Patients can also dial a USSD short code to check their next appointment date or view their last risk result on any phone, no smartphone required.

Healthcare workers access MamaCare AI through a simple web-based dashboard that works on any device, whether a desktop computer at the clinic, a tablet in the field, or a basic smartphone. The dashboard shows them all their patients, organised by how urgently each one needs attention.

### User Workflow

The patient-provider interaction follows a structured pathway to ensure prompt clinical response and triage:

1. **Enrollment:** The patient is enrolled in the clinic web interface by a midwife or community health worker, storing baseline details and language preference.
2. **Call Trigger:** The system schedules and initiates automated outbound calls based on the gestational calendar.
3. **Voice Interaction:** The mother communicates her symptoms verbally. The call is handled via Africa's Talking Voice API.
4. **Speech Recognition:** Audio is transcribed via the Khaya AI API by Ghana NLP, which provides production-grade ASR for Twi, Fante, Ewe, Ga, and Dagbani, returning English text directly.
5. **Triage Assessment:** The custom-trained DistilBERT model classifies the transcript as Low, Medium, or High Risk based on Safe Motherhood guidelines.
6. **Escalation:** Medium and High-risk cases are immediately escalated to the Clinician Dashboard with real-time WebSocket alerts and SMS notifications via Africa's Talking to prompt immediate clinical review and direct outreach.
7. **Patient Self-Service:** Patients can dial a USSD short code (via Africa's Talking) to check their next appointment or last risk result.

### Expected Health System Benefits

- **Reduction in Maternal Mortality via Early Detection:** Continuous monitoring ensures that dangerous conditions like severe pre-eclampsia or postpartum hemorrhage are detected days before they reach a fatal crisis point, allowing for preventive clinical interventions.
- **Community Health Worker Optimization:** Triaging automates the routine follow-up process, letting overstretched CHWs focus their limited hours on the high-risk cases that require human judgment and clinical care.
- **Elimination of Administrative & Paper Burden:** Automated record-keeping updates patient profiles after every call, eliminating manual registry logs and simplifying regional health reporting.

## TECHNICAL APPROACH

### AI/ML Methods & Paradigm: Guideline-Driven Few-Shot Fine-Tuning (GDF-FT)

To ensure high classification accuracy without large clinical datasets, MamaCare AI utilizes Guideline-Driven Few-Shot Fine-Tuning (GDF-FT). Standard fine-tuning often struggles with edge cases or hallucinates diagnoses in low-resource languages. GDF-FT solves this by encoding clinical protocols directly into the weights of a multilingual encoder.

By fine-tuning distilbert-base-multilingual-cased using structured semantic anchors, the embedding space is forced to align clinical statements (e.g., English: "heavy vaginal bleeding") close to their corresponding triage weights.

### Guideline Anchor Dataset

The training anchors are derived by us from the Ghana Health Service National Safe Motherhood Protocol (Revised Edition):

- HIGH RISK (Label 2)
- MEDIUM RISK (Label 1)
- LOW RISK (Label 0)

### Data Processing & Fine-Tuning Pipeline

1. **Oversampling:** The high-fidelity clinical anchors (28 original rows) are oversampled 10x (280 rows) to balance them.
2. **Training Parameters:**
   - Base Checkpoint: distilbert-base-multilingual-cased (134M parameters)
   - Training Loop: Hugging Face Trainer for 3 epochs
   - Learning Rate: 2e-5, with a weight decay of 0.01 and a batch size of 8

### Model Evaluation & Performance Metrics

The model was evaluated on a dedicated clinical test set:

- Overall Test Accuracy: 66.67%

| Risk Class | Precision | Recall | F1-Score | Support |
|------------|-----------|--------|----------|---------|
| LOW (Label 0) | 0.56 | 1.00 | 0.71 | 5 |
| MEDIUM (Label 1) | 1.00 | 0.20 | 0.33 | 5 |
| HIGH (Label 2) | 0.80 | 0.80 | 0.80 | 5 |

We acknowledge that more work needs to be done to effectively improve the model performance.

The model is hosted on the Hugging Face Hub at sammydamz/mamacare-triage-model.

### Telephony & Speech Architecture

MamaCare AI integrates telephony gateways with conversational speech systems:

1. **Call Processing:** Automated outbound calls are routed via Africa's Talking Voice API to feature phones.
2. **USSD:** Patients dial a short code via Africa's Talking USSD API to check appointment schedule and last risk result.
3. **SMS:** Alerts and notifications delivered via Africa's Talking SMS API.
4. **Speech Recognition:** Audio is transcribed via the Khaya AI API by Ghana NLP, which provides production-grade ASR for Twi, Fante, Ewe, Ga, and Dagbani, returning English text directly.
5. **Inference & Alerts:** Transcripts are classified via the hosted Hugging Face Inference Endpoint. Risk detections immediately alert clinicians via WebSockets and SMS.

### End-to-End Pipeline

```
Africa's Talking Voice API (IVR call)
    → Patient describes symptoms in local language
    → Khaya AI ASR (audio → English text)
    → DistilBERT triage classifier (LOW/MEDIUM/HIGH)
    → Africa's Talking SMS alert to CHO if HIGH
    → Dashboard notification + WebSocket
```

### Clinical Dashboard Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React |
| Backend | Express.js (Node.js) |
| Database | PostgreSQL |
| Cloud | Railway (containerized) |

## ETHICAL AND RESPONSIBLE AI CONSIDERATIONS

### Data Privacy & Security

In many communities, reproductive status and experiences of pregnancy loss carry social sensitivity. Unauthorized disclosure can lead to social stigma or domestic harm.

- **Protection:** All data is encrypted in transit (TLS 1.3) and at rest (AES-256).
- **Access Control:** Role-Based Access Control (RBAC) ensures health workers can only see patients within their assigned facility.
- **Consent:** Consent is obtained verbally in the mother's local language during enrollment, explaining what data is monitored and that participation is entirely voluntary.
- **Retention:** Patient records are retained in compliance with local country guidelines and deleted upon request.
- **Anonymization:** The triage model receives de-identified symptom text only, with no name, phone number, or location attached to inference requests.

### Bias & Fairness

Linguistic and demographic biases are common in global AI systems. MamaCare AI mitigates this by:

- Developing voice modules directly in local languages (Twi, Fante, Ewe, Ga, Dagbani) via Khaya AI rather than relying on automated machine translation of English scripts.
- Using localized training anchors to ensure regional syntax is recognized.
- Training health workers to treat AI recommendations as clinical suggestions, leaving final diagnostic decisions to human expertise.

### Transparency & Explainability

Rather than presenting black-box risk scores, the clinician dashboard displays plain-language symptom summaries derived from the rules in the National Safe Motherhood Protocol. For example, an alert will explicitly note: "Patient reported persistent headaches and facial swelling, indicating a high risk of Pre-Eclampsia."

## SCALABILITY AND SUSTAINABILITY

Because it relies on standard GSM voice calls, MamaCare AI scales without requiring new physical infrastructure. Expanding to a new region requires only localized voice content adaptation and clinician dashboard onboarding, allowing the platform to grow rapidly.

The platform employs a business-to-government (B2G) SaaS model, contracting directly with national and district health authorities. This aligns with public health budgets and ensures the service remains free for patients, supplemented by development grants in its early stages.

MamaCare AI is designed to integrate into existing structures, such as Ghana's Community-Based Health Planning and Services (CHPS) framework. It acts as a tool to enhance the capacity of existing community health nurses, rather than creating a parallel, disconnected care delivery system.

## TEAM

| Name | Role |
|------|------|
| Rosemond Osei | Public Health Expertise |
| Samuel Danquah Ankapong | AI/ML Engineering & Full-Stack Development |
| Grace Ametepi | Data Science & Health Technology Research |

## DATASETS

| Dataset | Type | Source | Access |
|---------|------|--------|--------|
| Ghana Health Service National Safe Motherhood Protocol | Clinical guidelines | GHS/MoH | Publicly available PDF |
| Triage training data (derived) | 280 synthetic symptom reports | Derived from protocol | Open in reproducibility package |

## PARTNERSHIPS

| Partner | Role |
|---------|------|
| Africa's Talking | Voice, USSD, and SMS infrastructure |
| Ghana NLP / Khaya AI | Ghanaian language ASR and translation API |
| Ghana Health Service | National deployment via CHPS framework (potential) |
| GAIN (Ghana AI Research Network) | Research collaboration and datasets (potential) |
| Railway | Cloud hosting |

## REFERENCES

1. World Health Organization. Maternal mortality. WHO Fact Sheet. Geneva: WHO; 2023. Available from: https://www.who.int/news-room/fact-sheets/detail/maternal-mortality
2. World Health Organization. Trends in maternal mortality 2000 to 2020: estimates by WHO, UNICEF, UNFPA, World Bank Group and UNDESA/Population Division. Geneva: WHO; 2023.
3. WHO, UNICEF, World Bank Group. Antenatal care coverage — at least four visits. World Health Statistics. Geneva: WHO; 2023.
4. World Health Organization. WHO recommendations on postnatal care of the mother and newborn. Geneva: WHO; 2013.
5. GSMA Intelligence. The State of Mobile Internet Connectivity 2023. London: GSMA; 2023.
6. GSMA Connected Women. The Mobile Gender Gap Report 2023. London: GSMA; 2023.
7. World Health Organization. The World Health Report 2006: Working Together for Health. Geneva: WHO Press; 2006.
8. Ghana Health Service. National Safe Motherhood Protocol (Revised Edition). Accra: GHS/WHO/UNFPA. Available at: GHS Safe Motherhood Protocol PDF
