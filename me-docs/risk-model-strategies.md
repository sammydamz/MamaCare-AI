# MamaCare AI — Risk Model Strategy Comparison

> **Date:** May 31, 2026
> **Constraint:** Budget ≤ $10 USD, limited compute (consumer laptop, no GPU)
> **Need:** Two text classifiers (Pregnancy + Post-Loss), conversational input, LOW/MEDIUM/HIGH output

---

## Strategy Overview

| # | Strategy | Training Cost | Inference Cost | Compute Needed | Accuracy | Best For |
|---|----------|--------------|----------------|----------------|----------|----------|
| 1 | Keyword + Scoring Rules | **$0** | **$0** | None (runs in browser) | ★★☆☆☆ | Demo / MVP |
| 2 | TF-IDF + Logistic Regression | **$0** | **$0** | CPU (trains in seconds) | ★★★☆☆ | Lightweight production |
| 3 | FastText Classifier | **$0** | **$0** | CPU (trains in minutes) | ★★★☆☆ | Multilingual / fast |
| 4 | Sentence-Transformer Embeddings + KNN | **$0** | **$0** | CPU (no training, download model) | ★★★★☆ | Few-shot, zero-config |
| 5 | SetFit (Few-Shot Fine-Tune) | **$0** | **$0** | CPU or free Colab (10 min) | ★★★★☆ | Best accuracy/CPU ratio |
| 6 | DistilBERT Fine-Tune (Colab Free T4) | **$0** | **$0** | Colab T4 GPU (free, 30 min) | ★★★★★ | Best accuracy overall |
| 7 | Gemma-2-2b QLoRA (Colab Free T4) | **$0** | **$0** | Colab T4 GPU (free, 1-2 hrs) | ★★★★★ | Handles code-mixed Twi |
| 8 | Zero-Shot BART-MNLI | **$0** | **$0** | CPU (no training, download 400MB) | ★★★☆☆ | No training data needed |
| 9 | Gemini Flash API | **$0** (free tier) | **$0** (1,500 req/day) | None (API call) | ★★★★★ | Instant, no training |
| 10 | OpenRouter Free Models | **$0** | **$0** (unlimited) | None (API call) | ★★★★★ | Instant, no training |

---

## Detailed Strategy Breakdown

---

### Strategy 1: Keyword + Scoring Rules (Pure TypeScript)

**How it works:** Hard-coded keyword matching against Ghana Safe Motherhood Protocol danger signs. Each keyword has a weight. Sum weights → risk level.

```
"bleeding" → +30 points
"severe headache" → +25 points
"can't feel baby move" → +30 points
"mild headache" → +10 points
"tired" → +3 points

Score ≥ 25 → HIGH
Score 10-24 → MEDIUM
Score < 10 → LOW
```

**Pros:**
- $0 cost, zero compute, runs in browser/Node
- Instant, no model download, no API
- Deterministic and explainable (clinical audit trail)
- Works offline
- Aligns exactly with Ghana clinical protocol

**Cons:**
- Cannot handle paraphrases ("my eyes went dark" = blurred vision?)
- No learning, no generalization
- Misses Twi/Hausa expressions unless manually added
- Brittle — needs constant keyword updates

**Cost:** $0
**Time to build:** 2-3 hours
**Verdict:** Must-have as baseline/fallback. Every other strategy should beat this.

---

### Strategy 2: TF-IDF + Logistic Regression / SVM

**How it works:** Vectorize text using TF-IDF n-grams. Train a linear classifier (sklearn LogisticRegression or SVM) on labeled data.

**Pipeline:**
```
Ghana Q&A dataset (20k) + IDinsight (12.8k)
    → Label: map categories to LOW/MEDIUM/HIGH
    → TF-IDF vectorizer (unigrams + bigrams)
    → LogisticRegression (multinomial)
    → Export as JSON weights → run in JS
```

**Pros:**
- $0 cost, trains in seconds on any CPU
- Model is tiny (vocabulary × 3 weights ≈ few hundred KB)
- Can be exported to JavaScript (no Python needed at inference)
- Handles paraphrases better than keywords (learned patterns)
- FastText version supports subword features (handles Twi-English code-mixing)

**Cons:**
- Bag-of-words ignores word order ("no bleeding" vs "bleeding" problem)
- Limited understanding of context
- Needs labeled data

**Cost:** $0
**Time to build:** 4-6 hours (including data prep)
**Verdict:** Strong baseline. Easy to deploy in browser. Good enough for demo.

---

### Strategy 3: FastText Classifier

