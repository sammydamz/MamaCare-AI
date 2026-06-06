# **TEAM CONTRIBUTION STATEMENT**

This statement summarizes the roles and key contributions of each team member during the design, development, and evaluation of the MamaCare AI platform.

---

## 1. Sammy ([sammydamz](https://github.com/sammydamz))
**Roles**: Lead AI Engineer & Backend Developer
*   **Technical Development**: Developed the Node.js/Express.js backend server and API endpoints, configured PostgreSQL database persistence, and integrated WebSockets for real-time risk alerts.
*   **Data Science and Analytics**: Implemented the Guideline-Driven Few-Shot Fine-Tuning (GDF-FT) machine learning pipeline, fine-tuned `distilbert-base-multilingual-cased` on Kaggle, and deployed the final weights to the Hugging Face Hub (`sammydamz/mamacare-triage-model`).
*   **Telephony Architecture**: Set up the call simulator integration linking ElevenLabs conversational speech synthesis/transcription with backend triage endpoints.

---

## 2. [Teammate Name / Clinical Lead]
**Roles**: Clinical Director & Public Health Specialist
*   **Clinical or Public Health Expertise**: Extracted clinical triage rules from the Ghana Health Service **National Safe Motherhood Protocol (Revised Edition)** to form our dataset anchors.
*   **Data Science & Analytics**: Curated, translated, and verified Twi symptom anchors (e.g., postpartum hemorrhage indicators) to ensure clinical validity in local dialects.
*   **Research & Drafting**: Authored the public health sections of the Technical Report, including Section A (Problem Statement) and Section D (Ethical and Responsible AI Considerations).

---

## 3. [Teammate Name / UX Designer]
**Roles**: Product Designer & Project Manager
*   **User Experience Design**: Designed the layout and wireframes of the Clinician Dashboard (outlining patient priority queues, transit trackers, and care logs) and the Mothers Portal interface.
*   **Project Management**: Managed project milestones, coordinated team sprints, and compiled HASH submission checklists.
*   **Documentation & Testing**: Co-authored Section B (Solution Overview) and Section E (Scalability) of the report and conducted usability testing for the GSM call simulator.
