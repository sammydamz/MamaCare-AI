# MamaCare AI: Multilingual Maternal Triage & Clinical Intelligence Platform

MamaCare AI is an end-to-end, voice-first maternal care and clinical triage system built for maternal healthcare providers and community health workers (CHWs) in Sub-Saharan Africa. The platform keeps pregnant and post-pregnancy loss mothers connected to continuous care via basic mobile voice calls on GSM networks, while providing clinical facilities with real-time risk dashboards, automated notifications, and AI-driven decision support.

---

## Key Innovation: Guideline-Driven Few-Shot Fine-Tuning (GDF-FT)

MamaCare AI leverages a fine-tuned sequence classification model based on **`distilbert-base-multilingual-cased`**. Using **Guideline-Driven Few-Shot Fine-Tuning**, clinical guidelines from the Ghana Health Service **National Safe Motherhood Protocol (Revised Edition)** are injected directly into the model's weights as semantic anchor constraints, aligning local dialect inputs (such as Twi) with standard clinical protocols.

*   **Model Repository**: [sammydamz/mamacare-triage-model on Hugging Face](https://huggingface.co/sammydamz/mamacare-triage-model)
*   **Training Notebook**: `me-docs/mamacare-ai-triage.ipynb`
*   **Model Accuracy**: **66.67%** (0.80 F1-score for high-risk triage, optimized to eliminate false negatives for life-threatening symptoms)

---

## Key System Features

1.  **Voice check-in & Telephony (ElevenLabs)**: Automates outbound calls viaTwilio/GSM, using ElevenLabs multilingual speech-to-text and speech synthesis for warm, empathetic voice assessments in local languages (Twi, Hausa, Swahili, Amharic).
2.  **Patient Monitoring & Analytics**: Tracks maternal risk profiles (LOW, MEDIUM, HIGH) and symptoms (bleeding, pre-eclampsia signs, sepsis indicators).
3.  **Post-Pregnancy Loss Track**: Dedicated support pathway offering compassionate physical recovery tracking and emotional checking for mothers recovering from miscarriage or stillbirth.
4.  **Clinician Dashboard**: Prioritizes patient queues by risk, pushes immediate WebSocket alerts for critical warning signs, and maintains digitized histories.
5.  **PostgreSQL Integration**: Direct data layer syncing with PostgreSQL, optimized for low-bandwidth operations.

---

## Getting Started

### Prerequisites

-   **Node.js** >= 20.20.0
-   **PNPM** (recommended package manager)
-   **PostgreSQL** (local or hosted instance)

### Installation

Install all required dependencies:

```bash
pnpm install
```

### Environment Variables

Configure a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://user:password@host:port/database
PORT=3000
```

### Database Migration and Seed

The application automatically checks the database connection, performs migrations, and seeds the initial localized data on server startup.

### Running the Application

To start the development server (runs both the Vite frontend and Express backend):

```bash
pnpm run dev
```

To build and run in production:

```bash
pnpm run build
pnpm start
```

---

## Reproducibility Package

The model training pipeline, datasets, and test configurations are fully documented under the `me-docs/` folder:
*   **Training Notebook**: [mamacare-ai-triage.ipynb](file:///c:/Comp/me-docs/mamacare-ai-triage.ipynb)
*   **Clinical Anchors**: [triage_anchors.json](file:///c:/Comp/me-docs/triage_anchors.json)
*   **Test Set**: [triage_test_data.json](file:///c:/Comp/me-docs/triage_test_data.json)
*   **Full Report**: [mamacare_technical_report.md](file:///c:/Comp/me-docs/mamacare_technical_report.md)
