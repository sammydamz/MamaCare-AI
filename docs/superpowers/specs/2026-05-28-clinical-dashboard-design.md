# Clinical Dashboard Design Spec

> **Date:** May 28, 2026
> **Scope:** CHW + Provider clinical dashboard (combined, role-based visibility)
> **Source:** `me-docs/MamaCare AI (Project Idea).md`, `me-docs/PRD.md`
> **Layout:** Demo1 (sidebar + header + footer) — existing Metronic shell

---

## Architecture Decision

Single dashboard page per feature area. CHWs see their zone + assigned patients. Providers see everything + analytics + CHW performance. Same routes, same components, role determines data scope.

No new layout created. We reuse `Demo1Layout` and replace sidebar menu + page content.

---

## Sidebar Navigation

```
MamaCare AI
──────────────
Dashboard           (LayoutGrid)
Patients            (Users)
Consultations       (MessageSquare)
Referrals           (Briefcase)
Analytics           (TrendingUp)      ← Provider only
Facilities          (Building)
Settings            (Settings)
```

---

## Routes

| Route | Page | Who Sees |
|-------|------|----------|
| `/` | Dashboard — KPIs, risk feed, zone summary | Both |
| `/patients` | Patient Registry — prioritized queue + detail | Both |
| `/patients/:id` | Patient Profile — full dossier | Both |
| `/consultations` | Voice Consultations — call history + transcripts | Both |
| `/referrals` | Referrals — referral queue + tracking + facility directory | Both |
| `/analytics` | Analytics — reports, CHW performance, facility stats | Provider only |
| `/facilities` | Health Facilities — directory with details | Both |

---

## Idea Doc Feature Mapping

| Idea # | Feature | Page / Component |
|--------|---------|-----------------|
| 1 | Register women (clinic or CHW) | `register-patient-dialog.tsx` on Patients page |
| 2 | Regular calls in local language | Consultations page (call log) |
| 3 | AI asks about symptoms, feelings, progress | Consultations page (transcript) |
| 4 | AI analyzes responses, predicts risk level | Patient detail (risk trend) + Consultations |
| 5 | Personalized advice, emotional support, or alerts | Consultations (AI response) + Dashboard alerts |
| 6 | High-risk escalated and followed until resolved | Referrals (timeline) + Patient (action log) |
| 11 | Prioritized patient queue sorted by risk | Patients page (left panel) |
| 12 | Real-time risk alerts on tier change | Dashboard (risk escalation feed) |
| 13 | Patient profiles (call history, symptoms, risk trends, referrals) | Patient Profile page |
| 14 | Action log for visits, calls, referrals, outcomes | Patient detail (action log section) |
| 15 | Referral tracker (did she go to facility?) | Referrals page (timeline + status tracking) |
| 16 | Facility directory (name, distance, hours, click-to-call) | Facilities page + inline on Referrals |
| 17 | Zone summary (caseload, pending visits, unresolved) | Dashboard (zone summary card) |
| 18 | Supervisor view (all CHWs, follow-up rates) | Analytics page (CHW performance table) |
| 19 | USSD offline mode | Deferred — separate USSD service |

### Post-Loss Features (embedded)

- Grief coping index → Patient detail (shown when pathway = Post-Loss)
- Physical recovery tracking → Patient detail (bleeding, infection signs)
- Risk detection after loss → Same risk engine, different assessment criteria
- Grief milestone tracking → Patient action log

### Pregnancy Features (embedded)

- Symptom tracking → Consultations page
- Pregnancy stage tracking → Patient header
- Early risk detection → Triage engine (background)
- Smart referrals → Referrals page
- Emergency escalation → Dashboard risk feed + Referrals

---

## Page Designs

### Page 1: Dashboard (`/`)

Covers: #11 (queue preview), #12 (risk alerts), #17 (zone summary)

```
Toolbar: "Clinical Dashboard"                    [Date Range picker]

Row 1: KPI Cards (4 across)
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Total       │ │ High Risk   │ │ Pending     │ │ Resolution  │
│ Mothers     │ │ Active      │ │ Actions     │ │ Rate        │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘

Row 2: Two-column (1/3 + 2/3)
┌──────────────────────┐  ┌──────────────────────────────────┐
│ Zone Summary         │  │ Risk Escalation Feed             │
│ Caseload: 6          │  │ • Amina: MED → HIGH (2 min ago)  │
│ Pending visits: 4    │  │ • Chloe: LOW → MED (1 hr ago)    │
│ Unresolved danger: 3 │  │                                  │
│                      │  │                                  │
│ Top Priority Queue   │  │                                  │
│ 1. Amina (HIGH)      │  │                                  │
│ 2. Chloe (MED)       │  │                                  │
│ 3. Fatima (LOW)      │  │                                  │
└──────────────────────┘  └──────────────────────────────────┘
```

**Components:** `Card`, `Badge`, `ScrollArea`, `CountingNumber`, `Progress`, `Separator`, `Toolbar`, `ToolbarHeading`, `ToolbarActions`, `Popover` + `Calendar` (date range), `Container`