**How it works:** Facebook's FastText — learns word embeddings + trains a linear classifier. Supports subword features (character n-grams), which means it handles misspellings and code-mixed languages (Twi-English, Ga-English) naturally.

**Pipeline:**
```bash
pip install fasttext
# Train on labeled Ghana Q&A data
fasttext supervised train.txt -model pregnancy_risk -epoch 50 -lr 0.5 -wordNgrams 2
# Model file: ~5MB
# Inference: <1ms per text
```

**Pros:**
- $0 cost, trains in minutes on CPU
- Subword features handle Twi/Hausa/Ga code-mixing without preprocessing
- Pre-trained multilingual vectors available (includes African languages)
- Model is tiny (~5MB), can run anywhere
- Proven for low-resource African languages

**Cons:**
- Still a linear classifier on embeddings
- Less accurate than transformer-based approaches
- No sentence-level understanding

**Cost:** $0
**Time to build:** 4-6 hours
**Verdict:** Excellent for multilingual scenarios. Best "lightweight" option for Twi-English.

---

### Strategy 4: Sentence-Transformer Embeddings + KNN / Cosine Similarity

**How it works:** Use a pre-trained sentence-transformer (e.g., `all-MiniLM-L6-v2`, 80MB) to embed both the input text and reference examples. Classify by finding the nearest neighbor.

**Pipeline:**
```python
from sentence_transformers import SentenceTransformer
model = SentenceTransformer('all-MiniLM-L6-v2')

# Pre-compute embeddings for labeled examples
HIGH_examples = ["I am bleeding heavily", "my head is killing me and I can't see", ...]
MED_examples = ["I have a mild headache", ...]
LOW_examples = ["I feel tired but okay", ...]

# At inference: embed input → cosine similarity to each class → pick highest
```

**Pros:**
- $0 cost, no training at all — just download an 80MB model
- Runs on CPU, ~20ms inference
- Understands semantic similarity ("my eyes went dark" ≈ "blurred vision")
- Works with any language the embedding model supports
- Can run in browser via transformers.js

**Cons:**
- Quality depends on the pre-trained model's language coverage
- May not handle Twi-English code-mixing well
- No fine-tuning to our specific domain

**Cost:** $0
**Time to build:** 3-4 hours
**Verdict:** Great "zero training" option. Good for prototyping, can upgrade to SetFit later.

---

### Strategy 5: SetFit — Few-Shot Fine-Tuning (★★★★ RECOMMENDED)

**How it works:** Hugging Face's SetFit (Sentence Transformer Fine-Tuning). Takes as few as 8 labeled examples per class and fine-tunes a sentence-transformer. Trains on CPU in minutes.

**Pipeline:**
```python
from setfit import SetFitModel, Trainer, TrainingArguments

# Only need ~50-100 labeled examples per pathway!
train_data = [
    {"text": "I am bleeding from my vagina", "label": 2},  # HIGH
    {"text": "my head is paining me and my eyes are dark", "label": 2},  # HIGH
    {"text": "I have a small headache", "label": 1},  # MEDIUM
    {"text": "I feel fine, just tired", "label": 0},  # LOW
    ...  # ~50-100 examples
]

model = SetFitModel.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
trainer = Trainer(model=model, train_dataset=train_data)
trainer.train()  # 2-5 minutes on CPU!

# Export to ONNX for browser deployment
model.save_pretrained("./mamacare-pregnancy-risk")
```

**Pros:**
- $0 cost, trains on CPU in 2-5 minutes
- Only needs 50-100 labeled examples (we can hand-label these from Ghana Q&A dataset)
- Beats zero-shot BART by 10-20% accuracy in benchmarks
- Model is small (~80MB), deployable in browser via transformers.js
- Can upgrade base model to multilingual (e.g., `paraphrase-multilingual-MiniLM-L12-v2` for Twi/Hausa)

**Cons:**
- Needs some labeled examples (but very few)
- Less accurate than full BERT fine-tune
- Multilingual base model is larger (~120MB)

**Cost:** $0
**Time to build:** 6-8 hours (including labeling 100 examples)
**Verdict:** **Best bang for zero buck.** Few-shot, CPU-trainable, deployable in browser. This is the sweet spot.

---

### Strategy 6: DistilBERT Fine-Tune (Colab Free T4 GPU)

**How it works:** Fine-tune DistilBERT (66M params, 255MB) on the full Ghana Q&A + IDinsight dataset using Google Colab's free T4 GPU.

