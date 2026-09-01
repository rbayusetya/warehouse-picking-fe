# TODO — Picking Control Gudang

## High Priority

- [ ] **Fix auth inconsistency** — Sidebar reads `mock-data` for unconfirmed count; replace with real API call
- [ ] **Fix middleware auth vs SPA auth mismatch** — Cookie-only middleware + localStorage SPA auth causes redirect loops. Unify to httpOnly cookie only
- [ ] **Fix `any` types in `api.ts`** — Replace `any` mapper parameters with `unknown` + validation, or define response types
- [ ] **Add error boundaries** — Add `error.tsx` per route segment so runtime errors don't crash the whole page

## Medium Priority

- [ ] **Deduplicate navigation** — Extract `<NavLinks>` component from `Sidebar.tsx` and `(auth)/layout.tsx` mobile drawer
- [ ] **Add data fetching abstraction** — Replace manual `useEffect` + `useState` patterns with React Query or SWR for caching, deduplication, and loading/error states
- [ ] **Add loading/skeleton states** — Pages currently render `null` while fetching; add skeleton placeholders
- [ ] **Improve auth security** — Remove localStorage token, use httpOnly cookie only, add token refresh mechanism
- [ ] **Remove dead mock data** — `mock-data.ts` is still imported by Sidebar; either remove it or isolate it behind a dev-only flag

## Low Priority

- [ ] **Add toast/notification system** — Replace inline error banners with a toast library (e.g. `sonner`)
- [ ] **Move dashboard stats to server** — Compute stats server-side instead of fetching all lists client-side
- [ ] **Add confirmation dialogs** — Add `ConfirmModal` for destructive/critical actions (debt payment, handover completion)
- [ ] **Improve mobile responsiveness** — Polish edge cases in mobile drawer and responsive grids
