# MamaCare AI — Current Codebase & What We Have

## Dev Server

```
http://localhost:5173/
```

Login: `demo@kt.com` / `demo123` (if Supabase is configured)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 7 + pnpm |
| UI | Metronic 9 (Tailwind CSS 4) + ReUI components |
| Routing | React Router 7 |
| Data Fetching | TanStack React Query 5 |
| Forms | React Hook Form + Zod |
| Auth | Supabase Auth (email/password + Google OAuth) |
| Database | Supabase (PostgreSQL) |
| Charts | ApexCharts + Recharts |
| Maps | Leaflet + React Leaflet |
| Animations | Motion |

---

## What We Can Reuse

### 78 UI Components (`src/components/ui/`)

**Data Display**
- `card.tsx`, `badge.tsx`, `avatar.tsx`, `avatar-group.tsx`
- `table.tsx`, `data-grid.tsx`, `data-grid-table.tsx`
- `chart.tsx` (ApexCharts wrapper)
- `skeleton.tsx`, `skeleton-with-pattern.tsx`
- `tooltip.tsx`, `hover-card.tsx`
- `progress.tsx`, `counting-number.tsx`, `sliding-number.tsx`

**Charts & Visualization**
- `chart.tsx` — ApexCharts wrapper (line, bar, pie, area, etc.)
- Recharts available globally

**Forms & Input**
- `button.tsx`, `input.tsx`, `textarea.tsx`, `select.tsx`
- `checkbox.tsx`, `radio-group.tsx`, `switch.tsx`, `slider.tsx`
- `form.tsx`, `label.tsx`, `input-otp.tsx`
- `file-upload.tsx`, `datefield.tsx`, `calendar.tsx`

**Layout & Structure**
- `tabs.tsx`, `accordion.tsx`, `collapsible.tsx`
- `separator.tsx`, `scroll-area.tsx`, `resizable.tsx`
- `stepper.tsx`, `pagination.tsx`
- `aspect-ratio.tsx`

**Overlays & Dialogs**
- `dialog.tsx`, `drawer.tsx`, `sheet.tsx`
- `alert-dialog.tsx`, `popover.tsx`, `dropdown-menu.tsx`
- `command.tsx`, `context-menu.tsx`
- `sonner.tsx` (toast notifications)

**Navigation**
- `navigation-menu.tsx`, `menubar.tsx`
- `breadcrumb.tsx`, `accordion-menu.tsx`

**Data Tables (Advanced)**
- `data-grid.tsx` — full-featured data grid
- `data-grid-column-filter.tsx`, `data-grid-column-header.tsx`
- `data-grid-column-visibility.tsx`, `data-grid-pagination.tsx`
- `data-grid-table.tsx`, `data-grid-table-dnd.tsx`

**Special**
- `kanban.tsx`, `sortable.tsx` (drag & drop)
- `carousel.tsx`, `marquee.tsx`
- `tree.tsx`
- `typing-text.tsx`, `word-rotate.tsx`, `shimmering-text.tsx`

### Layout System (`src/layouts/demo1/`)

```
├── layout.tsx          ← Main wrapper (Sidebar + Header + Content + Footer)
└── components/
    ├── sidebar.tsx     ← Left sidebar with menu
    ├── sidebar-menu.tsx
    ├── sidebar-header.tsx
    ├── header.tsx      ← Top bar
    ├── toolbar.tsx     ← Page title + actions area
    ├── footer.tsx
    ├── breadcrumb.tsx
    └── mega-menu.tsx
```

### Infrastructure (Already Wired)

- **Auth**: Supabase provider wraps the entire app
- **Protected routes**: `RequireAuth` component guards all pages
- **React Query**: QueryClient set up globally
- **Theme**: Light/dark mode via `ThemeProvider`
- **i18n**: Internationalization provider ready
- **Settings**: Layout/appearance settings system
- **Toast notifications**: Sonner configured globally
- **Loading bar**: Top loading bar on route changes

---

## Project Structure

```
src/
├── App.tsx                 ← Root component (providers)
├── main.tsx                ← Entry point
├── auth/                   ← Auth context, routing, Supabase provider
├── components/
│   ├── ui/                 ← 78 reusable UI components (OUR GOLDMINE)
│   ├── common/             ← Shared components (Container, etc.)
│   └── supabase/           ← Supabase-specific components
├── config/
│   ├── menu.config.tsx     ← Sidebar menu items (EDIT THIS for MamaCare)
│   ├── settings.config.ts  ← Theme/layout settings
│   └── general.config.ts   ← General app config
├── layouts/
│   └── demo1/              ← Main layout shell (Sidebar + Header + Footer)
├── pages/                  ← Page components (REPLACE with MamaCare pages)
│   ├── dashboards/
│   ├── account/
│   ├── network/
│   └── ...
├── partials/               ← Reusable page sections
├── providers/              ← Context providers
├── hooks/                  ← Custom hooks
├── routing/                ← Route definitions (EDIT for MamaCare routes)
├── lib/                    ← Utility functions
├── i18n/                   ← Translations
└── errors/                 ← Error pages
```

---

## Strategy: Build MamaCare From Scratch

### Keep
- `src/components/ui/` — all 78 UI primitives
- `src/components/common/` — Container, shared layout components
- `src/layouts/demo1/` — layout shell (sidebar + header + footer structure)
- `src/auth/` — Supabase auth flow
- `src/providers/` — all context providers
- `src/hooks/` — custom hooks
- `src/lib/` — utilities
- `src/config/general.config.ts` — app config

### Replace
- `src/config/menu.config.tsx` — MamaCare sidebar menu
- `src/routing/app-routing-setup.tsx` — MamaCare routes
- `src/pages/` — all pages become MamaCare pages
- `src/partials/` — MamaCare-specific partials

### New (Create)
- `src/pages/mamacare/` — all MamaCare pages
- `src/lib/mamacare/` — types, constants, mock data
- `src/hooks/mamacare/` — MamaCare-specific hooks
- `src/partials/mamacare/` — MamaCare partials (cards, charts, etc.)

---

## Key Files to Edit First

| File | What To Change |
|------|---------------|
| `src/config/menu.config.tsx` | Replace sidebar menu with MamaCare navigation |
| `src/routing/app-routing-setup.tsx` | Replace routes with MamaCare pages |
| `src/pages/` | Create MamaCare dashboard, patients, calls, alerts pages |

---

## Package Manager

Always use **pnpm** (not npm):
```bash
pnpm install
pnpm dev
pnpm build
```
