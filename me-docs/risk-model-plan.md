# MamaCare AI — Risk Model Research & Implementation Plan

> **Date:** May 31, 2026
> **Scope:** Two text-based risk classifiers (Pregnancy + Post-Loss) for voice call transcripts
> **Country Context:** Ghana — CHPS zones, Ghana Health Service protocols, local languages
> **Status:** Research complete, ready for implementation decisions

---

## 1. The Problem

The voice agent calls a mother in Ghana. She speaks in her own words — "my head dey pain me", "I see blood", "I can't sleep since the baby passed". The call is transcribed. We need to:

1. **Extract clinically relevant signals** from natural-language text
2. **Classify risk** as LOW / MEDIUM / HIGH
3. **Recommend actions** (advice, closer monitoring, immediate escalation)

This is **not** a vitals-based model (BP, glucose, hemoglobin). It's a **conversational NLP** problem — text in, risk out.

Two separate pathways:
- **Pregnancy**: Danger signs from Ghana's National Safe Motherhood Protocol — bleeding, headache, swelling, fever, reduced fetal movement, pain
- **Post-Loss**: Physical recovery + emotional state — grief severity, coping, sleep, bleeding, infection signs, depression/anxiety

---

## 2. Ghana Country Context

### 2.1 Healthcare System Structure

MamaCare operates within Ghana's **CHPS (Community-based Health Planning and Services)** framework:

- **Community Health Officers (CHOs)** — stationed in CHPS zones, provide doorstep services
- **Community Health Nurses** — midwife-level care at health centres
- **District Hospitals** — referral facilities with comprehensive obstetric care
- **Teaching Hospitals** — tertiary referral (Korle Bu, Komfo Anokye, Tamale Teaching)

**Referral chain:** CHPS compound → Health centre → District hospital → Regional/Teaching hospital

The risk model must align with this referral chain — HIGH risk triggers referral to the next level.

### 2.2 Languages in Ghana (MamaCare Coverage)

| Language | Region | Speakers |
|----------|--------|----------|
| **Twi (Akan)** | Ashanti, Eastern, Central, parts of Brong-Ahafo | ~11M (most widely spoken) |
| **Ga** | Greater Accra | ~600K |
| **Hausa** | Northern, Upper East/West, Zongo communities | Trade language, widely understood in North |
| **Yoruba** | Parts of Volta, immigrant communities | Minority |
| **Igbo** | Immigrant communities | Minority |
| **English** | National / official | Educated population, healthcare workers |
| **French** | Border areas (Francophone neighbors) | Limited |
| **Ewe** | Volta Region | ~2M |
| **Dagbani** | Northern Region | ~1.2M |
| **Frafra** | Upper East | ~500K |

**Current MamaCare languages:** Hausa, Yoruba, Igbo, English, French
**Recommended additions:** Twi (highest coverage), Ga (Accra), Ewe (Volta), Dagbani (North)

### 2.3 Maternal Health Statistics — Ghana

| Indicator | Value | Source |
|-----------|-------|--------|
| Maternal Mortality Ratio | 308 per 100,000 live births | Ghana Maternal Health Survey 2017 |
| Leading causes of maternal death | Hemorrhage, Sepsis, Hypertensive disorders (pre-eclampsia/eclampsia), Unsafe abortion | Ghana Safe Motherhood Protocol |
| Postpartum depression prevalence | 10-25% (varies by study) | Ayele et al. 2018 (Tamale); Nakku et al. (Kumasi) |
| Stillbirth rate | ~17 per 1,000 births | GMHS 2017 |
| Facility delivery rate | ~73% | GMHS 2017 |
| ANC 4+ visits coverage | ~64% | GMHS 2017 |
| CHW density | Low — CHPS covers ~60% of zones but many understaffed | Ghana Health Service |

### 2.4 Key Regulatory & Policy Documents

