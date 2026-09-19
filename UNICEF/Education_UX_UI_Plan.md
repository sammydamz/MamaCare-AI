## 0. Targeting model (how a piece reaches the right mothers)

Each piece carries a target selector, chosen by the health worker at send time:

- Prenatal: trimester group (1st / 2nd / 3rd) OR a specific gestational month
  (month 1–9). A mother in month 5 receives month-5 content. Trimester groups
  are the default; month selection is the finer option alongside them.
- Postnatal + child-welfare continuum: early (0–6 weeks), or month 3, 6, 9, 12
  after birth. Labelled as continuum contacts (CWC/EPI touchpoints), not WHO
  postnatal contacts (which end at 6 weeks).
- Bereavement: single group, all bereaved mothers. Timing is mother-led;
  the agent never pushes a timeline.

Matching rule: a mother's current status (gestational month from EDD, or months
since birth, or bereavement flag) decides which pieces she is eligible for;
within eligibility, the next undelivered approved piece in her language.

Scope: week-matched approved health lessons delivered on the same screening call.
Fixed rule: the agent delivers clinical words, never writes them. Only `approved` content reaches a call.
Demo constraint: no seeded postnatal mother. Postnatal pieces are library-only in the demo.

## 1. Surfaces (4 touches)

### 1A. Sidebar → Education (only new page)
Route: `/education`. Tabs: Library | Review Queue | Gap Report.

Library row per piece: title, track (prenatal/postnatal/bereavement), target
(trimester group and/or gestational month 1–9; postnatal month 3/6/9/12), week,
languages with approved version (badges, e.g. EN ✓ TW ✓ DAG ○), status pill
(draft / in-review / approved vN), source ref (WHO/GHS), updated date.
Actions by status: draft → Edit, Send for review; in-review → Approve, Send back + note;
approved → View frozen text, New version (edits never mutate; approving records reviewer + date).

Review Queue tab: all in-review pieces with reviewer assign + approve/send-back.
Gap Report tab: pieces needed in the next 4 weeks with no approved translation —
sorted by urgency. This list blocks pilot launch; it is the page's headline widget.

Empty states: no drafts ("Write the first script"), no gaps ("All covered for 4 weeks").

### 1B. Voice Triage call flow (`/voice-triage-demo`)
Call timeline UI, visible steps: greeting → screening → education → close.
Education step card shows: piece title, version (e.g. "W20 · v3 · Twi"), script excerpt,
audio player (AI-generated from approved text), progress (stayed %).
Danger-flag path: screening HIGH → education card flips to SKIPPED state
("skipped · danger flag · requeued for next call"), escalation panel takes over.
Mother-asks-question path: question → KB answer cited to approved section, or
"health worker will follow up" + follow-up task created (never improvised text).

### 1C. Sessions table (`/sessions`)
New column "Education": delivered badge ("W20 · Twi · 82% stayed") linking to
transcript + exact version; skipped badge ("skipped · danger"); dash when none.
Existing patient + risk filters unchanged; add track filter only if cheap.

### 1D. Patient drawer → session block
Prenatal drawer: extend Latest Session with one education line:
"Heard: W20 birth preparedness (v3, Twi) · stayed 82% · transcript".
Bereavement drawer: add the missing session block entirely (currently absent) —
Latest Session + education line. This fills the thinnest UI in the product.
Postnatal drawer: same line once patients exist; no seeding for demo.

## 2. States & rules (enforced in UI + API)

- Selector only queries `status=approved`; drafts/in-review unreachable at call time (test proves it).
- Language fallback: mother language → approved version, else English + logged fallback
  (gap log feeds the Gap Report).
- Week resolution: recomputed from EDD/birth date at call time; next undelivered piece.
- Delivery record: mother, piece version, language, stayed %, conversation ID → transcript.
- Agent leash (system prompt): script passed as data, not baked in; rephrase only from script;
  unknown → KB → human follow-up; never diagnose; never contradict health worker.
- Offline: approved library caches on device; delivery records queue + sync; drafts never sync down.

## 3. Demo script (Day 3, ~4 minutes)

1. Voice Triage → prenatal mother (Nana Yaa): screening LOW → W20 piece plays in Twi → stayed % logged.
2. Same flow, danger input → education SKIPPED, escalation alert fires, requeue noted.
3. Education page: approve a draft live (frozen v1), Gap Report shows postnatal Twi gap.
4. Kristen Marquardt drawer: bereavement grief piece delivery history.
5. Postnatal pieces: library-only, stated as pending enrollment — no fake patient.

## 4. Out of scope (per brief)

Telephony (browser agent only) · content reordering by knowledge gaps ·
auto quality scoring · twins/multi-pregnancy · education-only standalone calls
(rides along on screening calls).

## 5. Done means (acceptance)

Week-20 mother gets week-20 approved content in her language · transcript matches
frozen script · unapproved never selectable (test) · danger suppresses + records skip ·
edit-approved creates new version, history intact · any mother/date reconstructs exact
words heard · unanswerable question → human follow-up.

## 6. Build order

1. Tables: education_pieces, versions, deliveries (+ API, approved-only selector).
2. Education page (library + review + gap).
3. Voice-triage education step + skip path.
4. Sessions column + drawer lines (bereavement block first).
5. Scripts: 4 demo pieces through draft → approved.
6. Docs fusion (grant §4/5/6/9/12, hackathon answers, CARE SCDA).
