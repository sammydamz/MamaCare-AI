# MamaCare AI — Dataset & Model Training Progress Tracker

This document tracks our datasets, training status, and integration progress for the MamaCare AI risk classification models.

---

## 1. Final Labeled Dataset Inventory

For the prototype, we are using the following finalized set of datasets.

### A. Pregnancy Pathway Datasets (Symptom & Urgency Classification)

| Dataset | Size | Purpose | Source | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Ghana Maternal Health Q&A (Twi-English)** | 20,000 pairs | Training model to handle code-mixed Twi-English symptom reports. | Kaggle: `ghanaairesnet/ghana-maternal-health-twi-english-q-and-a-dataset` | ⏳ Pending download to Colab |
| **IDinsight Maternal Health Urgency** | 12,800 cases | Transfer learning for binary urgency classification (Urgent vs. Non-Urgent). | Hugging Face: `IDinsight/urgency_detection_maternal_health_synthetic` | ⏳ Pending load in Colab |

### B. Post-Loss Pathway Datasets (Mental Health & Bereavement)

| Dataset | Size | Purpose | Source | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Mental Health Text Classification** | 48,945 samples | Classifying emotional distress levels (Suicidal/Depression/Anxiety vs. Normal). | Hugging Face: `ourafla/Mental-Health-Text-Classification` | ⏳ Pending load in Colab |
| **NT-Grief Dataset** | 2,000 samples | Fine-tuning the model specifically for grief-oriented language patterns. | GitHub: `I2C-UHU/NT-Grief` | ⏳ Pending load in Colab |

---

## 2. Progress Checklist

- [ ] Download and prepare the 4 final datasets in Google Colab
- [ ] Map dataset target classes to `LOW` / `MEDIUM` / `HIGH` risk based on Ghana Safe Motherhood guidelines
- [ ] Train the **Pregnancy Care** classification model (DistilBERT/SetFit on Twi-English + IDinsight)
- [ ] Train the **Post-Loss / Grief** classification model (DistilBERT/SetFit on Mental Health + NT-Grief)
- [ ] Export both trained models to Hugging Face or save weights in Google Drive
- [ ] Build FastAPI microservice wrapper (`app.py`) for inference
- [ ] Deploy the microservice (on Hugging Face Spaces or Render)
- [ ] Implement proxy `/api/consult` route in the local Express backend
- [ ] Test end-to-end integration with the React UI
