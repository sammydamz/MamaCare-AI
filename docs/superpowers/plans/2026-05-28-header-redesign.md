# Header Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Metronic demo header with a MamaCare clinical header — breadcrumbs left, search/notifications/user right.

**Architecture:** Edit `header.tsx` and `user-dropdown-menu.tsx` in place. Remove MegaMenu, Chat, Apps. Always show Breadcrumb. Simplify user dropdown to role badge + settings + dark mode + logout.

**Tech Stack:** React 19, TypeScript, Tailwind v4, lucide-react, next-themes

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/lib/mamacare/constants.ts` | Modify | Add `currentUserRole` mock constant |
| `src/layouts/demo1/components/header.tsx` | Modify | Remove MegaMenu/Chat/Apps, always show Breadcrumb |
| `src/partials/topbar/user-dropdown-menu.tsx` | Modify | Replace with MamaCare version |

---

### Task 1: Add mock user role to constants

**Files:**
- Modify: `src/lib/mamacare/constants.ts`

- [ ] **Step 1: Add `currentUserRole` and related constants**

Append to `src/lib/mamacare/constants.ts` after line 42:

```ts
export type UserRole = 'CHW' | 'Provider'

export const currentUserRole: UserRole = 'Provider'

export const ROLE_BADGE_VARIANT: Record<UserRole, string> = {
  CHW: 'primary',
  Provider: 'success',
}

export const MOCK_USER = {
  name: 'Amina Kofi',
  email: 'amina@mamacare.ai',
  role: currentUserRole,
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/mamacare/constants.ts
git commit -m "feat(mamacare): add mock user role constants for header"
```

---

### Task 2: Simplify header.tsx — remove MegaMenu, Chat, Apps

**Files:**
- Modify: `src/layouts/demo1/components/header.tsx`

- [ ] **Step 1: Replace the entire file**

The new `src/layouts/demo1/components/header.tsx`:

```tsx
import { useEffect, useState } from 'react';
import { SearchDialog } from '@/partials/dialogs/search/search-dialog';
import { NotificationsSheet } from '@/partials/topbar/notifications-sheet';
import { UserDropdownMenu } from '@/partials/topbar/user-dropdown-menu';
import {
  Bell,
  Menu,
  Search,
} from 'lucide-react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Container } from '@/components/common/container';
import { Breadcrumb } from './breadcrumb';
import { SidebarMenu } from './sidebar-menu';

export function Header() {
  const [isSidebarSheetOpen, setIsSidebarSheetOpen] = useState(false);

  const { pathname } = useLocation();
  const mobileMode = useIsMobile();

  const scrollPosition = useScrollPosition();
  const headerSticky: boolean = scrollPosition > 0;

  useEffect(() => {
    setIsSidebarSheetOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'header fixed top-0 z-10 start-0 flex items-stretch shrink-0 border-b border-transparent bg-background end-0 pe-[var(--removed-body-scroll-bar-size,0px)]',
        headerSticky && 'border-b border-border',
      )}
    >
      <Container className="flex justify-between items-stretch lg:gap-4">
        {/* Mobile Logo + Hamburger */}
        <div className="flex lg:hidden items-center gap-2.5">
          <Link to="/" className="shrink-0">
            <img
              src={toAbsoluteUrl('/media/app/mini-logo.svg')}
              className="h-[25px] w-full"
              alt="mini-logo"
            />
          </Link>
          {mobileMode && (
            <Sheet
              open={isSidebarSheetOpen}
              onOpenChange={setIsSidebarSheetOpen}
            >
              <SheetTrigger asChild>
                <Button variant="ghost" mode="icon">
                  <Menu className="text-muted-foreground/70" />
                </Button>
              </SheetTrigger>
              <SheetContent
                className="p-0 gap-0 w-[275px]"
                side="left"
                close={false}
              >
                <SheetHeader className="p-0 space-y-0" />
                <SheetBody className="p-0 overflow-y-auto">
                  <SidebarMenu />
                </SheetBody>
              </SheetContent>
            </Sheet>
          )}
        </div>

        {/* Breadcrumbs — always shown on desktop */}
        {!mobileMode && <Breadcrumb />}

        {/* Topbar */}
        <div className="flex items-center gap-3">
          {!mobileMode && (
            <SearchDialog
              trigger={
                <Button
                  variant="ghost"
                  mode="icon"
                  shape="circle"
                  className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary"
                >
                  <Search className="size-4.5!" />
                </Button>
              }
            />
          )}
          <NotificationsSheet
            trigger={
              <Button
                variant="ghost"
                mode="icon"
                shape="circle"
                className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary"
              >
                <Bell className="size-4.5!" />
              </Button>
            }
          />
          <UserDropdownMenu
            trigger={
              <img
                className="size-9 rounded-full border-2 border-green-500 shrink-0 cursor-pointer"
                src={toAbsoluteUrl('/media/avatars/300-2.png')}
                alt="User Avatar"
              />
            }
          />
        </div>
      </Container>
    </header>
  );
}
```

Key changes from original:
- Removed imports: `StoreClientTopbar`, `AppsDropdownMenu`, `ChatSheet`, `LayoutGrid`, `MessageCircleMore`, `SquareChevronRight`, `MegaMenu`, `MegaMenuMobile`
- Removed `isMegaMenuSheetOpen` state and its sheet (MegaMenuMobile mobile sheet)
- Removed `pathname.startsWith('/account')` conditional — Breadcrumb always renders
- Removed `pathname.startsWith('/store-client')` conditional — no store topbar
- Removed ChatSheet and AppsDropdownMenu from topbar
- Kept: Search, Notifications, UserDropdownMenu

- [ ] **Step 2: Verify build**

```bash
npx tsc --noEmit && npm run build
```

Expected: Clean build, no errors.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/demo1/components/header.tsx
git commit -m "feat(mamacare): replace MegaMenu with breadcrumbs, remove Chat/Apps from header"
```