| Document | Relevance | Source |
|----------|-----------|--------|
| **National Safe Motherhood Protocol (Revised)** | Defines danger signs, referral criteria, and management at each level (community → comprehensive). Our rule-based engine MUST follow this. | Ghana Health Service / WHO platform |
| **National Reproductive Health Service Policy & Standards (2014)** | Sets care standards, including post-loss and bereavement care | Ghana Health Service |
| **National Maternal & Newborn Health Quality of Care Strategic Roadmap** | Quality improvement framework | Ghana Health Service / WHO |
| **CHPS Implementation Guidelines** | Defines CHW/CHO roles, zone structure, community engagement | Ghana Health Service |
| **Ghana Maternal Health Survey 2017 (GMHS)** | National dataset with verbal autopsy data, danger sign knowledge, care-seeking behavior | GSS/GHS/DHS Program |

---

## 3. Dataset Research Results

### 3.1 Ghana-Specific Datasets (PRIMARY)

| Dataset | Size | Format | Relevance | Source |
|---------|------|--------|-----------|--------|
| **Ghana Maternal Health Q&A (Twi-English)** | **20,000 Q&A pairs** | Code-mixed Twi-English questions & answers | ★★★★★ Ghana-specific maternal health conversations in Twi-English. Exactly the language mixing our voice agent will encounter. Best dataset for training pregnancy symptom extraction. | Kaggle — ghanaairesnet |
| **Ghana Maternal Health Q&A (English)** | **20,000 Q&A pairs** | English Q&A | ★★★★★ Same content in English. Paired with Twi-English version for translation/symptom mapping. | Kaggle — ghanaairesnet |
| **Ghana Maternal Health Q&A (Ga-English)** | **20,000 Q&A pairs** | Code-mixed Ga-English Q&A | ★★★★ Ga language coverage for Accra-area mothers. | Kaggle — ghanaairesnet |
| **Ghana Maternal Health Survey 2017 (GMHS)** | National survey | Verbal autopsy, danger sign knowledge, symptoms, outcomes | ★★★★★ National representative data on what Ghanaian women know about danger signs, what symptoms they report, and care-seeking patterns. Has verbal autopsy data for maternal deaths with symptoms before death. | DHS Program (request access) |
| **Ghana Safe Motherhood Protocol** | Clinical guideline | Danger signs, referral criteria, management protocols | ★★★★★ The authoritative reference for pregnancy danger signs in Ghana. Our rule-based engine is directly derived from this. | Ghana Health Service |

### 3.2 Regional/Africa Datasets (SECONDARY)

| Dataset | Size | Format | Relevance | License |
|---------|------|--------|-----------|---------|
| **IDinsight/maternal-health-urgency** | 12.8k messages | Text → Urgent/Not-Urgent | ★★★★ Built from MomConnect (South Africa). Closest publicly available maternal health text urgency dataset. Good for transfer learning to Ghana context. | MIT |
| **Africa Synthetic Maternal Health** (HuggingFace) | 30k rows | Tabular (BP, glucose, Hb) | ★★ Structured vitals, not conversational. But has 3 SSA burden scenarios including HIV prevalence relevant to Ghana. Good for understanding risk factor weights. | CC-BY-4.0 |
| **Mobile WACh NEO (Kenya)** | 220k SMS (11k labeled) | SMS → urgency | ★★★ Real multilingual SMS from pregnant women in East Africa. Proves conversational triage works in African LMIC context. Not downloadable (contact researchers). | Research |

### 3.3 General Medical/Symptom NLP (SUPPLEMENTARY)

| Dataset | Size | Format | Relevance | License |
|---------|------|--------|-----------|---------|
| **Gretel/symptom_to_diagnosis** | 1,065 samples | Symptom text → 22 diagnoses | ★★★ Natural language symptom descriptions → diagnosis. Good for symptom extraction pre-training. | Apache 2.0 |

### 3.4 Post-Loss / Mental Health Text

