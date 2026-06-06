# MamaCare AI — Coupling ML Models with Clinical Guidelines

This document outlines the design and implementation of the **Two-Stage Hybrid Triage Router** used to couple our trained machine learning models (DistilBERT/SetFit) with the clinical guidelines from the Ghana National Safe Motherhood Protocol.

---

## 1. System Architecture

The router acts as the coordinator during inference. It runs a deterministic keyword/regex match first for safety, followed by semantic machine learning classification for nuanced speech.

```
                  Unstructured Voice Transcript
                                │
                                ▼
         ┌──────────────────────────────────────────────┐
         │     Stage 1: Rule-Based Danger Sign Check    │
         │  (Deterministic Regex / Keyword Matcher)     │
         └──────────────────────┬───────────────────────┘
                                │
                    Did it match a HIGH risk sign?
                     ├── YES ──> [Immediately return HIGH Risk] (Safety Fall-through)
                     └── NO
                                │
                                ▼
         ┌──────────────────────────────────────────────┐
         │     Stage 2: DistilBERT Model Inference      │
         │  (Predicts risk level on semantic meaning)   │
         └──────────────────────┬───────────────────────┘
                                │
                                ▼
          Final Output = Max(Rule Risk, Model Risk)
```

### Why this is the best approach:
1. **Clinical Safety (100% Sensitivity for Emergencies)**: If a patient explicitly mentions a danger sign (e.g., bleeding, fits, convulsions), the system immediately flags the case as `HIGH` risk without letting model uncertainty interfere.
2. **Semantic Flexibility**: If the patient uses descriptive or colloquial language (e.g., *"my head is spinning and my eyes are going dark"*), the DistilBERT model maps the semantic meaning to pre-eclampsia risks and raises the appropriate warning.

---

## 2. Python Implementation (`triage_router.py`)

Include the following code in your hosted FastAPI service. It loads the model trained in Colab and couples it with the regex rules representing the guidelines:

```python
import re
import torch
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification

app = FastAPI(title="MamaCare Coupled Triage API")

# Load model and tokenizer
model_path = "./mamacare-risk-model"
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForSequenceClassification.from_pretrained(model_path)

# Guidelines Rule Map (Keywords mapped directly from prenatal.pdf)
HIGH_RISK_KEYWORDS = [
    # English danger signs
    r"\bbleed(ing)?\b", r"\bfit(s)?\b", r"\bconvulsion(s)?\b", r"\bblurred vision\b", 
    r"\bflashes of light\b", r"\bsevere abdominal pain\b", r"\bno movement\b", r"\bno kick(s)?\b",
    # Twi danger signs
    r"\bmogya\b", r"\bbiri\b", r"\byam repae\b", r"\butubro\b", r"\banisow repupuw\b"
]

class TriageRequest(BaseModel):
    text: str
    pathway: str  # "Pregnancy" or "Post-Loss"

class TriageResponse(BaseModel):
    riskLevel: str
    primaryConcern: str
    confidence: float
    routingMethod: str  # "Deterministic Rules" or "Machine Learning Model"

@app.post("/predict")
def triage_transcript(request: TriageRequest):
    input_text = request.text.lower()
    
    # --- STAGE 1: Deterministic Guideline Check ---
    is_high_risk_by_rules = any(re.search(pattern, input_text) for pattern in HIGH_RISK_KEYWORDS)
    
    if is_high_risk_by_rules:
        return TriageResponse(
            riskLevel="HIGH",
            primaryConcern="Critical obstetric danger sign detected via Safe Motherhood rules.",
            confidence=1.0,
            routingMethod="Deterministic Rules"
        )
    
    # --- STAGE 2: Model Inference ---
    inputs = tokenizer(request.text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.softmax(outputs.logits, dim=1)
        pred_class = torch.argmax(probs, dim=1).item()
        confidence = probs[0][pred_class].item()
    
    # Map prediction index to risk categories
    label_map = {0: "LOW", 1: "MEDIUM", 2: "HIGH"}
    pred_label = label_map[pred_class]
    
    concern_map = {
        "HIGH": "Nuanced/severe symptoms indicating high risk. Midwife review required.",
        "MEDIUM": "Moderate concern detected requiring close monitoring by CHW.",
        "LOW": "Routine check-in; no alert thresholds breached."
    }
    
    return TriageResponse(
        riskLevel=pred_label,
        primaryConcern=concern_map[pred_label],
        confidence=confidence,
        routingMethod="Machine Learning Model"
    )
```