### Page 2: Patients (`/patients`)

Covers: #11 (prioritized queue), #13 (patient profiles), #14 (action log), #1 (register)

```
Toolbar: "Patient Registry"     [Search]  [Risk▾]  [Pathway▾]  [+ Register]

Split layout: Resizable left (queue) / right (detail)

Left Panel:
  Tabs: All | Pregnancy | Post-Loss
  Scrollable patient cards sorted by risk (HIGH → MED → LOW)
  Each card: Avatar, Name, Risk Badge, Stage/Pathway, One-line reason

Right Panel (when patient selected):
  Header: Avatar, Name, Pathway, Stage, Language, CHW, Current Risk + trend arrow
  Risk Trend Chart (line chart over time)
  Latest Consultation summary
  Action Log (chronological)
  Action buttons: [Log Visit] [Create Referral] [Record Vitals]
```

**Components:** `Card`, `Badge`, `Avatar`, `Input`, `Select`, `Tabs`, `ScrollArea`, `Separator`, `Button`, `Dialog`, `Form` + `Input` + `Textarea` + `Select`, `Chart` (Recharts line), `Resizable`

**Post-loss variant:** When pathway = Post-Loss, detail panel shows grief coping index, recovery milestones, physical recovery metrics instead of pregnancy vitals.

### Page 3: Patient Profile (`/patients/:id`)

Covers: #13 (full profile), #14 (action log deep view)

```
Toolbar: "< Back to Patients"  "Patient Name"  [Edit] [Refer]

Row 1: Profile stat cards (Risk, Stage, Last Call, Assigned CHW)

Tabs: Overview | Consultations | Vitals & Recovery | Referrals | Action Log

Overview tab:
  Demographics card
  Risk trend chart
  Language & communication notes
  Active referrals
  Care loop timeline (registration → calls → alerts → referral → outcome)

Consultations tab:
  Table of all voice calls with expandable transcripts

Vitals & Recovery tab:
  Pregnancy: BP chart, kick count chart, hydration log
  Post-Loss: coping index chart, sleep log, bleeding status, grief milestones

Referrals tab:
  Referral history with status tracking

Action Log tab:
  Full chronological log of all actions (visits, calls, referrals, outcomes)
```

**Components:** `Card`, `Badge`, `Avatar`, `Tabs`, `Chart`, `Table`, `Button`, `Dialog`, `Form`, `Separator`, `Stepper`, `Input`, `Textarea`, `Select`

### Page 4: Consultations (`/consultations`)

Covers: #2 (calls in local language), #3 (AI asks about symptoms), #5 (advice or alerts)

```
Toolbar: "Voice Consultations"     [Patient▾]  [Risk▾]

DataGrid with expandable rows:
  Columns: Date, Patient, Language, Symptoms, Risk Level, AI Response Summary

Expanded row shows:
  Full transcript (AI question → Mother response → AI analysis)
  Risk assessment breakdown
  Recommended actions given in local language
  Whether referral was triggered
```

**Components:** `DataGrid` + `DataGridTable` + `DataGridColumnFilter` + `DataGridColumnHeader`, `Badge`, `Accordion`, `Card`, `Separator`

### Page 5: Referrals (`/referrals`)

Covers: #15 (referral tracker), #16 (facility directory inline)

```
Toolbar: "Referrals & Tracking"     [+ New Referral]  [Status▾]

Row 1: DataGrid
  Columns: Patient, Risk, Status, Facility, Assigned CHW, Outcome
  Status badges: Pending | In Transit | Admitted | Resolved | Lost to Follow-up

Row 2: Two-column (when referral selected)
  Left: Facility mini-card (name, distance, hours, services, call button)
  Right: Referral timeline (Stepper showing each stage with timestamps)
```

**Components:** `DataGrid` + `DataGridTable` + `DataGridColumnFilter`, `Badge`, `Card`, `Button`, `Dialog` (new referral form), `Select`, `Form`, `Separator`, `Stepper`

### Page 6: Analytics (`/analytics`) — Provider only

Covers: #18 (supervisor view, CHW follow-up rates)

```
Toolbar: "Analytics & Reports"     [Date Range]  [Export]

Row 1: KPI cards (Total Referrals, Avg Resolution Time, Follow-up Rate, Emergency Escalations)

Row 2: Two-column
  Left: CHW Performance table (CHW name, cases, follow-up rate)
  Right: Symptom trend chart (multi-line over time)

Row 3: Full-width
  Facility Performance table (Facility, Referrals, Resolved, Success Rate, Trend)
```

**Components:** `Card`, `Chart` (ApexCharts — line, bar, area), `Table`, `Badge`, `Button` (Export), `CountingNumber`

### Page 7: Facilities (`/facilities`)

Covers: #16 (facility directory)

```
Toolbar: "Health Facilities"     [Search]  [+ Add Facility]

Card grid (2-3 columns):
  Each card: Facility name, distance, hours, services list, [Call] [Refer] buttons
```