| Dataset | Size | Format | Relevance | License |
|---------|------|--------|-----------|---------|
| **ourafla/Mental-Health-Text-Classification** | 48,945 samples | Text → Suicidal/Depression/Anxiety/Normal | ★★★★★ 4-class mental health from text. Maps directly to post-loss emotional risk classification. | CC-BY-4.0 |
| **NT-Grief** (I2C-UHU) | 2,000 tweets | Tweet → Grief/No-Grief | ★★★ Binary grief detection. Small but focused on non-traumatic grief. Tweet IDs only (need hydration). | Research |
| **MentalChat16K** (PennShenLab) | 16k conversations | Mental health counseling conversations | ★★★★ Conversational format — closer to voice call transcripts than social media posts. | Research |

### 3.5 Ghana-Specific Research Papers (Evidence Base)

| Paper | Key Finding | Relevance |
|-------|-------------|-----------|
| **Singh et al. 2019** — "Referral patterns through the lens of health facility readiness to manage obstetric complications: national facility-based results from Ghana" | Top referral indications: prolonged/obstructed labor, antepartum hemorrhage. District hospitals resolve 2/3 of complications. Facility readiness only 40% in hospitals, 10% in lower-level. | Validates our referral chain model. Confirms HIGH risk must trigger referral to district hospital level. |
| **Aborigo et al.** — "Obstetric Danger Signs and Factors Affecting Health Seeking Behaviour among the Kassena-Nankani of Northern Ghana" | Women recognize bleeding as danger but delay seeking care due to distance, cost, cultural beliefs. | Our voice agent must ask explicitly about danger signs — mothers may not self-report them. |
| **Volta Region Study** — "Prevalence and Correlates of Prenatal Depression, Anxiety and Suicidal Behaviours" (IJERPH 2021) | 20.4% prenatal depression, 26.2% anxiety, 5.4% suicidal ideation among pregnant women in Volta Region. | Confirms high baseline mental health burden — our post-loss model must screen aggressively. |
| **Ayele et al.** — Postpartum depression at Tamale Teaching Hospital | ~15% postpartum depression prevalence in northern Ghana | Baseline for post-loss emotional risk scoring. |
| **"They Say I Should Not Think About It"** — Qualitative study on infant loss in Kumasi, Ghana | Bereaved mothers face stigma, isolation, pressure to conceive again quickly. Healthcare workers provide little emotional follow-up. | Validates the need for post-loss pathway. Mothers won't self-identify as needing help — the system must proactively screen. |
| **"The Health Caregivers Did Not Care about Me after the Loss"** — Perinatal loss in Kumasi Metro | Mothers report abandonment by the health system after perinatal loss. No follow-up care. | Our post-loss pathway fills a documented gap in Ghana's health system. |

---

## 4. Ghana-Specific Danger Signs (Rule Basis)

### 4.1 Pregnancy Danger Signs — Ghana National Safe Motherhood Protocol

From the official Ghana Health Service protocol, every health worker from CHO to specialist must recognize these:

**IMMEDIATE REFERRAL (HIGH Risk):**
```
- Vaginal bleeding (any amount, any stage)
- Severe headache with blurred vision (pre-eclampsia sign)
- Convulsions/fits (eclampsia)
- Severe abdominal pain
- Fever >38.5°C
- Reduced or absent fetal movements (after quickening)
- Premature rupture of membranes (before 37 weeks)
- Severe vomiting — unable to eat or drink
- Swelling of face, hands, or feet (not just ankles)
- Pale conjunctiva, tongue, palms, nail-beds (severe anaemia)
- Offensive or discoloured vaginal discharge (infection/sepsis)
```

**MONITOR CLOSER (MEDIUM Risk):**
```
- Persistent mild-moderate headache
- Nausea/vomiting beyond 1st trimester (not severe)
- Mild fever (37.5–38.5°C)
- Mild swelling (ankles only, not face/hands)
- Burning on urination (UTI)
- Foul-smelling discharge (mild)
- Breathlessness at rest
- Decreased fetal movements (not absent)
```

