# Project Structure — Picking Control Gudang

## TL;DR

This is a **Next.js App Router** project. Instead of the traditional `components/` + `pages/` split you might be used to, Next.js App Router uses a **file-system-based routing** system where:
- Every folder under `src/app/` **is a URL route**
- Each folder must have a `page.tsx` to be a visible page
- Special files like `layout.tsx` wrap child routes
- Parenthesized folders like `(auth)` are **route groups** (no URL segment)
- Bracketed folders like `[id]` are **dynamic URL parameters**

---

## Full File Tree

```
src/
├── app/                              # ← All routes live here (App Router)
│   ├── layout.tsx                    # Root layout — wraps EVERY page
│   ├── page.tsx                      # Route: / → redirects to /login
│   ├── globals.css                   # Global styles (Tailwind + CSS vars)
│   ├── favicon.ico
│   │
│   ├── login/                        # Route: /login
│   │   ├── page.tsx                  #   Login page (just renders LoginForm)
│   │   └── login-form.tsx            #   The actual login form component
│   │
│   └── (auth)/                       # Route group: wraps all authenticated pages
│       ├── layout.tsx                # Auth layout — Topbar + Sidebar + mobile drawer
│       │                             #   (does NOT add a /auth URL segment)
│       │
│       ├── dashboard/                # Route: /dashboard
│       │   └── page.tsx
│       │
│       ├── upload/                   # Route: /upload
│       │   └── page.tsx
│       │
│       ├── picking/                  # Route: /picking
│       │   ├── page.tsx              #   Picking list overview
│       │   ├── _components/          #   Picking-specific UI (not a route)
│       │   │   ├── PickingTable.tsx
│       │   │   ├── PickingCard.tsx
│       │   │   └── PickingItemModal.tsx
│       │   └── [id]/                 # Route: /picking/:id (dynamic)
│       │       └── page.tsx
│       │
│       ├── handover/                 # Route: /handover
│       │   ├── page.tsx              #   Handover list overview
│       │   ├── _components/          #   Handover-specific UI
│       │   │   └── HandoverPanel.tsx
│       │   └── [id]/                 # Route: /handover/:id (dynamic)
│       │       └── page.tsx
│       │
│       ├── dealer/                   # Route: /dealer
│       │   ├── page.tsx              #   Dealer items list
│       │   ├── _components/          #   Dealer-specific UI
│       │   │   ├── DealerItemRow.tsx
│       │   │   ├── ConfirmMatchModal.tsx
│       │   │   ├── ConfirmShortageModal.tsx
│       │   │   └── ConfirmExcessModal.tsx
│       │   └── [id]/                 # Route: /dealer/:id (dynamic)
│       │       └── page.tsx
│       │
│       ├── debts/                    # Route: /debts
│       │   ├── page.tsx              #   Debt overview
│       │   ├── _components/          #   Debt-specific UI
│       │   │   └── DebtTable.tsx
│       │   └── pay/                  # Route: /debts/pay
│       │       └── page.tsx
│       │
│       └── history/                  # Route: /history
│           └── page.tsx
│
├── components/                       # Shared UI components (used across multiple routes)
│   ├── Sidebar.tsx                   # Desktop sidebar nav
│   ├── Topbar.tsx                    # Top navigation bar
│   ├── FilterBar.tsx                 # Date/driver/expedition filter dropdowns
│   ├── StatCard.tsx                  # Dashboard stat card
│   ├── Timeline.tsx                  # Audit trail timeline
│   ├── SignaturePad.tsx              # Canvas-based signature capture
│   └── CameraCapture.tsx             # Camera/photo capture
│
└── lib/                              # Utilities, types, API, context providers
    ├── types.ts                      # TypeScript type definitions
    ├── api.ts                        # API client (fetch wrapper + mappers)
    ├── utils.ts                      # Helper functions (date formatting, debt calc, etc.)
    ├── mock-data.ts                  # Hardcoded mock data (legacy, kept for reference)
    └── providers/                    # React Context providers
        ├── auth-context.tsx           #   Auth state (login, logout, current user)
        └── dark-mode.tsx              #   Dark mode toggle
```

---

## How Routing Works (for backend devs)

### Traditional way (what you might know)
```
pages/
  dashboard.js    → /dashboard
  users/
    index.js      → /users
    [id].js       → /users/:id
```

### App Router way (this project)
```
app/
  dashboard/
    page.tsx      → /dashboard
  users/
    page.tsx      → /users
    [id]/
      page.tsx    → /users/:id
```

The key difference: **every route is a folder**, and each folder needs a `page.tsx` to be accessible. The file name `page.tsx` is mandatory — a folder without it doesn't serve any route.

---

## Special Conventions Explained

### `(auth)` — Route Group (parentheses)