**Components:** `Card`, `Badge`, `Button`, `Input` (search), `Dialog` (add/edit facility form)

---

## Components Used (All from existing `src/components/ui/`)

No new UI components created. Everything uses existing Metronic 9 / ReUI primitives:

| Component | Where Used |
|-----------|-----------|
| `Card` | KPI cards, patient cards, facility cards, all sections |
| `Badge` | Risk levels, status indicators, pathway tags |
| `Avatar` | Patient cards, CHW indicators, profile headers |
| `Button` | All actions (Log Visit, Refer, Export, Call) |
| `Input` | Search bars, form fields |
| `Textarea` | Visit notes, observation fields |
| `Select` | Filters (risk, pathway, status), form dropdowns |
| `Tabs` | Patient profile sections, patient queue filter |
| `Dialog` | Register patient, log visit, create referral, add facility |
| `Form` | All forms (visit, referral, registration, facility) |
| `Table` | Consultation history, analytics tables |
| `DataGrid` + sub-components | Consultations list, referral queue |
| `Chart` | Risk trends, symptom distribution, analytics |
| `ScrollArea` | Patient queue, risk feed, action log |
| `Separator` | Section dividers |
| `Stepper` | Care loop timeline, referral timeline |
| `Progress` | Resolution rate, follow-up rate |
| `CountingNumber` | Animated KPI numbers |
| `Resizable` | Patient queue / detail split |
| `Popover` + `Calendar` | Date range picker |
| `Container` | Page wrapper |
| `Toolbar` / `ToolbarHeading` / `ToolbarActions` | Page title bars |
| `Accordion` | Expandable consultation transcripts |

---

## Files to Create

```
src/pages/mamacare/
├── dashboard/
│   ├── dashboard-page.tsx
│   ├── dashboard-content.tsx
│   └── components/
│       ├── kpi-cards.tsx
│       ├── risk-feed.tsx
│       └── zone-summary.tsx
├── patients/
│   ├── patients-page.tsx
│   ├── patients-content.tsx
│   ├── patient-profile-page.tsx
│   ├── patient-profile-content.tsx
│   └── components/
│       ├── patient-queue.tsx
│       ├── patient-card.tsx
│       ├── patient-detail.tsx
│       ├── risk-trend-chart.tsx
│       ├── action-log.tsx
│       ├── log-visit-dialog.tsx
│       ├── create-referral-dialog.tsx
│       ├── record-vitals-dialog.tsx
│       └── register-patient-dialog.tsx
├── consultations/
│   ├── consultations-page.tsx
│   ├── consultations-content.tsx
│   └── components/
│       ├── consultations-table.tsx
│       └── consultation-detail.tsx
├── referrals/
│   ├── referrals-page.tsx
│   ├── referrals-content.tsx
│   └── components/
│       ├── referral-table.tsx
│       ├── referral-timeline.tsx
│       ├── referral-form-dialog.tsx
│       └── facility-mini-card.tsx
├── analytics/
│   ├── analytics-page.tsx
│   ├── analytics-content.tsx
│   └── components/
│       ├── chw-performance-table.tsx
│       ├── symptom-trend-chart.tsx
│       └── facility-performance-table.tsx
├── facilities/
│   ├── facilities-page.tsx
│   ├── facilities-content.tsx
│   └── components/
│       ├── facility-card.tsx
│       └── facility-form-dialog.tsx
└── index.ts

src/lib/mamacare/
├── types.ts           ← Patient, Consultation, Referral, RiskLevel, Facility types
├── constants.ts       ← Risk colors, pathways, languages
└── mock-data.ts       ← Demo patients (Amina, Chloe, Fatima), demo consultations
```

## Files to Modify

| File | Change |
|------|--------|
| `src/config/menu.config.tsx` | Replace `MENU_SIDEBAR` with MamaCare navigation |
| `src/routing/app-routing-setup.tsx` | Replace all routes with MamaCare pages |
| `src/layouts/demo1/layout.tsx` | Update title, adjust toolbar for MamaCare |

## Files Untouched

- `src/components/ui/` — all 78 components kept as-is
- `src/auth/` — Supabase auth flow kept
- `src/providers/` — React Query, theme, i18n kept
- `src/hooks/` — all kept
- `src/layouts/demo1/` — shell kept, content replaced

---

## Out of Scope for This Build

- USSD offline mode (#19) — separate service
- Mother smartphone dashboard — separate build cycle
- AI/ML risk model — rules engine in prototype
- Real telephony integration — simulated calls
- Live ambulance GPS — simulated transit
- Federated learning, encryption controls — research features
- Data export (Export button shown but not wired)

---

## Testing

- Types in `lib/mamacare/types.ts` validate all data shapes
- Mock data in `lib/mamacare/mock-data.ts` covers all three patient scenarios (pregnant high-risk, post-loss medium, pregnant low-risk)
- Component rendering tests: each page renders without errors using mock data
- Role-based visibility: Analytics sidebar item hidden for CHW role
- Post-loss vs pregnancy: Patient detail renders correct sections based on pathway