**NORMAL PREGNANCY (LOW Risk):**
```
- Mild nausea, morning sickness (1st trimester)
- Fatigue
- Backache
- Breast tenderness
- Frequent urination
- Mood changes
- Mild swelling (ankles/feet only)
- Food cravings/aversions
```

### 4.2 Post-Loss Danger Signs — Adapted from Ghana Protocol + Mental Health Literature

**IMMEDIATE REFERRAL (HIGH Risk):**
```
PHYSICAL:
- Heavy bleeding (soaking pad in <1 hour)
- Fever >38°C with foul odor (sepsis sign)
- Severe abdominal pain
- Inability to eat/drink for >24 hours

EMOTIONAL (from Ghana mental health studies — 5.4% suicidal ideation baseline):
- Expressing suicidal thoughts or self-harm ideation
- Complete inability to function (not eating, not sleeping, not caring for other children)
- Severe dissociation (not recognizing people, severe confusion)
```

**MONITOR CLOSER (MEDIUM Risk):**
```
PHYSICAL:
- Prolonged bleeding (>2 weeks)
- Mild fever or chills
- Painful urination
- Foul discharge

EMOTIONAL (20-25% postpartum depression baseline in Ghana):
- Persistent low mood daily (>2 weeks)
- Sleep disturbance (can't sleep or sleeping excessively)
- Social withdrawal (not engaging with family/friends)
- Loss of appetite
- Anxiety attacks or panic
- Excessive guilt or self-blame
- Difficulty bonding with other children
```

**NORMAL GRIEF PROCESSING (LOW Risk):**
```
PHYSICAL:
- Bleeding decreasing
- No fever
- Normal appetite returning

EMOTIONAL:
- Sadness with periods of improvement
- Good days and bad days (normal grief oscillation)
- Still engaging with support system
- Asking about future planning / family planning
- Adequate sleep (or gradually improving)
- Able to discuss the loss
```

---

## 5. Recommended Approach

### Architecture: Two-Stage Pipeline

```
Voice Call Audio
    │
    ▼
[Speech-to-Text] → Raw Transcript (in Twi/Hausa/Ga/English)
    │
    ▼
┌─────────────────────────────────────┐
│  STAGE 1: Symptom Extraction (NER)  │
│  Extract: symptoms, severity,       │
│  duration, emotional state keywords │
│  from free-text transcript          │
│                                     │
│  Training data: Ghana Maternal      │
│  Health Q&A (20k Twi-English +     │
│  20k English + 20k Ga-English)     │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│  STAGE 2: Risk Classification       │
│                                     │
│  If pathway == Pregnancy:           │
│    → Ghana Safe Motherhood Protocol │
│      danger sign rules              │
│                                     │
│  If pathway == Post-Loss:           │
│    → Physical recovery rules +      │
│      Mental health screening rules  │
└─────────────────────────────────────┘
    │
    ▼  Output: { riskLevel, primaryConcern,
│              recommendedActions[],
│              referralNeeded, confidence }
```

### Model Choices (Simple → Complex)

#### Option A: Rule-Based Triage Engine (Fastest to Build, Demo-Quality)

No ML model needed. Clinical rules from Ghana's National Safe Motherhood Protocol.

**Pregnancy rules** (from Section 4.1 above):
```
HIGH   → Any Ghana Protocol danger sign: vaginal bleeding, severe headache + 
         blurred vision, convulsions, severe abdominal pain, fever >38.5°C, 
         reduced/no fetal movement, premature rupture of membranes, 
         severe vomiting, face/hands swelling, severe pallor, 
         offensive/discoloured discharge
MEDIUM → Persistent headache, nausea beyond 1st trimester, mild fever, 
         ankle-only swelling, burning urination, breathlessness at rest
LOW    → Normal pregnancy discomforts: mild nausea, fatigue, backache, 
         breast tenderness, frequent urination, mood changes
```

**Post-Loss rules** (from Section 4.2 above):
```
HIGH   → Suicidal ideation, heavy bleeding, fever + foul odor,
         inability to function/eat/drink, severe dissociation
MEDIUM → Persistent low mood, sleep disturbance, social withdrawal,
         prolonged bleeding, loss of appetite, anxiety attacks
LOW    → Normal grief processing, improving coping, physical recovery 
         on track, engaging with support
```