```
app/
  (auth)/
    layout.tsx    ← wraps /dashboard, /picking, /handover, etc.
    dashboard/
      page.tsx    ← accessible at /dashboard (NOT /auth/dashboard)
```

**What it does:** The parentheses tell Next.js "this folder is for organizing, NOT for the URL." So `(auth)/dashboard/page.tsx` maps to `/dashboard`, not `/auth/dashboard`.

**Why it exists:** It lets you apply a shared layout (Topbar + Sidebar) to multiple pages without adding `/auth/` to every URL. The `layout.tsx` inside `(auth)/` wraps all its children.

### `[id]` — Dynamic Segment (brackets)

```
app/
  picking/
    [id]/
      page.tsx    → /picking/12626315209
```

The `[id]` folder means "this part of the URL is a variable." Inside `page.tsx`, you access it via `params.id`. In this project it's used for viewing individual picking lists, handovers, and dealer items.

### `layout.tsx` — Layout Files

Layouts wrap their sibling/child routes and **persist across navigation**. When you navigate from `/picking` to `/picking/123`, the layout stays mounted — only the `page.tsx` content swaps.

This project has two layouts:

| Layout | File | Wraps | Purpose |
|--------|------|-------|---------|
| Root | `app/layout.tsx` | Everything | `<html>`, `<body>`, AuthProvider, DarkModeProvider |
| Auth | `app/(auth)/layout.tsx` | All authenticated pages | Topbar, Sidebar, mobile drawer, auth redirect |

---

## How Layout Nesting Works

```
app/layout.tsx                    ← RootLayout (always rendered)
  └─ app/page.tsx                 ← Home (redirects to /login)

  └─ app/login/layout.tsx         ← (none, uses root)
       └─ app/login/page.tsx      ← LoginForm

  └─ app/(auth)/layout.tsx        ← AuthenticatedLayout (Topbar + Sidebar)
       └─ app/(auth)/dashboard/page.tsx
       └─ app/(auth)/picking/page.tsx
       └─ app/(auth)/picking/[id]/page.tsx
       └─ ...etc
```

When you visit `/picking/123`, the rendered component tree is:
```
RootLayout
  └─ AuthenticatedLayout
       └─ PickingDetailPage (with params.id = "123")
```

---

## Component Patterns

### `"use client"` directive

Most components start with `"use client"`. This is because Next.js App Router defaults to **Server Components** (run on the server, send HTML). Since this app uses:
- React hooks (`useState`, `useEffect`, `useContext`)
- Browser APIs (`localStorage`, `window`)
- Event handlers (`onClick`)

...all components need the `"use client"` opt-in to run in the browser.

### Where do I put a new component?

| Situation | Where |
|-----------|-------|
| Used by one feature (picking, dealer, etc.) | Co-locate: `app/(auth)/foo/_components/MyComponent.tsx` |
| Used across multiple features | `src/components/MyComponent.tsx` |
| Utility/helper function | `src/lib/utils.ts` |
| API calls | `src/lib/api.ts` |
| Shared types | `src/lib/types.ts` |
| React Context provider | `src/lib/providers/*-context.tsx` |

---

## Auth Flow

```
1. User visits /dashboard
2. middleware.ts checks for auth_token cookie → not found → redirect to /login
3. User logs in → apiLogin() stores token in localStorage + sets cookie
4. AuthProvider (lib/providers/auth-context.tsx) picks up token → calls apiFetchMe() → sets user state
5. (auth)/layout.tsx renders Topbar + Sidebar + children
```

---

## URL → Component Mapping

| URL | Page Component | Layout |
|-----|---------------|--------|
| `/` | `app/page.tsx` (redirects to /login) | Root |
| `/login` | `app/login/page.tsx` → `login-form.tsx` | Root |
| `/dashboard` | `app/(auth)/dashboard/page.tsx` | Root + Auth |
| `/upload` | `app/(auth)/upload/page.tsx` | Root + Auth |
| `/picking` | `app/(auth)/picking/page.tsx` | Root + Auth |
| `/picking/:id` | `app/(auth)/picking/[id]/page.tsx` | Root + Auth |
| `/handover` | `app/(auth)/handover/page.tsx` | Root + Auth |
| `/handover/:id` | `app/(auth)/handover/[id]/page.tsx` | Root + Auth |
| `/dealer` | `app/(auth)/dealer/page.tsx` | Root + Auth |
| `/dealer/:id` | `app/(auth)/dealer/[id]/page.tsx` | Root + Auth |
| `/debts` | `app/(auth)/debts/page.tsx` | Root + Auth |
| `/debts/pay` | `app/(auth)/debts/pay/page.tsx` | Root + Auth |
| `/history` | `app/(auth)/history/page.tsx` | Root + Auth |
