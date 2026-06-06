# Kaggle Notebook: Transformers Trainer Training & Hugging Face Deployment Pipeline

This document contains the exact code cells to copy and run in your Kaggle Notebook to train your maternal triage model using standard Hugging Face `Trainer` (with oversampled anchors) and deploy it to Hugging Face for free.

---

### **Cell 1: Environment Installation**
Installs the required Hugging Face and PyTorch-related libraries.
```python
# Install the required Hugging Face libraries
!pip install -q transformers datasets accelerate
print("Libraries installed successfully!")
```

---

### **Cell 2: Ingest and Prepare Few-Shot Anchors**
Loads your custom `triage_anchors.json` dataset containing the guidelines extracted from the PDF and oversamples it so standard sequence classification works effectively.

*Note: In your Kaggle Notebook, click the **"Upload"** button in the file explorer (on the right) to upload your local `triage_anchors.json` file to the workspace.*

```python
import json
import pandas as pd
from datasets import Dataset

# 1. Load your uploaded triage_anchors.json from Kaggle input path
print("Loading custom triage anchors...")
with open("/kaggle/input/triage-anchor-maternal/triage_anchors.json", "r", encoding="utf-8") as f:
    anchors_data = json.load(f)

# 2. Create DataFrame and keep only text and label columns
df = pd.DataFrame(anchors_data)
df = df[['text', 'label']]

# 3. Oversample the anchors to help standard Trainer learn efficiently
df_oversampled = pd.concat([df] * 10, ignore_index=True)

print(f"\nOriginal Dataset Size: {len(df)} rows")
print(f"Oversampled Dataset Size: {len(df_oversampled)} rows")
print(df_oversampled['label'].value_counts())
```

---

### **Cell 3: Tokenization & Loading the Multilingual Model**
Loads the pre-trained `distilbert-base-multilingual-cased` tokenizer and model, and tokenizes the dataset.

```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification

model_checkpoint = "distilbert-base-multilingual-cased"
print(f"Loading tokenizer and model for {model_checkpoint}...")

tokenizer = AutoTokenizer.from_pretrained(model_checkpoint)

def tokenize_function(examples):
    return tokenizer(examples["text"], truncation=True, padding="max_length", max_length=128)

# Convert pandas DataFrame to Hugging Face Dataset and tokenize
dataset = Dataset.from_pandas(df_oversampled)
tokenized_dataset = dataset.map(tokenize_function, batched=True)
tokenized_dataset = tokenized_dataset.shuffle(seed=42)

# Load sequence classification model (3 classes: 0=LOW, 1=MEDIUM, 2=HIGH)
model = AutoModelForSequenceClassification.from_pretrained(model_checkpoint, num_labels=3)
```

---

### **Cell 4: Run Training**
Sets up training arguments and executes the fine-tuning loop using the standard Hugging Face `Trainer`.

```python
from transformers import Trainer, TrainingArguments

training_args = TrainingArguments(
    output_dir="./results",
    learning_rate=2e-5,
    per_device_train_batch_size=8,
    num_train_epochs=3,
    weight_decay=0.01,
    logging_steps=10,
    evaluation_strategy="no",
    report_to="none"
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset,
)

print("Starting model training...")
trainer.train()
print("Training completed!")
```

---

### **Cell 5: Test Model Predictions**
Runs manual tests on the trained model.

```python
import torch

# Test predictions
test_phrases = [
    "I am bleeding heavily since this morning",
    "I feel fine, just a bit tired",
    "I have a mild headache but my vision is normal",
    "My feet and hands are swollen and I cannot see clearly",
    "I am fine no issues"
]

model.eval()
labels_map = {0: "LOW", 1: "MEDIUM", 2: "HIGH"}

print("\n--- Test Predictions ---")
for phrase in test_phrases:
    inputs = tokenizer(phrase, return_tensors="pt", truncation=True, padding=True).to(model.device)
    with torch.no_grad():
        outputs = model(**inputs)
        prediction = torch.argmax(outputs.logits, dim=-1).item()
    print(f"Text: '{phrase}' -> Predicted Risk: {labels_map[prediction]}")
```
```

---

### **Cell 6: Push Model to Hugging Face Hub**
Logs in to your Hugging Face account and uploads the model weights and tokenizer.

```python
from huggingface_hub import notebook_login
# This will prompt you to enter your Hugging Face Access Token (Write permission required)
notebook_login()

# Save tokenizer and model locally
model.save_pretrained("./mamacare-triage-model")
tokenizer.save_pretrained("./mamacare-triage-model")

# Push to Hugging Face Hub (Replace "sammydamz" with your actual HF username)
model.push_to_hub("sammydamz/mamacare-triage-model")
tokenizer.push_to_hub("sammydamz/mamacare-triage-model")
print("Model successfully uploaded to Hugging Face Hub!")
```

---

### **Cell 7: Automated Model Evaluation**
Loads the evaluation test dataset and computes standard metrics (Accuracy, Precision, Recall, F1-Score) to ensure the model has learned the guidelines correctly.

*Note: Upload your local `triage_test_data.json` file to the same Kaggle input/working directory so the notebook can load it.*

```python
import json
import torch
from sklearn.metrics import classification_report, accuracy_score

# 1. Load evaluation test data from Kaggle input path
print("Loading evaluation test data...")
with open("/kaggle/input/triage-anchor-maternal/triage_test_data.json", "r", encoding="utf-8") as f:
    test_data = json.load(f)

test_texts = [item["text"] for item in test_data]
true_labels = [item["expected_label"] for item in test_data]
labels_map = {0: "LOW", 1: "MEDIUM", 2: "HIGH"}

# 2. Run predictions
predicted_labels = []
model.eval()

print("Running evaluation inference...")
for text in test_texts:
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True).to(model.device)
    with torch.no_grad():
        outputs = model(**inputs)
        pred = torch.argmax(outputs.logits, dim=-1).item()
    predicted_labels.append(pred)

# 3. Calculate and display metrics
accuracy = accuracy_score(true_labels, predicted_labels)
print(f"\nModel Accuracy on Test Set: {accuracy * 100:.2f}%")

print("\n--- Detailed Classification Report ---")
print(classification_report(true_labels, predicted_labels, target_names=["LOW", "MEDIUM", "HIGH"]))
```
```