---

### Task 3: Simplify user dropdown menu for MamaCare

**Files:**
- Modify: `src/partials/topbar/user-dropdown-menu.tsx`

- [ ] **Step 1: Replace the entire file**

The new `src/partials/topbar/user-dropdown-menu.tsx`:

```tsx
import { ReactNode } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import {
  Moon,
  Settings,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { toAbsoluteUrl } from '@/lib/helpers';
import { MOCK_USER, ROLE_BADGE_VARIANT } from '@/lib/mamacare/constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';

export function UserDropdownMenu({ trigger }: { trigger: ReactNode }) {
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const displayAvatar = toAbsoluteUrl('/media/avatars/300-2.png');

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" side="bottom" align="end">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <img
              className="size-9 rounded-full border-2 border-green-500"
              src={displayAvatar}
              alt="User avatar"
            />
            <div className="flex flex-col">
              <span className="text-sm text-mono font-semibold">
                {MOCK_USER.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {MOCK_USER.email}
              </span>
            </div>
          </div>
          <Badge
            variant={ROLE_BADGE_VARIANT[MOCK_USER.role] as 'primary' | 'success'}
            appearance="light"
            size="sm"
          >
            {MOCK_USER.role}
          </Badge>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex items-center gap-2">
          <Settings />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="flex items-center gap-2"
          onSelect={(event) => event.preventDefault()}
        >
          <Moon />
          <div className="flex items-center gap-2 justify-between grow">
            Dark Mode
            <Switch
              size="sm"
              checked={theme === 'dark'}
              onCheckedChange={handleThemeToggle}
            />
          </div>
        </DropdownMenuItem>
        <div className="p-2 mt-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

Key changes from original:
- Removed imports: `I18N_LANGUAGES`, `Language`, all unused lucide icons (`BetweenHorizontalStart`, `Coffee`, `CreditCard`, `FileText`, `Globe`, `IdCard`, `Shield`, `SquareCode`, `UserCircle`, `Users`), `Link`, `useLanguage`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuSub`, `DropdownMenuSubContent`, `DropdownMenuSubTrigger`
- Removed: `user` from `useAuth()` destructuring, `currenLanguage`/`changeLanguage`/`handleLanguage`, `displayName`/`displayEmail` logic
- Uses `MOCK_USER` and `ROLE_BADGE_VARIANT` from constants
- Header section: plain `<span>` instead of `<Link>` (no profile page link), shows role badge
- Removed: Public Profile, My Profile, My Account submenu, Dev Forum, Language selector
- Kept: Settings (placeholder), Dark Mode toggle, Logout button

- [ ] **Step 2: Verify build**

```bash
npx tsc --noEmit && npm run build
```

Expected: Clean build, no errors.

- [ ] **Step 3: Commit**

```bash
git add src/partials/topbar/user-dropdown-menu.tsx
git commit -m "feat(mamacare): simplify user dropdown to role badge, settings, dark mode, logout"
```

---

### Task 4: Visual verification and push

- [ ] **Step 1: Run dev server and check in browser**

```bash
npm run dev
```

Verify:
- Header left shows breadcrumbs on all MamaCare routes
- Header right shows only Search, Bell, Avatar
- Clicking avatar shows: name + email + CHW/Provider badge, Settings, Dark Mode, Logout
- No console errors
- Mobile: hamburger menu still works, no MegaMenu button

- [ ] **Step 2: Push all commits**

```bash
git push origin feature/clinical-dashboard
```
