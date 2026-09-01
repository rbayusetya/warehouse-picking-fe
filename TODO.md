# TODO — Picking Control Gudang

## High Priority

- [x] **Fix auth inconsistency** — Sidebar reads `mock-data` for unconfirmed count; replace with real API call → Done: `useUnconfirmedDealerCount` hook
- [x] **Fix middleware auth vs SPA auth mismatch** — Cookie-only middleware + localStorage SPA auth causes redirect loops. Unify to httpOnly cookie only → Done: migrated to httpOnly cookie auth + proxy.ts
- [x] **Fix `any` types in API** — Replace `any` mapper parameters with proper response types → Done: `response-types.ts` + typed mappers, zero `any` in `lib/api/`
- [ ] **Add error boundaries** — Add `error.tsx` per route segment so runtime errors don't crash the whole page

## Medium Priority

- [x] **Deduplicate navigation** — Extract `<NavLinks>` component from `Sidebar.tsx` and `(auth)/layout.tsx` mobile drawer → Done: `src/components/NavLinks.tsx`
- [x] **Remove dead mock data** — `mock-data.ts` is still imported by Sidebar; either remove it or isolate it behind a dev-only flag → Done: Sidebar no longer imports mock-data
- [x] **Split API by domain** — Monolithic `api.ts` split into `lib/api/{auth,picking,debts,settlement-handovers,dealer}.ts` with barrel `index.ts`
- [ ] **Add data fetching abstraction** — Replace manual `useEffect` + `useState` patterns with React Query or SWR for caching, deduplication, and loading/error states
- [ ] **Add loading/skeleton states** — Pages currently render `null` while fetching; add skeleton placeholders
- [x] **Improve auth security** — Remove localStorage token, use httpOnly cookie only, add token refresh mechanism → Done: localStorage removed, all fetch uses credentials: include

## Low Priority

- [ ] **Add toast/notification system** — Replace inline error banners with a toast library (e.g. `sonner`)
- [ ] **Move dashboard stats to server** — Compute stats server-side instead of fetching all lists client-side
- [ ] **Add confirmation dialogs** — Add `ConfirmModal` for destructive/critical actions (debt payment, handover completion)
- [ ] **Improve mobile responsiveness** — Polish edge cases in mobile drawer and responsive grids

## Done This Session

- ✅ Project structure documentation (`PROJECT_STRUCTURE.md`)
- ✅ Feature-based co-location — moved components to `_components/` folders
- ✅ Context providers moved to `lib/providers/`
- ✅ Nav deduplication — shared `NavLinks` component
- ✅ Mock data removed from Sidebar, replaced with real API hook
- ✅ API split by domain — 6 focused files under `lib/api/`
- ✅ Backend API documentation (`API_DOCUMENTATION.md`) — all 16 endpoints documented
- ✅ API type safety — `response-types.ts` with 15 raw response types, zero `any` in `lib/api/`
- ✅ Handover page fixed — snake_case properties updated to camelCase
- ✅ Middleware migrated to `proxy.ts` (Next.js 16 convention, no more deprecation warning)
- ✅ Auth migrated to httpOnly cookie — removed localStorage token, removed frontend cookie-setting, all fetch uses credentials: include