**Pros:** Zero training data needed, deterministic, explainable, aligns with Ghana clinical protocol.
**Cons:** Cannot generalize beyond written rules, no learning, keyword matching may miss paraphrases.

#### Option B: Fine-tuned Small Language Model (Best Balance)

Fine-tune a small model on Ghana-specific + regional data:

1. **Pregnancy model**: 
   - Train on **Ghana Maternal Health Q&A (Twi-English + English + Ga-English)** — 60k total samples
   - Augment with **IDinsight maternal health urgency** (12.8k) for transfer learning
   - Map Q&A categories to risk levels based on Ghana Protocol danger signs

2. **Post-Loss model**: 
   - Train on **Mental Health Text Classification** (48.9k samples)
   - Map: `Suicidal` → HIGH, `Depression`/`Anxiety` → MEDIUM, `Normal` → LOW
   - Supplement with grief-specific data from **NT-Grief** (2k tweets)

**Pros:** Handles Twi-English code-switching, learns patterns beyond explicit rules, can be trained in hours.
**Cons:** Needs GPU for training, needs careful evaluation on Ghana-specific test set.

#### Option C: LLM Prompt-Based (Fastest to Prototype)

Use an LLM API with Ghana-specific clinical prompt:

```
You are a maternal health triage assistant operating in Ghana, West Africa.
A CHW has completed a voice call with a {pathway} mother.

Transcript: "{transcript}"
Patient context: {gestationWeeks} weeks, language: {language}, zone: {zone}

Using the Ghana National Safe Motherhood Protocol danger signs, assess risk.

Return JSON:
{
  "riskLevel": "LOW" | "MEDIUM" | "HIGH",
  "primaryConcern": "...",
  "recommendedActions": ["..."],
  "referralNeeded": true/false,
  "referralTarget": "CHPS compound" | "Health centre" | "District hospital" | "Teaching hospital",
  "confidence": 0.0-1.0
}
```

**Pros:** Zero training, handles code-mixed Twi/Hausa/Ga/English, extremely flexible.
**Cons:** API dependency, cost per call, latency, requires internet.

---

## 6. Recommendation for Demo

**Start with Option A (Rule-Based), then upgrade to Option B.**

### Phase 1 — Rule-Based Triage (Now)
- Implement Ghana Safe Motherhood Protocol danger sign rules in TypeScript
- Keyword + synonym matching for Twi, Hausa, Ga, English symptom phrases
- Plugs into existing Triage Engine interface from PRD
- Works offline, no API calls, deterministic
- PRD already specified: *"Initially implemented as a rules-based engine. Designed so a real ML model can replace it with zero changes to calling code."*

### Phase 2 — ML Model Training (Parallel Track)
- Download Ghana Maternal Health Q&A datasets (60k total, Twi-English + English + Ga-English)
- Download IDinsight urgency dataset (12.8k maternal health messages)
- Download Mental Health Text Classification (48.9k samples)
- Train two classifiers (pregnancy + post-loss)
- Evaluate on Ghana-specific test set
- Swap into same Triage Engine interface

### Phase 3 — LLM Enhancement (Future)
- Use LLM for symptom extraction from raw transcripts
- Handles code-switching (Twi-English, Ga-English) natively
- Use trained classifiers for risk scoring
- Best of both worlds

---

## 7. Key Datasets to Download Now

