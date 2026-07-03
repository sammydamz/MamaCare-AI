# MAMACARE AI
**Supporting prenatal care with AI**

June 2026
Kasalite

Track 1 (Access to Comprehensive Early Pregnancy Loss-Care)

*Supported by: Artificial Intelligence for Development Africa, IDRC-CRDI, UK International Development, HASH, African Population and Health Research Center (APHRC), Sunbird AI, Data Science Africa (DSA), Makerere University, Infectious Diseases Institute (IDI)*

---

## Problem and Context

> "800 women die every day from preventable causes related to pregnancy and childbirth."

### The Care Gap
Maternal deaths don't happen at a single moment. They are the result of missed signals across the entire journey.

- **1 in 3** women in rural Sub-Saharan Africa has mobile internet.
- **Over 90%+** have access to a basic phone (GSM Voice with SMS).

### Meet Abena!
Receives little to no continuous structured support between clinic visits, leading to unseen physical and mental health crises.

*Sources: WHO Maternal Mortality Fact Sheet 2025; GSMA Mobile Internet Connectivity 2023; GSMA Mobile Gender Gap 2023*

---

## Solution

### MamaCare AI
A Voice-based Conversational AI Agent for prenatal risk monitoring and support for perinatal loss mothers (Zero-Friction Innovation).

**For Pregnant Women**
- Scheduled, automated check-in calls to track and monitor maternal health risk
- Support for local language

**For Perinatal Bereaved Mothers**
- Counselor support services and AI-powered mental wellness resources
- Scheduled check-ins for the bereaved mother

**For Both**
- Offline-first, no app, continuous support from health provider

### Clinical Dashboard (Core SaaS Component)
- **Risk Overview**: Live health risk escalation feed
- **User Management**: Activity log
- **Personalised & Mass Health Alerts and Guidance**: Medication reminders, nutrition & mental wellness tips

---

## Methodology, Ethical and Responsible AI

**Pipeline:**
1. National Safe Motherhood Protocol (Ghana Health Service)
2. Clinical Triage Guidelines — 28 initial, oversampled to 400
3. Guideline-derived few-shot fine tuning — distilbert-base-multilingual-cased (HuggingFace)
4. Testing and Evaluation

**Example training record:**
```json
{
  "symptom_name": "Swelling of feet, hands, or face",
  "text": "My face looks puffed up and my hands are very tight.",
  "label": 2,
  "guideline_rule": "Swelling of feet, hands, or face is a danger sign during pregnancy."
}
```

HIPAA Compliance | Continuous feedback loop

---

## Data Use, Open Science and Reproducibility

Our project complies with open data for research, use of open-source models and stack for dashboard web app development, and availability of reproducible code.

- National Safe Motherhood Protocol — MoH (Openly Available)
- DistilBert Model (Open Source)
- Open Source Stack for Clinical Dashboard (React, Express.js, PostgreSQL)
- Code Available on GitHub with MIT License

---

## Target and Value Proposition

| Audience | Value |
|---|---|
| Pregnant & Prenatal Loss Mothers | Regular voice check-ins, no app needed; continuous symptoms monitoring |
| Health Institution | AI triages routine cases; effective digital records |
| District Health Admin and Government | Real-time KPIs for analytics; exportable reports for planning |

---

## Impact

**SDG Alignment:** Goal 3 (Good Health and Well-Being), Goal 5 (Gender Equality), Goal 10 (Reduced Inequalities)

- **Reduced Maternal Mortality**: Maternal mortality reduced with timely and continuous care. Voice agent check-ins catch danger signs between visits before they're fatal.
- **Increased Maternal Health Service Productivity**: Our system enables health institutions to manage a large number of prenatal mothers at increased efficiency.
- **Bridges Infrastructure Barrier**: Over 90% GSM reachable. Continuous maternal care accessible to anyone irrespective of geographical location and resources.

---

## Next Steps: Scalability and Sustainability

- Implement language support with selected languages (Twi, Fante, Ga, Dagbani)
- Model improvement with extensive guideline anchors and new training strategies
- Integration into the Ghana Health System

---

## Demo

[mamacare-web-production.up.railway.app/auth](https://mamacare-web-production.up.railway.app/auth)

**AI-powered maternal care for CHWs, patients, and every call in between.**

MamaCare AI monitors pregnant and post-loss mothers through automated voice calls, surfacing real-time risk scores and alerts so CHWs can focus on the patients who need them most.

- Risk escalation feed
- Referral tracking
- CHW performance
- Analytics dashboard

*Demo access: username sarac@kbth.com, password demo123*

---

## Thank You

Kasalite

AI for Reproductive Health in Africa Innovation Challenge