**Pipeline:**
```
1. Upload labeled dataset to Google Colab
2. Fine-tune DistilBERT for 3-5 epochs (~20-30 min on T4)
3. Export model to ONNX
4. Serve via transformers.js in browser, or Flask API
```

**Pros:**
- $0 (Colab free tier: T4 GPU, ~4 hrs/day)
- State-of-the-art accuracy for text classification
- Handles complex language patterns
- Large community, well-documented

**Cons:**
- Colab free tier has time limits and queue times
- Model is 255MB — large for browser deployment
- Needs labeled dataset (~1000+ examples for good results)
- Cannot run on CPU at training time

**Cost:** $0 (Colab free)
**Time to build:** 1 day (data prep + training + export)
**Verdict:** Best accuracy if you can use Colab. Good "upgrade path" from SetFit.

---

### Strategy 7: Gemma-2-2b QLoRA Fine-Tune (Colab Free T4)

**How it works:** Fine-tune Google's Gemma-2-2b (2 billion params) using QLoRA (quantized low-rank adaptation) — fits on Colab's free T4. The IDinsight team already trained `gemma-2-2b-it-ud` on their maternal health urgency dataset!

**Pipeline:**
```
1. Start with IDinsight's pre-trained gemma-2-2b-it-ud (already trained on maternal health)
2. Further fine-tune on Ghana Q&A dataset using QLoRA
3. Quantize to 4-bit → ~1.4GB model
4. Serve via Ollama, or API, or cloud function
```

**Pros:**
- Starts from a model already trained on maternal health urgency
- QLoRA adapts to Ghana-specific language patterns
- Gemma supports 140+ languages including African languages
- Can be served via free tier (OpenRouter, or local Ollama)

**Cons:**
- 1.4GB model — too large for browser, needs server
- Colab free T4 might be tight for 2B model (need careful memory management)
- More complex setup than simpler approaches

**Cost:** $0 (Colab free)
**Time to build:** 2-3 days
**Verdict:** Best for production, overkill for demo. Consider for Phase 2.

---

### Strategy 8: Zero-Shot BART-MNLI

**How it works:** Use Facebook's BART-large-MNLI (400MB) — a model trained on natural language inference. Give it text + candidate labels, it scores how well each label matches. Zero training required.

**Pipeline:**
```python
from transformers import pipeline
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

result = classifier(
    "I am bleeding and my head is paining me badly",
    candidate_labels=["high risk emergency", "moderate concern", "normal pregnancy"],
)
# → ["high risk emergency": 0.89, "moderate concern": 0.08, "normal pregnancy": 0.03]
```

**Pros:**
- $0 cost, zero training, zero labeled data
- Works immediately on any text
- Understands semantic meaning
- Can change labels at inference time (no retraining)

**Cons:**
- 400MB model download
- ~100ms inference on CPU (slow compared to others)
- Less accurate than fine-tuned models
- May struggle with code-mixed Twi-English

**Cost:** $0
**Time to build:** 2-3 hours
**Verdict:** Great for testing/prototyping the concept. Not ideal for production.

---

### Strategy 9: Gemini Flash API (Free Tier) (★★★★★ BEST FOR DEMO)

**How it works:** Call Google's Gemini 2.0 Flash API with a structured prompt. Returns JSON risk assessment. No training, no model, just an API call.

**Free tier limits:**
- **1,500 requests per day** (enough for demo + testing)
- 15 requests per minute
- No credit card needed
- Structured JSON output supported

**Pipeline:**
```
Transcript → Gemini Flash API with clinical prompt → JSON { riskLevel, concern, actions }
```

**Pros:**
- $0 (free tier is generous for a demo)
- No training, no data prep, no model download
- Best accuracy — handles Twi, Hausa, Ga, English natively
- Returns structured JSON (directly compatible with TriageOutput interface)
- Understands medical context, code-switching, cultural nuances
- Can explain reasoning in the response

