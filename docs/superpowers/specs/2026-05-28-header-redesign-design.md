# Header Redesign Design Spec

> **Date:** May 28, 2026
> **Scope:** Replace Metronic demo header with MamaCare clinical header
> **Approach:** Edit in place (Approach A)

---

## Current State

The header (`src/layouts/demo1/components/header.tsx`) contains Metronic demo artifacts:
- **Left side**: MegaMenu with 6 dropdown items (Home, Public Profiles, My Account, Network, Store, Authentication) — all linking to old demo pages
- **Right side**: Search, Notifications, Chat sheet, Apps dropdown grid, User avatar dropdown
- **User dropdown**: Links to Public Profile, My Profile, My Account (Get Started, Billing, Security, Members, Integrations), Dev Forum, Language selector, Dark Mode toggle, Logout

---

## Target State

### Left Side — Breadcrumbs (always visible)

Replace MegaMenu with the existing `Breadcrumb` component on all routes. The Breadcrumb already reads from `MENU_SIDEBAR` (replaced with MamaCare items in previous work).

Expected breadcrumb paths:
- `/` → `Dashboard`
- `/patients` → `Patients`
- `/patients/:id` → `Patients > Patient Profile`
- `/consultations` → `Consultations`
- `/referrals` → `Referrals`
- `/analytics` → `Analytics`
- `/facilities` → `Facilities`

Changes to `header.tsx`:
- Remove `MegaMenu` and `MegaMenuMobile` imports and their mobile sheet rendering
- Remove the `pathname.startsWith('/account')` conditional
- Always render `Breadcrumb` for desktop (non-mobile) views
- Keep mobile hamburger menu (sidebar sheet) unchanged

### Right Side — 3 topbar items

Keep: Search dialog, Notifications sheet, User dropdown menu

Remove from `header.tsx`:
- `ChatSheet` import and trigger button
- `AppsDropdownMenu` import and trigger button

### User Dropdown — MamaCare version

Replace the content of `UserDropdownMenu` component with:

```
┌─────────────────────────────┐
│ [Avatar] Amina Kofi  [CHW] │
│          amina@mamacare.ai  │
├─────────────────────────────┤
│ ⚙  Settings                 │
│ 🌙 Dark Mode        [toggle]│
├─────────────────────────────┤
│ [Logout]                    │
└─────────────────────────────┘
```

- Role badge reads from a mock constant (`currentUserRole`) exported from `src/lib/mamacare/constants.ts`
- Values: `'CHW'` or `'Provider'`
- Badge color: CHW = blue, Provider = green
- Remove: Public Profile link, My Profile link, My Account submenu, Dev Forum link, Language selector
- Keep: Dark Mode toggle, Logout button
- Settings link points to `/settings` (placeholder route, not implemented yet)

---

## Files Modified

| File | Change |
|------|--------|
| `src/layouts/demo1/components/header.tsx` | Remove MegaMenu/Chat/Apps, always show Breadcrumb, keep Search/Notifications/User |
| `src/layouts/demo1/components/mega-menu.tsx` | No changes (left as orphan, not imported) |
| `src/layouts/demo1/components/mega-menu-mobile.tsx` | No changes (left as orphan, not imported) |
| `src/layouts/demo1/components/breadcrumb.tsx` | No changes (already reads MENU_SIDEBAR) |
| `src/partials/topbar/user-dropdown-menu.tsx` | Replace content with MamaCare version |
| `src/lib/mamacare/constants.ts` | Add `currentUserRole` mock constant |

---

## Out of Scope

- Notifications content (still shows Metronic demo items)
- Search dialog content (still searches Metronic demo pages)
- Mobile header logo (keeping as-is)
- Deleting orphaned MegaMenu partials/files
- Settings page implementation
- Real auth integration (role from actual auth context)
