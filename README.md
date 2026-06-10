# AdminHub — Next.js Admin Dashboard

A modern, responsive admin dashboard built as an internship assessment project.

**Stack:** Next.js 15 (App Router) · MUI v6 · Zustand · NextAuth.js · TypeScript · DummyJSON API

---

## Features

- 🔐 **Authentication** — NextAuth.js credentials provider via DummyJSON `/auth/login`; JWT session; middleware route protection
- 👥 **Users** — Paginated table with server-side search, single user profile view
- 📦 **Products** — Responsive grid with search, category filter, image carousel, reviews
- ⚡ **Zustand State** — Auth, users, and products stores with async API actions
- 🗄️ **Client-side caching** — In-memory cache per query/page combo; avoids repeat API calls
- 🎨 **MUI v6** — Collapsible sidebar, responsive at all breakpoints
- 🚀 **Performance** — `React.memo`, `useCallback`, `useMemo`, API-side pagination, debounced search

---

## Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd admin-dashboard
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root:

```env
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/login`.

### 4. Demo Credentials

Use any DummyJSON user. The easiest one:

| Field    | Value        |
|----------|-------------|
| Username | `emilys`    |
| Password | `emilyspass`|

---

## Project Structure

```
├── app/
│   ├── api/auth/[...nextauth]/   # NextAuth route handler
│   ├── login/                    # Login page
│   └── dashboard/
│       ├── layout.tsx            # Auth-guarded layout shell
│       ├── page.tsx              # Dashboard home (stats)
│       ├── users/
│       │   ├── page.tsx          # Users list (table, search, pagination)
│       │   └── [id]/page.tsx     # Single user view
│       └── products/
│           ├── page.tsx          # Products grid (search, category, pagination)
│           └── [id]/page.tsx     # Single product (carousel, reviews)
├── components/
│   └── layout/
│       ├── AuthProvider.tsx      # NextAuth SessionProvider wrapper
│       ├── MuiProvider.tsx       # MUI theme + CssBaseline
│       └── DashboardLayout.tsx   # Collapsible sidebar + mobile drawer
├── store/
│   ├── authStore.ts              # Zustand auth state (persisted to localStorage)
│   ├── usersStore.ts             # Users list + single user + cache
│   └── productsStore.ts          # Products list + single product + categories cache
├── lib/
│   ├── api.ts                    # All DummyJSON API calls
│   └── useDebounce.ts            # Debounce hook for search inputs
├── types/
│   └── index.ts                  # TypeScript interfaces (User, Product, Review)
└── middleware.ts                 # Route protection: /dashboard/* requires auth
```

---

## Why Zustand?

- **Zero boilerplate** — no actions, reducers, or dispatch; state is plain functions
- **Built-in async** — just write `async` functions directly in the store, no middleware needed
- **Tiny bundle** (~1KB vs Redux ~10KB+), perfect for small–medium apps
- **Works alongside NextAuth** — we mirror the session token in Zustand so any component can read it via `useAuthStore()` without calling `useSession()` everywhere

## Caching Strategy

Each store maintains an in-memory `cache` object keyed by `"{query}-{skip}-{limit}"` (users) or `"{category}-{query}-{skip}-{limit}"` (products).

Before any API call, the store checks:
```ts
const cached = get().cache[cacheKey];
if (cached) { set({ ...cached }); return; } // Cache hit — no API call
```

**Why:** Avoids re-fetching when the user navigates back to a previously visited page or filter. The cache is session-scoped (in-memory only), so data is always fresh after a full page reload. A "Refresh" button clears the cache on demand.

---

## Build for Production

```bash
npm run build
npm start
```

---

## Environment Variables Reference

| Variable          | Required | Description                          |
|-------------------|----------|--------------------------------------|
| `NEXTAUTH_SECRET` | ✅       | Secret key for signing JWT sessions  |
| `NEXTAUTH_URL`    | ✅       | Base URL of your deployment          |
