# Admin Patient Form — Research & Improvement Plan

## 1. Research: Critical Fields for Pregnancy Patient Intake

Based on standard obstetric intake forms (ACOG, Merck Manual, NHS, Kaiser Permanente) and the MamaCare context, here are the fields a pregnancy intake form **must capture** at registration:

### A. Demographics (standard)

| Field | Why | Current Form |
| --- | --- | --- |
| Full Name | Identification | ✅ Present |
| Date of Birth | Age verification, gestational dating | ❌ Only "Age" number |
| Phone Number | Contact/SMS alerts | ✅ Present |
| Location / Address | Geography, referral routing, transport planning | ❌ **Missing** |
| Language | Care communication, AI session language | ✅ Present |
| Occupation | Risk assessment (physical demands, exposures) | ❌ **Missing** |
| Emergency Contact | Crisis/rapid response | ❌ **Missing** |

### B. Obstetric / Pregnancy-Specific

| Field | Why | Current Form |
| --- | --- | --- |
| Trimester (1st/2nd/3rd) | Determines visit frequency, screening schedule, risk profile | ❌ **Missing — critical** |
| Gestational Weeks | Precise staging, supplement dosing, due date tracking | ❌ **Missing** |
| Last Menstrual Period (LMP) | Gold-standard EDD calculation (Naegele's rule: LMP + 280 days) | ❌ **Missing** |
| Expected Due Date (EDD) | Derived from LMP; drives entire care timeline | ❌ **Missing** |
| Pathway | Care pathway (Pregnancy/Postnatal/Post-Loss) | ✅ Present (disabled/pre-filled) |
| Gravida / Parity | OB history (number of pregnancies, deliveries) | ❌ **Missing** |

### C. Clinical / Conditions

| Field | Why | Current Form |
| --- | --- | --- |
| Comorbidities (checklist) | Risk stratification, drug interactions, care coordination | ❌ **Missing — critical** |
| Other Conditions (free text) | Capture conditions not in checklist | ❌ **Missing** |
| Allergies | Medication safety | ❌ **Missing** |
| Current Medications | Drug interaction check, continuity | ❌ **Missing** |

### D. Administrative / Enrichment

| Field | Why | Current Form |
| --- | --- | --- |
| Registration Date | Auto-generated (server-side) | ✅ Auto |
| Assigned CHW | Auto or manual assignment | ✅ Auto (Unassigned) |
| Insurance / Payment | Billing, eligibility checks | ❌ **Missing** |

### E. Conditions Checklist Suggestion

Per research (ACOG high-risk criteria, WHO ANC guidelines), the most prevalent pregnancy comorbidities to pre-populate:

1. **Diabetes** (Gestational / Pre-existing) — user requested
2. **Hypertension** (Chronic / Pregnancy-induced) — most common complication
3. **Thyroid Disorder** — ACOG recommends screening in high-risk
4. **Anemia** — highest prevalence globally, especially in Ghana/West Africa
5. **Other** — free text input, user requested

---

## 2. Issues Found in Current Form

### Bug: "Register Patient" click does nothing (no user feedback)

**Root cause**: The `handleSubmit` function and the `registerPatient` provider method both swallow errors with `console.error(err)` only. No toast/UI feedback is shown. If the API is unreachable, the user clicks "Register Patient" and sees nothing happen.

**Fix**: Add `toast.error()` / `toast.success()` feedback in both the dialog and provider.

### UX Issue: Pathway select is disabled

The pathway dropdown is `disabled` and pre-filled from `activePathway`. This is intentional (user noted "pre-filled from active pathway") but the helper text says "Change pathway from the patient detail panel after registration" which is confusing at registration time. Acceptable as-is.

---

## 3. Improvement Plan (Priority Order)

1. **Add toast notifications** to register patient flow (fixes silent failure)
2. **Add Location/Address** field (explicitly requested)
3. **Add Trimester select** (First/Second/Third) — conditional month input (explicitly requested)
4. **Add Conditions/Comorbidities** — 4 checkboxes (Diabetes, Hypertension, Thyroid, Anemia) + Other text input (explicitly requested)
5. **Add LMP date** (standard OB field, enables EDD calculation)
6. **Add Emergency Contact** (standard intake)
7. **Add Occupation** (risk assessment)
8. **Date of Birth** — replace Age number input with DOB date input (more precise, calculates age)
9. **Gestational Weeks** number input (shown when trimester selected)

> **Deferred** (when component library arrives): Date tokens for LMP/EDD/DOB inputs per design spec.

---

## 4. Files to Modify

| File | Change |
| --- | --- |
| `src/lib/mamacare/types.ts` | Add new optional fields to Patient type |
| `src/lib/mamacare/constants.ts` | Add trimester options, conditions list |
| `src/lib/mamacare/api.ts` | Update `registerPatient` params |
| `src/providers/mamacare-provider.tsx` | Update `registerPatient` signature + add toast feedback |
| `src/pages/mamacare/patients/components/register-patient-dialog.tsx` | New form fields + toast feedback |
| `server/schema.sql` | Add new columns to patients table |
| `server/index.ts` | Update POST /api/patients to accept new fields |
