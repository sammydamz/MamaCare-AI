# MamaCare AI: Guideline-Driven Few-Shot Fine-Tuning Plan

This document details the finalized implementation plan for our risk classification models using **Guideline-Driven Few-Shot Fine-Tuning** (GDF-FT). By merging clinical protocol anchors directly into our training dataset, we embed the rules of the **Ghana National Safe Motherhood Protocol** directly into the model's weights, creating a highly accurate, multilingual, offline-capable triage model.

---

## 1. Research & Theoretical Foundation

### A. The Core Concept (GDF-FT)
In standard fine-tuning, models learn statistical correlations from data, which can result in "hallucinated" classifications or missed edge cases if the training set is noisy. 
Under **Guideline-Driven Few-Shot Fine-Tuning**, we inject **Clinical Anchors**—precise synthetic and real examples written in English and local languages (like Twi) representing each rule in the medical guidelines—directly into the training dataset.

```
┌───────────────────────────┐
│ Ghana Safe Motherhood     │
│ Guidelines (prenatal.pdf) │
└─────────────┬─────────────┘
              │ (Step 1: Extract & Anchor)
              ▼
┌───────────────────────────┐     ┌───────────────────────────┐
│   Clinical Anchor Data    │     │   Ghana Q&A + IDinsight   │
│   (Precise Symptom Pairs) │     │     (Mass Training Data)  │
└─────────────┬─────────────┘     └─────────────┬─────────────┘
              │                                 │
              └───────────────┬─────────────────┘
                              │ (Step 2: Combine & Balance)
                              ▼
               ┌─────────────────────────────┐
               │  Aligned Multilingual Set   │
               └──────────────┬──────────────┘
                              │ (Step 3: Fine-Tune)
                              ▼
               ┌─────────────────────────────┐
               │ distilbert-base-multilingual│
               │ (Embedded Weight Parameters)│
               └─────────────────────────────┘
```

This acts as a structural constraint: the loss function forces the model's multilingual embedding space (`distilbert-base-multilingual-cased`) to cluster similar semantic representations (e.g., *"mogya resen"* and *"vaginal bleeding"*) directly around the clinical anchor weights.

---

## 2. Guideline Anchor Dataset (Extracted from prenatal.pdf)

We map the exact clinical warnings from the GHS Safe Motherhood Protocol into concrete training anchors (labels: `0 = LOW`, `1 = MEDIUM`, `2 = HIGH`):

### A. HIGH RISK (Label: `2` - Immediate Emergency Referral)
*   **Vaginal Bleeding**:
    *   *English*: "I am bleeding heavily from my vagina", "vaginal bleeding during pregnancy", "losing blood from my private part".
    *   *Twi*: "mogya gu me ho", "mogya resen me", "me ho gu mogya".
*   **Severe Pre-Eclampsia / Eclampsia**:
    *   *English*: "severe headache with blurred vision", "flashes of light in eyes and head pain", "swelling in my face and hands".
    *   *Twi*: "me ti pae me paa na m'ani so repupuw", "m'anisow gu biri", "m'anim ne me nsa ahobow".
*   **Fits / Convulsions**:
    *   *English*: "she is having fits and convulsions", "unconscious after a seizure".
    *   *Twi*: "ɔretu afiri", "n'ani abu na ɔnte ne ho".
*   **Severe Abdominal Pain**:
    *   *English*: "severe pain in lower abdomen", "intense cramping in my belly".
    *   *Twi*: "me yam repae me", "yam keka a ɛyɛ ya paa".
*   **Fetal Movement Loss**:
    *   *English*: "I cannot feel the baby moving or kicking", "absent fetal movement for 24 hours".
    *   *Twi*: "abofra no ntutu koraa", "abofra no agyae tutu".
*   **Sepsis / Sepsis Post-Loss**:
    *   *English*: "high fever with foul-smelling discharge", "chills and offensive vaginal odour".
    *   *Twi*: "me ho yɛ hyɛ paa ne nsuo a ɛbɔne".

### B. MEDIUM RISK (Label: `1` - Midwife / CHW Review)
*   **Mild-to-Moderate Symptoms**:
    *   *English*: "persistent mild headache", "swelling in my ankles only", "burning when passing urine", "shortness of breath when sitting".
    *   *Twi*: "me ti pae me kakra", "me nan nko na ahobow", "sɛ me dwonsɔ a ɛyɛ ya", "ntumi nhome yie".

### C. LOW RISK (Label: `0` - Routine Advice)
*   **Normal Pregnancy Discomforts**:
    *   *English*: "mild morning sickness in first trimester", "tired and sleepy all the time", "breast tenderness", "mild backache".
    *   *Twi*: "me bo repupuw me anɔpa", "me brɛ paa na mpe menda", "me yam yɛ mmerɛ".

---

## 3. Data Processing & Pipeline in Kaggle

We execute the following pipeline in your Kaggle Notebook:

1.  **Install & Setup**: Check GPU memory (T4) and install `transformers`, `datasets`, and `accelerate`.
2.  **Anchor Creation**: Define the `guideline_anchors` list in Python and load it as a pandas DataFrame.
3.  **HuggingFace Load**: Ingest `IDinsight/urgency_detection_maternal_health_synthetic`.
4.  **Label Mapping**:
    *   Map IDinsight's `matching_rule` column: any value other than `"No rule matched"` maps to `2` (HIGH), else maps to `0` (LOW).
5.  **Concatenation**: Combine the Guideline Anchors DataFrame with the IDinsight text/label columns.
6.  **Tokenization**: Run the text through the `distilbert-base-multilingual-cased` tokenizer with padding and truncation.
7.  **Training**: Run the Hugging Face `Trainer` loop for 3 epochs with a learning rate of `2e-5` and weight decay `0.01`.
