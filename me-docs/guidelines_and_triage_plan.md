# MamaCare AI — Clinical Guidelines & Triage Implementation Plan

This plan adapts the methodology described by IDinsight (using clinical guidelines to define triage criteria, using LLMs to generate or map synthetic/real training data, and training a lightweight classifier) to the **Ghanaian maternal care context** using **NotebookLM** and our local codebase.

---

## 1. Methodology: Adapting the IDinsight Approach

IDinsight’s approach to maternal triage involved:
1.  **Clinical Reference Protocols**: Using standard maternal health protocols (like South Africa's MomConnect or WHO guidelines) to establish clear triage categories.
2.  **Multilingual Urgency Classification**: Mapping user messages in local dialects and languages (Twi, Fante, Ga, Ewe, English) into distinct risk categories.
3.  **Model Training & Serving**: Fine-tuning a low-parameter model on these categorized messages and serving it via a lightweight API.

For MamaCare AI, we will map guidelines from `prenatal.pdf` specifically to the **Ghana Health Service (GHS) Safe Motherhood Protocols** and the **CHPS (Community Health Planning and Services)** framework.

---

## 2. Step-by-Step Implementation Roadmap

```
[Step 1: NotebookLM] ────────> [Step 2: Rule Mapping] ────────> [Step 3: Dataset Prep]
  Extract rules from              Define JSON schemas             Align Q&A and IDinsight
  prenatal.pdf                    for triage scoring              datasets with guidelines
                                                                             │
                                                                             ▼
[Step 6: UI Testing] <──────── [Step 5: Express Proxy] <─────── [Step 4: Colab Training]
  Integrate simulator            Wire /api/consult to             Train and export the
  modal on profile               the inference server             DistilBERT classifier
```

### Step 1: Guideline Extraction via NotebookLM
*   **Action**: Use Google NotebookLM on [prenatal.pdf](file:///C:/Comp/prenatal.pdf) (without reading it directly in this agent workspace) to extract:
    1.  **HIGH Risk Danger Signs**: Conditions requiring immediate emergency referral (e.g., vaginal bleeding, severe headache with blurred vision, fits/convulsions, severe abdominal pain).
    2.  **MEDIUM Risk Warning Signs**: Conditions requiring outpatient clinic follow-up or closer monitoring (e.g., persistent mild headache, burning on urination, ankle-only swelling).
    3.  **LOW Risk Symptoms**: Normal pregnancy discomforts (e.g., mild morning sickness in 1st trimester, backache, fatigue).
    4.  **Mental Health & Bereavement Indicators**: Post-loss coping signs and danger limits.

### Step 2: Define the Rule-Based Triage Map
*   We will represent these guidelines as a JSON rules map in our backend codebase (`server/triage-rules.json` or within a helper utility).
*   This ensures that any symptom keyword matches immediately resolve to the correct risk level deterministically before hitting the ML classifier (providing a safety fall-through).

### Step 3: Dataset Preparation & Label Alignment
*   Align the **Ghana Maternal Health Q&A (Twi-English)** and **IDinsight Urgency** datasets to map their labels (urgent vs. non-urgent, specific symptom tags) to our target classification categories:
    *   `0`: LOW Risk (Routine check-in, advice, general info)
    *   `1`: MEDIUM Risk (Closer monitoring, outpatient visit)
    *   `2`: HIGH Risk (Immediate emergency referral to Health Centre or District Hospital)

### Step 4: Model Training in Google Colab
*   Write and run the Colab training script to fine-tune `DistilBERT` (or `SetFit`) on the combined dataset.
*   Save the model state and run a FastAPI microservice on Hugging Face Spaces or Render to serve predictions.

### Step 5: Express Backend Proxy Integration
*   Implement `POST /api/consult` in [server/index.ts](file:///C:/Comp/server/index.ts) to forward symptoms to the hosted model.
*   Write logic to update the patient's record (`risk_level`, `vitals`, `risk_history`) and automatically create a `referrals` entry when a `HIGH` risk level is returned.

### Step 6: Frontend Call Simulator Interface
*   Add a simulator modal to the Patient Profile page enabling clinicians to trigger simulated AI calls with predefined Twi, Ga, or English dialogue presets.