**Cons:**
- Requires internet connection
- 1,500 req/day cap (won't scale to production)
- API dependency (Google could change terms)
- ~200-500ms latency per call
- Cannot run offline

**Cost:** $0
**Time to build:** 1-2 hours
**Verdict:** **Best for demo.** Zero effort, best accuracy, handles all languages. Can always swap to a local model later.

---

### Strategy 10: OpenRouter Free Models

**How it works:** OpenRouter provides free API access to many models (Gemma 4 31B, DeepSeek V4 Flash, etc.). Same approach as Gemini — API call with clinical prompt.

**Free tier:**
- No rate limits listed for free models
- Multiple model options (pick the best one)
- OpenAI-compatible API

**Pros:**
- $0, multiple model choices
- Fallback if Gemini rate-limits hit
- Some models support 1M+ token context

**Cons:**
- "Free" models may change or be rate-limited
- Provider may log prompts
- Variable latency
- Same API dependency issues as Gemini

**Cost:** $0
**Time to build:** 1-2 hours
**Verdict:** Good backup for Gemini. Same pros/cons, more model options.

---

## Cost Comparison

| Strategy | Training | Inference (per call) | Total for Demo (500 calls) |
|----------|----------|---------------------|---------------------------|
| 1. Keywords | $0 | $0 | **$0** |
| 2. TF-IDF | $0 | $0 | **$0** |
| 3. FastText | $0 | $0 | **$0** |
| 4. Embeddings+KNN | $0 | $0 | **$0** |
| 5. SetFit | $0 | $0 | **$0** |
| 6. DistilBERT (Colab) | $0 | $0 | **$0** |
| 7. Gemma QLoRA (Colab) | $0 | $0 | **$0** |
| 8. BART-MNLI | $0 | $0 | **$0** |
| 9. Gemini Flash API | $0 | $0 (free tier) | **$0** |
| 10. OpenRouter | $0 | $0 | **$0** |

**All strategies are $0.** The $10 budget is a safety margin for unexpected costs (Colab Pro if needed, API overages).

---

## Recommendation: Layered Approach

Don't pick one. **Stack them.**

```
┌──────────────────────────────────────────────────┐
│  LAYER 1: Rule-Based Keyword Engine (Strategy 1) │
│  Always runs. Catches obvious danger signs.       │
│  $0, offline, instant.                            │
│  If HIGH detected → skip to output immediately    │
└──────────────────────────┬───────────────────────┘
                           │
              If ambiguous or no match:
                           │
                           ▼
┌──────────────────────────────────────────────────┐
│  LAYER 2: SetFit Classifier (Strategy 5)         │
│  Runs locally. 50 labeled examples. ~20ms.       │
│  Catches paraphrases the keyword engine misses.   │
│  Returns LOW/MEDIUM/HIGH with confidence score.   │
└──────────────────────────┬───────────────────────┘
                           │
              If confidence < 0.6 (uncertain):
                           │
                           ▼
┌──────────────────────────────────────────────────┐
│  LAYER 3: Gemini Flash API (Strategy 9)          │
│  Fallback for low-confidence cases.              │
│  Best accuracy, handles all languages.            │
│  Free tier: 1,500 calls/day (only used for       │
│  uncertain cases, so ~100-200/day max)            │
└──────────────────────────────────────────────────┘
```

**Why this works:**
- **90% of calls** → resolved by Layer 1 (keyword match) — $0, instant, offline
- **8% of calls** → resolved by Layer 2 (SetFit) — $0, 20ms, local
- **2% of calls** → escalated to Layer 3 (Gemini) — $0, ~500ms, online
- Total cost: **$0**
- Total training time: **1 day** (label 100 examples + run SetFit on CPU)
- Works offline for most cases (Layer 1 + 2)

---

## Implementation Plan

### Step 1: Build Layer 1 — Keyword Engine (2-3 hrs)
- TypeScript, runs in browser
- Ghana Safe Motherhood Protocol danger signs
- Scoring system: keyword → weight → risk level
- No dependencies

### Step 2: Label 100 Examples (3-4 hrs)
- Take 100 Q&A pairs from Ghana Maternal Health dataset
- Hand-label: LOW (0), MEDIUM (1), HIGH (2)
- Split: 50 pregnancy, 50 post-loss
- Save as CSV

### Step 3: Train SetFit — Layer 2 (1-2 hrs)
- `pip install setfit`
- Train on 100 labeled examples on CPU
- Export to ONNX
- Integrate into MamaCare via transformers.js or Python microservice

### Step 4: Wire Gemini Flash — Layer 3 (1-2 hrs)
- Get free Gemini API key
- Write clinical prompt with Ghana protocol context
- Call from backend, return structured TriageOutput
- Only triggered when Layer 2 confidence < 0.6

### Step 5: Integrate into Triage Engine (2-3 hrs)
- All 3 layers behind the same `TriageEngine` interface from PRD
- Input: `{ patientId, symptoms, severity, gestationWeeks, pathway, history }`
- Output: `{ riskLevel, primaryConcern, recommendedActions, referralNeeded, confidence }`
- Frontend calls one function, doesn't know which layer ran

**Total time: ~1.5 days**
**Total cost: $0**
