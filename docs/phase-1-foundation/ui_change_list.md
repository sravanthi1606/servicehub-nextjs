# Phase 1 — Frontend Foundation: UI Change List

Scope: Next.js frontend foundation only. No Go backend, no real auth, mock data only.

## Starting point

- `frontend/` was a fresh `create-next-app` (Next.js 16.3, React 19.2, TypeScript, App Router) with Tailwind.
- No existing design system, components or conventions to match — this phase establishes them.

## Dependency changes

| Change | Why |
|---|---|
| Remove `tailwindcss`, `@tailwindcss/postcss`, `postcss.config.mjs` | Spec: no Tailwind |
| Add `bootstrap`, `react-bootstrap` | UI framework (dropdowns, later modals) |
| Add `bootstrap-icons` | Icon font (Velzon-like look without Velzon assets) |
| Add `sass` (dev) | SCSS support |

## Design system (new)

- Primary `#4361ee` (4.98:1 on white, AA), page background `#f3f4f8`, dark navy sidebar `#1e2742`.
- Font: Inter via `next/font`.
- Cards: no border, soft shadow, 0.5rem radius.
- Status colours are reserved for booking status and always paired with an icon and a label.
- Breakpoint for desktop vs mobile sidebar: Bootstrap `lg` (992px).

## Files

### Config / global
- `next.config.ts` — Sass options (silence Bootstrap's deprecation noise), `/admin` → `/admin/dashboard` style redirects
- `app/layout.tsx` — root layout, Inter font, Bootstrap Icons, metadata template
- `app/globals.scss` — Bootstrap with our variable overrides + our partials
- `styles/variables.scss`, `layout.scss`, `sidebar.scss`, `navbar.scss`, `dashboard.scss`, `components.scss`

### Types
- `types/user.ts`, `types/service.ts`, `types/booking.ts`, `types/provider.ts`, `types/dashboard.ts`

### Lib
- `lib/constants.ts` — app name, currency, role labels, booking status metadata, category icons
- `lib/navigation.ts` — role → sidebar menu configuration
- `lib/auth.ts` — Phase 1 mock current user per role (replaced by JWT in Phase 5)
- `lib/format.ts` — currency/number/date/time formatting
- `lib/cx.ts` — class name helper
- `lib/mock-data/*` — async mock data per dashboard (same shape the Go API will return)

### Hooks
- `hooks/useMediaQuery.ts` — `useSyncExternalStore` media query (desktop vs mobile sidebar)

### Components
- Layout: `DashboardLayout`, `Sidebar`, `TopNavbar`, `UserMenu`, `Breadcrumb`, `PageHeader`, `ComingSoon`
- Common: `Button` (loading state), `Loading`, `EmptyState`, `ErrorState`, `StatusBadge`, `Avatar`, `SectionCard`
- Dashboard: `StatCard`, `BarChart`, `StatusBreakdown`, `DashboardSkeleton`
- Bookings: `BookingsTable`, `UpcomingBookingsList`
- Providers: `TopProvidersList`
- Services: `ServiceCard`

### Routes
- `app/(public)/page.tsx` — temporary Phase 1 landing with a role picker (real Home page is Phase 2)
- For each of `admin`, `provider`, `customer`:
  - `layout.tsx` — `DashboardLayout` with that role's menu and mock user
  - `dashboard/page.tsx` — role dashboard
  - `loading.tsx` — skeleton, `error.tsx` — error boundary
  - `[...slug]/page.tsx` — "coming in a later phase" placeholder so sidebar links never 404

## States and edge cases

- Every data-driven component has an empty state (empty tables/lists render `EmptyState`).
- Route-level loading (`loading.tsx`) and error (`error.tsx`) per role.
- Sidebar: desktop collapses to icons only; mobile is off-canvas with backdrop, closes on link click, backdrop click and Escape; off-screen links are `inert`.
- Long names truncate in the navbar; tables scroll horizontally on small screens.
- Booking dates are date-only strings and formatted in UTC so they never shift by a day.

## Ambiguities — defaults chosen (flag if wrong)

1. **Currency** — USD, set in one constant (`CURRENCY`).
2. **Provider model** — not defined in the spec; provisional fields: specialization, rating, completedJobs, verified.
3. **Logout in Phase 1** — returns to the landing page; real token clearing comes in Phase 5.
4. **Global search / notifications in navbar** — left out; they would be non-functional until Phase 9, and notifications are out of scope.
5. **Modal** — not built yet; it will be added in Phase 6 when accept/reject needs confirmation.