| Priority | Dataset | Action |
|----------|---------|--------|
| 1 | Ghana Maternal Health Q&A (Twi-English, 20k) | Kaggle: `ghanaairesnet/ghana-maternal-health-twi-english-q-and-a-dataset` |
| 2 | Ghana Maternal Health Q&A (English, 20k) | Kaggle: `ghanaairesnet/ghana-maternal-health-q-and-a-dataset-english` |
| 3 | Ghana Maternal Health Q&A (Ga-English, 20k) | Kaggle: `ghanaairesnet/ghana-maternal-health-q-and-a-dataset-ga-english` |
| 4 | IDinsight urgency detection (12.8k) | HuggingFace: `IDinsight/urgency_detection_maternal_health_synthetic` |
| 5 | Mental Health Text Classification (48.9k) | HuggingFace: `ourafla/Mental-Health_Text-Classification_Dataset` |
| 6 | Gretel symptom-to-diagnosis (1k) | HuggingFace: `gretelai/symptom_to_diagnosis` |

---

## 8. Triage Engine Interface (From PRD)

Already defined. Both rule-based and ML models must conform to:

```typescript
interface TriageInput {
  patientId: string
  symptoms: string[]      // extracted from transcript
  severity: 'mild' | 'moderate' | 'severe'
  gestationWeeks?: number  // pregnancy pathway
  pathway: 'Pregnancy' | 'Post-Loss'
  history: RiskAssessment[]
}

interface TriageOutput {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  primaryConcern: string
  recommendedActions: string[]
  referralNeeded: boolean
  referralTarget?: string  // 'CHPS compound' | 'Health centre' | 'District hospital' | 'Teaching hospital'
  confidence: number
}
```

---

## 9. References

### Ghana Policy Documents
1. Ghana Health Service. **National Safe Motherhood Protocol (Revised Edition).** Accra: GHS/WHO/UNFPA. Available at: https://platform.who.int/docs/default-source/mca-documents/policy-documents/operational-guidance/GHA-CC-10-02-OPERATIONALGUIDANCE-eng-National-Safe-Motherhood-Protocol.pdf
2. Ghana Health Service. **National Reproductive Health Service Policy & Standards.** 2014.
3. Ghana Health Service. **National Maternal and Newborn Health Quality of Care Strategic Roadmap.** 2018.
4. Ghana Statistical Service & Ghana Health Service. **Ghana Maternal Health Survey 2017.** DHS Program. https://dhsprogram.com/pubs/pdf/FR340/FR340.pdf

### Ghana-Specific Research
5. Singh K et al. "Referral patterns through the lens of health facility readiness to manage obstetric complications: national facility-based results from Ghana." *Reproductive Health* 16:19, 2019. DOI: 10.1186/s12978-019-0684-y
6. Aborigo RA et al. "Obstetric Danger Signs and Factors Affecting Health Seeking Behaviour among the Kassena-Nankani of Northern Ghana." *African Journal of Reproductive Health.*
7. Ayele B et al. "Prevalence and Correlates of Prenatal Depression, Anxiety and Suicidal Behaviours in the Volta Region of Ghana." *IJERPH* 18(11):5857, 2021. DOI: 10.3390/ijerph18115857
8. "They Say I Should Not Think About It: A Qualitative Study Exploring the Experience of Infant Loss for Bereaved Mothers in Kumasi, Ghana." *Omega: Journal of Death and Dying.* DOI: 10.1177/0030222816629165
9. "The Health Caregivers Did Not Care about Me after the Loss: Maternal Experiences of Perinatal Loss in the Kumasi Metropolitan Area, Ghana." *Women's Studies International Forum* 2023.

### Datasets
10. Ghana AIRES Network. **Ghana Maternal Health Q&A Dataset (Twi-English).** Kaggle, 2025.
11. Ghana AIRES Network. **Ghana Maternal Health Q&A Dataset (English).** Kaggle, 2025.
12. Ghana AIRES Network. **Ghana Maternal Health Q&A Dataset (Ga-English).** Kaggle, 2025.
13. IDinsight. **Maternal Health Urgency Detection (Synthetic).** HuggingFace, 2024. MIT License.
14. Mukherjee P. **Mental Health Text Classification Dataset (4-Class).** HuggingFace, 2025. CC-BY-4.0.
15. Mata-Vázquez J et al. **NT-Grief Dataset.** GitHub: I2C-UHU/NT-Grief, 2023.
