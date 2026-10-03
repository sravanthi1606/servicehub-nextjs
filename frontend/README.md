# ServiceHub — Frontend

Next.js 16 (App Router) · React 19 · TypeScript · Bootstrap 5.3 + React Bootstrap · SCSS · Bootstrap Icons

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build + type check
npm run lint
```

Open `/` and pick a role, or go straight to `/admin/dashboard`, `/provider/dashboard` or `/customer/dashboard`.

## Status

**Phase 1 — foundation (done):** dashboard shell, role-based sidebar, three dashboards on mock data.
Pages for later phases show a "coming soon" placeholder inside the dashboard layout.

## Structure

```text
app/
  (public)/page.tsx          Temporary role picker (real Home page in Phase 2)
  admin|provider|customer/
    layout.tsx               DashboardLayout + that role's menu and (mock) user
    dashboard/page.tsx       Role dashboard (Server Component, awaits mock data)
    loading.tsx / error.tsx  Route-level skeleton and error boundary
    [...slug]/page.tsx       "Coming soon" for planned pages, 404 for anything else
  not-found.tsx
  globals.scss               Bootstrap + our variables and partials
components/
  layout/     DashboardLayout, Sidebar, TopNavbar, UserMenu, Breadcrumb, PageHeader, ComingSoon
  common/     Button, Loading, EmptyState, ErrorState, StatusBadge, Avatar, SectionCard
  dashboard/  StatCard, StatGrid, BarChart, StatusBreakdown, DashboardSkeleton
  bookings/   BookingsTable, UpcomingBookingsList
  providers/  TopProvidersList, PerformanceSummary
  services/   ServiceCard
lib/
  navigation.ts   Sidebar menu per role (single source of truth)
  constants.ts    Role labels, booking status colours/icons, currency
  auth.ts         Mock current user (replaced by JWT in Phase 5)
  format.ts       Currency / date / time formatting
  mock-data/      Async functions shaped like the future Go API
hooks/useMediaQuery.ts
types/            User, Service, Booking, Provider, dashboard view models
styles/           variables, layout, sidebar, navbar, components, dashboard
```

Hiding menu items is a UI convenience only — authorization will be enforced by the Go API.
