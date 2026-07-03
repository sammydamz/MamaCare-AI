# Ghana AI Innovation Challenge — Submission Draft

## 1. Team Diversity

Briefly describe how your team reflects diversity in gender, discipline, experience level, institution, and/or region:

> Our three-member team spans gender balance, multiple disciplines, and complementary experience levels. We combine public health expertise (Rosemond Osei), AI/ML engineering and full-stack development (Samuel Danquah Ankapong), and data science with health technology research (Grace Ametepi). The team blends senior-level clinical judgment with technical research and engineering execution. Members bring perspectives from direct healthcare delivery, AI research, and health systems innovation, with geographic roots in Ghana.

---

## 2. Problem Statement (max 200 words)

Describe the real-world problem you are addressing in Ghana and why it matters.

> According to the World Health Organization's Maternal Mortality fact sheet (April 2025), over 700 women died every day in 2023 from preventable causes related to pregnancy and childbirth. Sub-Saharan Africa accounted for around 70% of all maternal deaths. The maternal mortality ratio in low-income countries was 346 per 100,000 live births, compared to 10 per 100,000 in high-income countries.
>
> The gap is not a lack of clinical knowledge. It is a lack of continuous contact. Between clinic visits, pregnant women in rural Ghana receive little to no structured monitoring. Over 90% have access to a basic phone, but fewer than one in three have mobile internet. Existing digital health tools require smartphones and data, excluding the women who need support most.
>
> Health workers on the ground manage 200 to 400 patients with paper-based systems. They cannot follow up on every woman between visits, so warning signs are missed until they become emergencies.
>
> The problem is not that we do not know how to save these lives. The problem is that the women who need help cannot reach the system, and the system cannot reach them.

---

## 3. Objectives (max 150 words)

What are the main goals of your AI solution?

> Lower the barrier to continuous prenatal care for every pregnant woman in Ghana, regardless of location, internet access, or phone type. The platform works on a basic GSM phone with no smartphone or data required. Calls happen in the mother's local language.
>
> Ensure health workers can directly manage and monitor their patients no matter where the mother is. The clinical dashboard surfaces real-time risk assessments and escalation alerts, so a midwife at a district clinic can follow a high-risk patient in a remote village without waiting for her next visit.

---

## 4. Relevance to Ghanaian Context (max 150 words)

Explain how your solution responds to Ghana-specific needs, systems, or constraints.

> Ghana's Community-Based Health Planning and Services (CHPS) framework is the primary delivery system for rural maternal care. In practice, one community health officer covers roughly 3,500 people with paper-based tools, making regular follow-up on every pregnant woman impossible. The National Health Insurance Scheme covers maternal care on paper, but drug stockouts and out-of-pocket charges remain common, especially in northern regions where midwife coverage is thinnest.
>
> Over 90% of Ghanaians have access to a basic GSM phone, but fewer than one in three have mobile internet. The gender gap in mobile internet usage means women are disproportionately excluded from app-based health tools. MamaCare AI works on the phone she already has, in her language, with no download and no data required. It plugs into the existing CHPS structure instead of creating a parallel system.

---

## 5. Ghanaian Dataset(s) Used (required)

List all datasets you plan to use, indicating which are Ghanaian and primary. For each dataset, provide: name, type, source, access status.

> **Ghana Health Service National Safe Motherhood Protocol (Revised Edition)**
> - Type: Clinical guidelines document
> - Source: Ghana Health Service / Ministry of Health (openly available)
> - Access status: Publicly available PDF
> - Role: Primary Ghanaian dataset. We derived our triage training data from this protocol — mapping clinical warning signs (hemorrhage, pre-eclampsia, sepsis, etc.) to LOW, MEDIUM, HIGH risk labels. The resulting 28 clinical anchors were oversampled to 280 rows for model training. All derived data is available in our reproducibility package on GitHub.

---

## 6. Data Ethics and Protection (max 150 words)

Explain how you will handle data responsibly (privacy, consent, security, anonymization) in line with Ghanaian laws and ethical standards.

> All voice data collected through MamaCare AI calls is stored encrypted at rest and in transit. Informed consent is obtained during onboarding.
>
> We comply with Ghana's Data Protection Act (Act 843) and the Ministry of Health's data governance guidelines for digital health. Patient data is pseudonymized at the application level; the triage model receives de-identified symptom text only, with no name, phone number, or location attached to inference requests.
>
> Access to the clinical dashboard is role-based. Health workers see only their assigned patients. No data is shared with third parties.

---

## 7. AI / ML Approach (max 250 words)

Briefly describe the AI/ML techniques, models and tools you intend to apply.

> **Custom-trained triage model.** We fine-tuned DistilBERT-base-multilingual-cased (HuggingFace) on 280 synthetic symptom reports derived from the Ghana Health Service National Safe Motherhood Protocol. The model classifies patient-reported symptoms into three triage levels: LOW (routine symptoms), MEDIUM (signs requiring clinical review), and HIGH (danger signs requiring immediate escalation). Each class has 3-4 anchor variations per symptom to capture natural language variation. This is our own model, trained and maintained by the team.
>
> **Integrated services.** The voice layer uses Africa's Talking for IVR outbound calls, USSD, and SMS. For Ghanaian language speech recognition, we use the Khaya AI API by Ghana NLP, which transcribes Twi, Fante, Ewe, Ga, and Dagbani audio to English text. These are third-party APIs we integrate into our pipeline.
>
> **End-to-end flow.** Africa's Talking places an outbound call. The patient describes symptoms in her local language. Khaya AI transcribes the audio to English. Our DistilBERT model classifies the risk level. Africa's Talking delivers the result via SMS to the health worker. Patients can also dial a USSD short code to check their next appointment or last risk result.
>
> Next steps include expanding the anchor set with real clinical data from a pilot and incorporating a continuous feedback loop where health worker corrections retrain our model.

