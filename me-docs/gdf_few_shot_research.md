# Research: Guideline-Driven Few-Shot Fine-Tuning via SetFit

This document contains our research on **Guideline-Driven Few-Shot Fine-Tuning** (GDF-FT) and explains how we leverage the **SetFit** framework to embed the **Ghana National Safe Motherhood Protocol** directly into model weights.

---

## 1. What is SetFit (Sentence Transformer Fine-Tuning)?

SetFit is a highly efficient framework for few-shot text classification, developed by Hugging Face and Intel. Unlike traditional fine-tuning of transformers (like DistilBERT/BERT) which requires thousands of labeled examples to train a classification head, SetFit uses **contrastive learning** to adapt a Sentence Transformer on very small datasets (as few as 8–16 examples per class).

### The Two-Stage Training Process:

```
STAGE 1: Contrastive Fine-Tuning
[Clinical Anchors] ──> [Generate Pairs] ──> [Triplet/Cosine Loss] ──> [Fine-Tuned Embedder]

STAGE 2: Classification Head Training
[Input Text] ──> [Fine-Tuned Embedder] ──> [Sentence Embeddings] ──> [Logistic Regression] ──> [Risk Level]
```

1.  **Stage 1: Contrastive Fine-Tuning (Sentence Transformer)**
    *   SetFit takes our small clinical anchor examples and generates positive pairs (examples from the same risk level) and negative pairs (examples from different risk levels).
    *   It trains the Sentence Transformer (e.g., `paraphrase-multilingual-MiniLM-L12-v2`) to minimize the distance between positive pairs and maximize the distance between negative pairs in the embedding space.
    *   This forces Twi and English symptom phrases describing the same warning signs (e.g., *"vaginal bleeding"* and *"mogya gu me ho"*) to occupy the exact same coordinate space in the embedding model.

2.  **Stage 2: Classification Head**
    *   Once the sentence embedding model is fine-tuned, the training text is passed through it to generate fixed-dimensional vectors.
    *   A lightweight classification head (typically a Logistic Regression classifier or a support vector machine) is trained on these vectors to predict the final labels: `0` (LOW), `1` (MEDIUM), or `2` (HIGH).

---

## 2. Why GDF-FT via SetFit is Ideal for Our Prototype

1.  **High Multilingual Accuracy**: By using a multilingual base model, the contrastive step bridges the gap between Twi/English code-mixed phrases and clinical concepts without needing a large, custom-translated corpus.
2.  **Clinical Rule Ingestion (Guideline-Driven)**: We construct precise training anchors representing the specific safety thresholds and danger signs in the Safe Motherhood Protocol. The model's weights learn these boundaries directly.
3.  **Low Latency & Offline Execution**: The final model is tiny (~80MB to 120MB) and runs in milliseconds on a single CPU, allowing it to be hosted easily on a cheap server (or even run directly in the browser via WebAssembly/ONNX).

---

## 3. Kaggle Training Code Pipeline

Here is the exact code block to install SetFit and run the training loop in your Kaggle Notebook:

```python
# 1. Install SetFit framework
!pip install -q setfit datasets

import pandas as pd
from datasets import Dataset
from setfit import SetFitModel, Trainer, TrainingArguments

# 2. Define our Guideline Anchors
guideline_anchors = [
    # --- HIGH RISK (2) ---
    {"text": "I am bleeding from my vagina", "label": 2},
    {"text": "mogya gu me ho", "label": 2},
    {"text": "severe headache and blurred vision", "label": 2},
    {"text": "me ti pae me paa na m'ani so repupuw", "label": 2},
    {"text": "she is having fits and convulsions", "label": 2},
    {"text": "severe pain in lower abdomen", "label": 2},
    {"text": "me yam repae me", "label": 2},
    {"text": "I cannot feel the baby moving or kicking", "label": 2},
    {"text": "abofra no ntutu koraa", "label": 2},
    
    # --- MEDIUM RISK (1) ---
    {"text": "persistent mild headache", "label": 1},
    {"text": "swelling in my ankles only", "label": 1},
    {"text": "burning sensation when I pass urine", "label": 1},
    {"text": "shortness of breath when sitting still", "label": 1},
    
    # --- LOW RISK (0) ---
    {"text": "I feel very tired and sleepy", "label": 0},
    {"text": "morning sickness and nausea in first trimester", "label": 0},
    {"text": "mild backache from standing", "label": 0}
]

df_anchors = pd.DataFrame(guideline_anchors)

# 3. Load Multilingual Sentence Transformer Model
model = SetFitModel.from_pretrained(
    "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
    labels=["LOW", "MEDIUM", "HIGH"]
)

# 4. Prepare training dataset
train_dataset = Dataset.from_pandas(df_anchors)

# 5. Define Training Arguments
args = TrainingArguments(
    batch_size=8,
    num_epochs=1,
    body_learning_rate=2e-5,
    head_learning_rate=2e-3
)

# 6. Train the model (takes < 2 minutes on T4 GPU)
trainer = Trainer(
    model=model,
    train_dataset=train_dataset,
    args=args
)

trainer.train()

# 7. Save model
model.save_pretrained("./mamacare-setfit-model")
print("SetFit Model successfully trained and saved!")
```