---

## 8. Proposed Work Plan (max 250 words)

> **Phase 1 — Foundation (Complete)**: Fine-tuned DistilBERT triage model from GHS Safe Motherhood Protocol anchors. Built IVR call flow with Africa's Talking. Developed clinical dashboard (React, Express.js, PostgreSQL).
>
> **Phase 2 — Local Language Pilot (Months 1-3)**: Integrate Khaya AI ASR for Akan (Twi/Fante). Conduct a 50-patient pilot in a peri-urban CHPS zone with verbal consent protocols. Collect real patient voice data (with consent) to expand training anchors. Validate triage accuracy against CHO assessments.
>
> **Phase 3 — Refinement and Scale Planning (Months 4-6)**: Retrain triage model with pilot data. Add MEDIUM-risk follow-up workflows (automated SMS reminders for CHW review). Develop training materials for health workers. Engage Ghana Health Service and district health directorates for partnership. Extend Khaya AI coverage to Ewe and Ga.
>
> **Phase 4 — Regional Deployment (Months 7-12)**: Deploy across 10 CHPS zones in two regions (one southern, one northern). Train CHOs and midwives on the dashboard. Establish a clinical oversight committee at the district level. Publish findings and open-source the expanded model and dataset.
>
> Key deliverables: functional IVR in Akan, validated triage accuracy report, integration with at least one district health information system, and a scale-ready deployment playbook for national rollout.

---

## 9. Scalability and Sustainability (max 200 words)

How could this solution be scaled or integrated into real-world systems.

> MamaCare AI is designed for scale from the ground up. The core insight is that it works on any GSM phone with no smartphone, no data plan, and no app download. That removes the primary barrier to digital maternal health in Ghana. Every pregnant woman with access to a basic phone can be reached.
>
> The cloud architecture (containerized, deployed on Railway) scales linearly with call volume. A single instance handles hundreds of concurrent IVR sessions. Adding new CHPS zones requires no hardware deployment, only phone numbers.
>
> Integration with Ghana's health system follows the existing CHPS structure. The clinical dashboard can feed summary data into the District Health Information Management System (DHIMS2), supporting government reporting without duplicating work.
>
> Sustainability is built through three revenue-neutral channels: (1) the open-source model ensures no vendor lock-in for the Ghana Health Service, (2) the platform can be offered as a free tier for public-sector CHPS zones with a premium tier for private maternity homes, and (3) the continuous feedback loop means the model improves with use rather than degrading.

---

## 10. Anticipated Impact (max 200 words)

Describe the potential impact of your solution on people, systems or institutions in Ghana.

> For pregnant women in rural Ghana, MamaCare AI means someone is watching between clinic visits. A woman who develops pre-eclampsia symptoms three weeks before her next appointment does not have to wait until she collapses. The system catches her, alerts her CHO, and she gets care in hours instead of weeks.
>
> For community health officers managing 200-400 patients with paper registers, the dashboard provides a live risk-sorted view of their caseload. HIGH-risk patients surface automatically. The CHO spends less time flipping through files and more time on the patients who need intervention. One CHO told us during research that she wished she had "a nurse who works weekends" — MamaCare AI is that nurse.
>
> For the Ghana Health Service, the platform generates anonymized population-level data on symptom prevalence and risk distribution across regions, supporting evidence-based resource allocation. The open-source model means the system can be adopted, adapted, and extended without licensing costs.
>
> Aligned with SDG 3 (maternal mortality reduction), SDG 5 (gender equality through accessible health technology), and SDG 10 (reduced inequality across geographic and income divides).

---

## 11. Innovation and Creativity (max 200 words)

Explain what is innovative about your approach.

> Two innovations define MamaCare AI.
>
> First, the zero-friction voice channel. While most maternal health apps require smartphones, data plans, and digital literacy, MamaCare AI works on the phone every Ghanaian woman already owns. The IVR system calls her, asks about her symptoms in her language, and acts on her answers. The user does nothing. No download, no login, no literacy barrier. This inverts the normal digital health model where the patient must reach the system.
>
> Second, the clinical guideline-to-NLP pipeline. Rather than training on massive hospital datasets that do not exist for Ghana, we derived our triage model directly from the GHS National Safe Motherhood Protocol. Clinical experts mapped each warning sign to a triage level. We generated natural-language anchor variations (28 anchors oversampled to 280 rows) and fine-tuned a multilingual DistilBERT model. This is a repeatable methodology: any clinical protocol can be turned into a triage classifier in weeks, not months, using this approach.
>
> The Khaya AI integration extends this to voice. Patients describe symptoms in Twi, Fante, Ewe, or Ga, the ASR transcribes to English, and the classifier returns a risk level, all in a single phone call.

---

## 12. Partnerships and Collaborations

Indicate any confirmed or potential partners and their roles.

