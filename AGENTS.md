<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# MentorLagbe — AGENTS.md (Single Source of Truth)

> Read this file before making any change. It describes the whole project: two
> repositories, one frontend and one backend. Keep this file updated whenever
> architecture, status, or decisions change.

## 1. Project Overview

MentorLagbe is a tuition/mentorship marketplace assignment project (Programming Hero).

- **Students** search & filter approved tuition posts and apply for sessions.
- **Tutors** post tuition listings (with an IMGBB banner image) and manage incoming applications.
- **Admins** approve/reject tuition posts and track Stripe revenue (user-role
  management is planned but not built yet).
- **Pro plan**: both tutors and students can upgrade to a paid "pro" plan through Stripe
  (one-time: $15 tutor / $10 student, verified via `/payment/success`).

Design rules for this project (non-negotiable):

1. Do not over-engineer. Keep it beginner-friendly — this is an assignment.
2. Prefer simple, readable code over advanced architecture.
3. No unnecessary libraries.
4. Clean, simple, functional UI. No excessive animations or fancy design.
5. Reuse existing frontend components and patterns (`src/components/ui/*`, dashboard layout, toasts).
6. **Never break the existing authentication or role-based dashboard functionality.**
7. Backend must be protected with JWT verification; create reusable middleware
   (`verifyToken`, `requireRole`).
8. **Never trust the role sent from the frontend.** Authorization is always
   checked in the backend from the verified JWT.
9. Students can only access their **own** applications. Admins can access all
   users, all tuitions, all tutors, and all applications.
10. Use the shared light/dark palette in `src/app/globals.css`: light
     background `#F0F2E9`, card `#FFFFFF`, foreground `#171F1B`, muted text
     `#526052`, border `#DCE3D8`, and primary `#B5D66B` (hover `#A2C451`);
     dark background `#171F1B`, card `#29372E`, foreground `#F0F2E9`, muted
     text `#C3CCC3`, border `#35463A`, with the same primary colors.

## 2. Repository Layout

Two separate git repositories, side by side:

```
All Assignments Answers/
├── mentorlagbe-client/   # Next.js frontend (this repo, has AGENTS.md)
└── mentorlagbe-server/   # Express backend (separate repo)
```

## 3. Current Architecture

### Frontend stack (`mentorlagbe-client`)

| Item            | Value                                             |
| --------------- | ------------------------------------------------- |
| Framework       | Next.js **16.4.6** (App Router, Turbopack)        |
| Language        | TypeScript (strict)                               |
| Styling         | Tailwind CSS **4.3** (`@tailwindcss/turbopack`)   |
| UI kit          | shadcn/ui (full set in `src/components/ui/`)      |
| Auth client     | Better Auth **1.7.25** + MongoDB adapter          |
| Toasts          | sonner                                            |
| Theme           | next-themes (`ThemeProvider`, `ThemeToggle`)      |
| State           | React hooks only — no Redux/Zustand               |
| Data fetching   | plain `fetch` via `src/lib/api.ts` + `src/lib/actions.ts` (no data-fetching library) |
| Payments        | `stripe` server SDK (`src/lib/stripe.ts`) — no stripe.js / no `@stripe/stripe-js` usage |
| Dev port        | `http://localhost:3000`                           |

Key frontend files:

- `src/lib/auth.ts` — Better Auth **server** config (MongoDB adapter, `signupRole` + `plan` additional fields, `admin()` + `jwt()` plugins; assigns the server-managed `role` on signup).
- `src/lib/auth-client.ts` — Better Auth **client** (`authClient`, `signIn`, `signUp`, `useSession`, `jwtClient`).
- `src/lib/jwt-token.ts` — retrieves `/api/auth/token`, caches the JWT in memory until shortly before expiry, and clears it on sign-out.
- `src/lib/api.ts` — `apiGet<T>(path)` for GET requests (attaches a Bearer token when signed in; parses `{ success, message, data }`).
- `src/lib/actions.ts` — `apiPost` / `apiPatch` / `apiDelete` (attach a Bearer token) + `isPlanLimitError()` (detects 403 plan-limit messages to show an upgrade CTA).
- `src/lib/imgbb.ts` — `uploadToIMGBB(file)` → posts to `api.imgbb.com`, returns the public URL (D4).
- `src/lib/stripe.ts` — `server-only` Stripe SDK instance (used only by the sample `checkout_sessions` route).
- `src/app/api/auth/[...all]/route.ts` — Better Auth HTTP handler (all auth endpoints live under `/api/auth/*`).
- `src/app/api/checkout_sessions/route.ts` — **dead sample** Stripe route (hard-coded price ID, not called by any page — see known issues).
- `src/components/auth/LoginForm.tsx`, `SignupForm.tsx` — wired to Better Auth (email/password + Google button).
- `src/app/(root)/page.tsx` — homepage: `Hero` + `TrustStrip` + `FeaturedTuitions` + `PlanSection`.
- `src/app/(root)/tuitions/page.tsx` — browse page (client-side search/subject/class/mode/fee filters), `tuitions/[id]` — detail page + apply dialog.
- `src/app/(root)/pricing/page.tsx`, `how-it-works/page.tsx`, `payment/success/page.tsx` — pricing (PlanSection), static how-it-works, Stripe verify page.
- `src/app/(dashboard)/layout.tsx` — dashboard shell (sidebar + header); student/tutor/admin child layouts enforce roles server-side.
- `src/components/dashboard/shared/DashboardSidebar.tsx` — role-aware nav (student/tutor/admin), sign-out.
- `src/components/dashboard/shared/DashboardHeader.tsx` — page title, search, notifications, user dropdown.
- `src/components/dashboard/shared/DashboardPageHeader.tsx`, `OverviewCards.tsx` — shared page banner (`StatCard` / `ActionRow`) used by all dashboard pages.
- `src/components/providers/SavedTuitionsProvider.tsx` — global bookmark state (ids + `toggleSave`) for `TuitionCard` / saved page.
- `src/components/shared/PlanSection.tsx` — Free vs Pro pricing; "Upgrade to Pro" → `POST /api/payments/checkout` → `window.location.href = url`.

### Backend stack (`mentorlagbe-server`)

| Item            | Value                                              |
| --------------- | -------------------------------------------------- |
| Runtime         | Node.js, ESM (`"type": "module"`)                  |
| Framework       | Express **5.3**                                    |
| Database        | MongoDB Atlas via official `mongodb` driver **7**  |
| Auth            | Better Auth JWT, verified by Express with `jose` and JWKS middleware |
| Entry file      | `src/server.js` (`src/app.js` holds the app)       |
| Scripts         | `npm start` / `npm run dev` (node --watch)         |
| Port            | `process.env.PORT \|\| 5000`                       |
| DB name         | `mentorlagbe`                                      |

**Backend folder structure (as implemented):**

```
mentorlagbe-server/
├── index.js                  # thin wrapper -> imports src/server.js (compat)
├── src/
│   ├── config/
│   │   └── db.js              # connectToMongoDB() + getDb() + 5 collection refs
│   ├── middleware/
│   │   ├── notFound.js        # 404 handler for unknown routes
│   │   ├── errorHandler.js    # global error handler (always last)
│   │   ├── ensureDatabase.js  # lazily initializes MongoDB for serverless requests
│   │   ├── verifyToken.js     # EdDSA JWT verification via Better Auth JWKS
│   │   └── requireRole.js     # role authorization middleware
│   ├── routes/
│   │   ├── healthRoutes.js    # GET /api/health
│   │   ├── users.js           # GET /api/users/stats (admin), sample GET /api/users
│   │   ├── tuitions.js        # full tuition CRUD + moderation (implemented)
│   │   ├── applications.js    # apply / list / accept-reject (implemented)
│   │   ├── saved.js           # student bookmarks (implemented)
│   │   └── payments.js        # Stripe checkout + verify + list (implemented)
│   ├── utils/
│   │   ├── ApiError.js        # ApiError class (statusCode + message)
│   │   ├── ApiResponse.js     # ApiResponse.success() standard success reply
│   │   └── plan.js            # getPlan(email) -> "free" | "pro" (plan-limit checks)
│   ├── app.js                 # express app: cors, json, 5 routes, 404, error handler
│   └── server.js              # env validation → MongoDB connect → listen
├── .env                       # DB_URI, PORT, CLIENT_URL, STRIPE_SECRET_KEY (gitignored)
├── .env.example               # placeholder values, no secrets
├── .gitignore                 # node_modules, .env
└── package.json               # start/dev/test scripts; deps include jose
```

Notes:
- `index.js` is only a 3-line compatibility wrapper (`import './src/server.js'`)
  so the old filename still works — all real code lives in `src/`.
- **Five routers are mounted** in `app.js`: `/api/users`, `/api/tuitions`,
  `/api/applications`, `/api/saved`, `/api/payments`. All of them have real
  logic (no comment-only stubs left); only `GET /api/users/:email` and
  `PATCH /api/users/:email/role` from the original plan are missing (profile
  edits go through Better Auth's `updateUser` on the frontend instead).
- **JWT middleware is implemented.** Protected routes verify the Better Auth
  JWT and take identity/role from `req.user`; the health route, public tuition
  listings, payment status boolean, and signature-verified Stripe webhook
  remain intentionally unauthenticated.

Backend foundation status: **foundation + all planned API modules complete**
— Express app, dotenv env validation, CORS (`CLIENT_URL`), `express.json()`,
MongoDB startup connection plus shared lazy initialization for serverless data
routes, 404 + global error
middleware, consistent `{ success, message, data }` response format,
`GET /api/health`, working tuitions / applications / saved / payments /
admin-stats routes, and `verifyToken` / `requireRole` middleware using
Better Auth's JWKS endpoint.

## 4. Authentication Flow (Better Auth — DO NOT REBUILD)

```
Signup/Login (Next.js)
   └─ better-auth client: signUp.email() / signIn.email()
        └─ /api/auth/* (route.ts) → MongoDB `user` collection (singular!)
             └─ session cookie stored in the browser
             └─ profile edits: authClient.updateUser() / changePassword()
                (UpdateProfileForm — Better Auth writes the doc directly)

Frontend calls the Better Auth token endpoint when signed in
   └─ GET /api/auth/token   (Better Auth jwt plugin, requires session cookie)
        └─ returns { token: "<JWT>" }   ← signed session user token, cached in memory
             (includes id, email, name, role)

Express API calls                          ← CLIENT SENDS TOKEN; SERVER VERIFIES IT
   └─ Authorization: Bearer <JWT>
        └─ verifyToken middleware → JWKS verification (see Decision D2)
             └─ req.user = { id, email, role }   ← trusted, server-signed
```

> JWT issuance, client sending, and Express verification are implemented.
> Protected routes use the verified `req.user`; the health route, public
> tuition listings, payment status boolean, and signature-verified Stripe
> webhook remain intentionally accessible without a Bearer token.

- Better Auth owns **signup, login, session, password, profile update** — nothing else does.
- The Better Auth admin plugin owns the server-managed `role` field stored on
  the user document. Signup accepts a validated `signupRole` (`student` |
  `tutor`) additional field; the server hook maps it to `role`, so clients
  cannot choose `admin`. `plan` (`free` | `pro`, default `free`) is another
  additional field with `input: false`, so only the server can set it.
- Better Auth stores its documents in the **`user`** collection (singular) —
  see known issue #6 for the `users` vs `user` mismatch in `db.js`.
- `admin` is **not** selectable at signup (see Decision D3).
- The frontend never sends a role of its own authority; the backend reads the
  role only from the verified JWT.

## 5. Authorization Flow (Express middleware)

Reusable middleware in `mentorlagbe-server/src/middleware/`:

1. **`verifyToken`** — reads `Authorization: Bearer <token>`, verifies the JWT
   (signature + expiry), attaches `req.user = { id, email, role }`. Rejects
   with 401 otherwise.
2. **`requireRole("admin")` / `requireRole("tutor", "student")`** — checks
   `req.user.role` against an allowed list, rejects with 403 otherwise.

Permission matrix (enforced by route middleware and ownership filters):

| Action                                   | student | tutor | admin |
| ---------------------------------------- | :-----: | :---: | :---: |
| Browse approved tuitions                 |   ✅    |  ✅   |  ✅   |
| Post a tuition                           |   ❌    |  ✅   |  ✅   |
| Edit own tuitions / set is-active        |   ❌    |  ✅   |  ✅   |
| Approve / reject any tuition             |   ❌    |  ❌   |  ✅   |
| Apply to a tuition                       |   ✅    |  ❌   |  ❌   |
| Save / unsave (bookmark) a tuition       |   ✅    |  ❌   |  ❌   |
| View **own** applications                |   ✅    |  ❌   |  ❌   |
| View applications for **own** tuitions   |   ❌    |  ✅   |  ✅   |
| Update application status (own tuitions) |   ❌    |  ✅   |  ✅   |
| View all users / change roles            |   ❌    |  ❌   |  ✅   |
| View all payments (revenue)              |   ❌    |  ❌   |  ✅   |
| Update own profile (name, image, password) | ✅    |  ✅   |  ✅   |
| Upgrade to pro (Stripe)                  |   ✅    |  ✅   |  ❌   |

Ownership rules: tutors may only touch their own tuition posts and associated
applications; students may only read their own applications and saved
tuitions. Admin routes are explicitly role-gated.

## 6. User Roles

- **student** — searches tuitions, applies, tracks own application status.
- **tutor** — posts tuitions, manages own listings and their applicants.
- **admin** — approves/rejects tuitions, sees all data and Stripe revenue,
  and manages users (list / change role / ban) through the Better Auth admin
  plugin (D9). Not created via signup; assigned in the DB (D3).

## 7. Database Collections (MongoDB, db: `mentorlagbe`)

### 7.1 `user` — Better Auth's collection (singular!), profile update, admin role change, Stripe verify

> **Actual collection name is `user` (singular)** — that is what Better Auth
> creates and what every route reads (`db.collection('user')`). The
> `usersCollection` export in `db.js` points at `users` (plural) and is
> **never imported** — dead code, see known issue #6.

| Field       | Type   | Notes                                   |
| ----------- | ------ | --------------------------------------- |
| name        | string | required — editable via `updateUser`    |
| email       | string | unique, required                        |
| image       | string | profile photo (IMGBB URL) — editable via `updateUser` |
| role        | string | `student` \| `tutor` \| `admin`         |
| plan        | string | `free` \| `pro` — additionalField with `input: false`; only the Stripe verify endpoint writes `pro` |
| createdAt   | date   | Better Auth manages                     |

> `phone` / `bio` from the original spec are **not implemented**: they are not
> declared as `additionalFields`, no form sends them, and nothing reads them.
> The profile page only edits **name + image** (`authClient.updateUser()`)
> and **password** (`authClient.changePassword()`) — there is no
> `/api/users/profile` endpoint. (`studentPhone` on *applications* is a
> different, real field — it comes from the apply dialog.)

### 7.2 `tuitions` — created and managed by tutor, approved/rejected by admin

| Field          | Type   | Notes                                    |
| -------------- | ------ | ---------------------------------------- |
| title          | string | required                                 |
| subject        | string | required                                 |
| classLevel     | string | required                                 |
| mode           | string | `online` \| `offline`                    |
| location       | string | shown for offline mode (server does not require it) |
| monthlyFee     | number | required                                 |
| daysPerWeek    | number | required                                 |
| bannerImage    | string | public URL returned by the tutor's direct IMGBB banner upload |
| description    | string | required                                 |
| tutorName      | string | from the verified JWT user                     |
| tutorEmail     | string | from the verified JWT user — ownership key     |
| approvalStatus | string | `pending` \| `approved` \| `rejected` (server-forced `pending` on create) |
| isActive       | bool   | tutor can toggle via `PATCH /:id` (open/close) |
| createdAt      | date   | server-set (client value ignored) |

Server rules enforced in `POST /api/tuitions`: required fields, `approvalStatus`
and `createdAt` are **never** taken from the body, and free-plan tutors are
limited to **2 posts** (`getPlan()` → 403 with an upgrade message).
List endpoints (`GET /`, `/latest`, `/:id`) return only
`approvalStatus: 'approved' && isActive: true`. Responses attach `tutorPlan`
(`free`/`pro`) so the frontend can render the golden PRO badge.
Server-side search filters are **not** implemented — the `/tuitions` page
filters client-side.

### 7.3 `applications` — submitted by student, status updated by tutor

| Field            | Type   | Notes                                    |
| ---------------- | ------ | ---------------------------------------- |
| tuitionId        | string | ref to tuitions                          |
| tuitionTitle     | string | snapshot                                 |
| subject          | string | snapshot                                 |
| monthlyFee       | number | snapshot                                 |
| tutorEmail       | string | used for tutor ownership check           |
| studentName      | string | from the verified JWT user                |
| studentEmail     | string | from the verified JWT user — ownership key |
| studentPhone     | string | form input                               |
| preferredSchedule| string | form input                               |
| studentNote      | string | form input                               |
| status           | string | `pending` \| `accepted` \| `rejected`    |
| appliedAt        | date   |                                          |

Server rules in `POST /api/applications`: rejects a second application to the
same tuition (`400 already applied`) and limits free-plan students to
**5 applications** (403 upgrade message). `status` starts `pending`; only
`accepted`/`rejected` are valid on the tutor's `PATCH`.

### 7.4 `payments` — created by the Stripe **webhook** (source of truth)

| Field         | Type   | Notes                                  |
| ------------- | ------ | -------------------------------------- |
| userEmail     | string | from checkout session metadata         |
| userName      | string | from `user` doc / Stripe customer      |
| userRole      | string | `student` \| `tutor`                   |
| planName      | string | `Pro Tutor Plan` \| `Pro Student Plan` |
| amount        | number | dollars (e.g. `15` tutor / `10` student) |
| currency      | string | `usd`                                  |
| transactionId | string | Stripe payment intent id               |
| stripeSessionId | string | **unique index** — idempotency key   |
| paymentStatus | string | `paid`                                 |
| paidAt        | date   |                                          |

Flow (webhook, see D8):
`POST /api/payments/checkout` creates a session (amount by role, metadata
`{userEmail, userRole}`, success URL `/payment/success?session_id=…`) →
Stripe hosted page → Stripe POSTs `checkout.session.completed` to
`POST /api/payments/webhook` (mounted with `express.raw()` **before**
`express.json()`, signature verified against `STRIPE_WEBHOOK_SECRET`) →
server upserts the `payments` doc (unique index on `stripeSessionId` makes
Stripe's retries/double deliveries safe) and sets `user.plan = 'pro'`.
The success page only **polls the read-only** `GET /api/payments/status`
(`{ recorded: boolean }`, no Stripe call, no writes) until the row appears —
it can never create or change anything itself.

### 7.5 `savedTuitions` — student bookmarks (new module)

| Field       | Type   | Notes                                    |
| ----------- | ------ | ---------------------------------------- |
| tuitionId   | string | tuition `_id` as a **string**            |
| studentEmail| string | ownership key from the verified JWT              |
| savedAt     | date   | sort key (newest first)                  |

Rules: one row per (tuitionId, studentEmail) — `400 already saved` on
duplicates; free students capped at **5 bookmarks** (403 upgrade message);
`GET /api/saved` joins back to `tuitions` and returns only approved + active
docs, keeping the newest-saved order.

## 8. API Modules (`mentorlagbe-server/src/routes/`)

Base URL: `https://mentorlagbe-server-bay.vercel.app` (local development can override it with `NEXT_PUBLIC_API_URL`).

> Protected Express routes require `Authorization: Bearer <JWT>` and enforce
> roles/ownership from its verified claims. Public routes are marked public;
> payment status returns only a boolean, and the Stripe webhook verifies its
> own signature.

| Module        | Method + Path                                  | Intended access | Status |
| ------------- | ---------------------------------------------- | --------------- | ------ |
| **auth token**| `GET /api/auth/token` (Better Auth, client)    | session cookie  | ✅ plugin + frontend token cache |
| **users**     | `GET /api/users/stats` (dashboard numbers)     | admin           | ✅     |
|               | `GET /api/users`                               | admin           | ✅ sample (returns `data: null`) |
|               | `GET /api/users/:email`                        | self / admin    | ⬜ not needed yet |
|               | `PATCH /api/users/profile`                    | self            | ❌ not built — profile goes through Better Auth `updateUser` |
|               | `PATCH /api/users/:email/role`                | admin           | ➖ superseded by Better Auth admin plugin (D9) |
| **admin plugin** | `GET /api/auth/admin/list-users`, `POST .../set-role`, `.../ban-user`, `.../unban-user` (Better Auth) | admin session | ✅ powers `dashboard/admin/users` |
| **tuitions**  | `POST /api/tuitions`                           | tutor/admin     | ✅ (identity from JWT; free tutor = max 2) |
|               | `GET /api/tuitions` (approved + active)        | public          | ✅ (server-side filters ⬜ — filtering is client-side) |
|               | `GET /api/tuitions/latest` (6 newest)          | public          | ✅     |
|               | `GET /api/tuitions/mine`                       | tutor own posts | ✅     |
|               | `GET /api/tuitions/all` (all statuses)         | admin           | ✅     |
|               | `GET /api/tuitions/:id`                        | public          | ✅     |
|               | `PATCH /api/tuitions/:id` (edit + `isActive`)  | owner tutor/admin | ✅ |
|               | `PATCH /api/tuitions/:id/status`               | admin           | ✅ (approve/reject/reinstate) |
|               | `DELETE /api/tuitions/:id`                     | owner tutor/admin | ✅ |
| **applications** | `POST /api/applications`                    | student         | ✅ (no dupes, free = max 5; identity/snapshot from server) |
|               | `GET /api/applications/mine`                   | student own     | ✅ |
|               | `GET /api/applications/tutor`                  | tutor own posts/admin all | ✅ |
|               | `PATCH /api/applications/:id/status`           | owner tutor/admin | ✅ (accepted/rejected) |
| **saved**     | `GET /api/saved`                               | student own     | ✅ (approved+active join) |
|               | `POST /api/saved`                              | student         | ✅ (free = max 5) |
|               | `DELETE /api/saved`                            | student own      | ✅     |
| **payments**  | `POST /api/payments/checkout`                  | student/tutor   | ✅ ($15 tutor / $10 student; identity from JWT) |
|               | `POST /api/payments/webhook`                   | Stripe (signature-verified, raw body) | ✅ **source of truth**: records payment + flips `plan` |
|               | `GET /api/payments/status?sessionId=`          | anyone (read-only) | ✅ returns `{ recorded }` — success page polls it |
|               | `GET /api/payments`                            | admin           | ✅ (empty until a real checkout happens) |
| **upload**    | IMGBB from the browser (D4)                    | —               | ✅ `src/lib/imgbb.ts` — used for profile photos and tuition banners |

## 9. Environment Variables

### `mentorlagbe-client/.env` (gitignored) — actual keys present today

```
BETTER_AUTH_SECRET=...            # Better Auth signing secret
BETTER_AUTH_URL=http://localhost:3000
DB_URI=mongodb+srv://...          # same Atlas cluster, db: mentorlagbe
NEXT_PUBLIC_API_URL=https://mentorlagbe-server-bay.vercel.app   # ✅ used by api.ts / actions.ts
NEXT_PUBLIC_IMGBB_API_KEY=...              # ✅ profile photo + tuition banner uploads (D4)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...     # present but UNUSED (no stripe.js)
STRIPE_SECRET_KEY=...             # present but only the dead sample
                                   # checkout_sessions route reads it
```

### `mentorlagbe-server/.env` (gitignored) — actual keys present today

```
DB_URI=mongodb+srv://...          # ✅ present (secret — never commit)
PORT=5000                         # ✅ present, defaults to 5000
CLIENT_URL=http://localhost:3000  # ✅ present, used by CORS + Stripe return URLs
STRIPE_SECRET_KEY=sk_test_...     # ✅ present, used by src/routes/payments.js
STRIPE_WEBHOOK_SECRET=whsec_...   # ✅ key added — VALUE still empty, must be
                                   #   filled in or webhook rejects deliveries
```

Notes:
- `.env.example` on the server lists `DB_URI`, `PORT`, `CLIENT_URL`,
  optional `BETTER_AUTH_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
  (placeholders, no real secrets).
- **Webhook delivery setup** (required for Pro upgrades to complete):
  - *Production*: Stripe Dashboard → Developers → Webhooks → add endpoint
    `https://<your-domain>/api/payments/webhook` → copy the **Signing
    secret** (`whsec_…`) into `STRIPE_WEBHOOK_SECRET`.
  - *Local dev*: `stripe listen --forward-to localhost:5000/api/payments/webhook`
    (Stripe CLI) and use the `whsec_…` it prints.
  - If the secret is missing the server still boots (warning only) and the
    webhook responds `500 STRIPE_WEBHOOK_SECRET is missing…`.
- `BETTER_AUTH_URL` is an optional server override for the JWKS origin;
  verification defaults to `CLIENT_URL`.
- `src/server.js` validates required vars (`DB_URI`, `CLIENT_URL`) at startup
  and exits with a clear message if any are missing; a missing
  `STRIPE_WEBHOOK_SECRET` only prints a warning. Stripe's secret key is
  validated lazily per-request (`getStripe()` throws a 500 `ApiError` if the
  key is missing — the server still boots without it).

## 10. Current Implementation Status

### ✅ Completed

**Frontend**

- Next.js 16 + TS + Tailwind 4 + shadcn/ui project setup, theming (light/dark),
  shared palette (rule #10), `surface-3d` 3D card effects.
- Better Auth server config (MongoDB adapter, `signupRole` + `plan` additional
  fields; `role` is managed by the admin plugin), client, signup form
  (role picker: student/tutor), login form,
  auth API route (`/api/auth/[...all]`).
- **Public pages**: homepage (`Hero` + `TrustStrip` + `FeaturedTuitions` +
  `PlanSection`), `/tuitions` browse with client-side filters,
  `/tuitions/[id]` detail + apply dialog + share/bookmark, `/pricing`,
  `/how-it-works` (static), `/payment/success` (Stripe verify), footer with
  quick links.
- **API layer**: `src/lib/api.ts` (GET) + `src/lib/actions.ts` (POST/PATCH/
  DELETE + `isPlanLimitError`) — every page uses these; attaches the cached
  Better Auth JWT as a Bearer token when signed in and parses the consistent
  `{ success, message, data }` envelope.
- **JWT client flow**: Better Auth `jwt()` / `jwtClient()` are configured;
  login retrieves a token from `/api/auth/token`, shared API helpers attach
  it, and sign-out clears the in-memory token cache. Express verification is
  still pending.
- **Dashboard shell**: role-aware sidebar (per-role nav incl. Saved Tuitions,
  Applicants, moderation links), header (page title, search, notifications,
  user menu), `DashboardPageHeader` + `OverviewCards` shared pieces,
  skeletons, sonner toasts.
- **Route states**: root and public-page loading skeletons, a dashboard loading
  skeleton, a themed root `not-found.tsx` page, and a client `error.tsx`
  boundary with retry and Back to Home actions.
- **Student**: overview (stats + quick actions), My Applications (status
  badges, refresh), Saved Tuitions (bookmark grid), profile page
  (name/photo via IMGBB + change password).
- **Tutor**: overview, Post a Tuition (form + direct IMGBB banner upload →
  POST → redirect, plan-limit CTA), My Tuitions (table + View/Edit/Delete
  dialogs + `isActive` switch),
  Applicants (accept/reject with toasts), profile page.
- **Admin**: overview (`GET /api/users/stats`: users/tutors/students/pending/
  revenue), Tuitions moderation (Pending/Approved/Rejected/All tabs +
  Approve/Reject/Reinstate), Transactions (`GET /api/payments` table),
  profile page.
- **User Management** (`dashboard/admin/users`): shadcn table (avatar, role
  badge, status, joined date, search box) driven by the Better Auth **admin
  plugin** — `authClient.admin.listUsers` (server-side list),
  `admin.setRole` (role dropdown), `admin.banUser` / `admin.unbanUser`
  (Ban button). No Express route was needed; the endpoints live at
  `/api/auth/admin/*` and check the admin role server-side.
- **Bookmarks**: `SavedTuitionsProvider` context (ids, `toggleSave`) wired
  into `TuitionCard`, tuition detail, and the saved page; 403 plan-limit
  messages trigger an upgrade prompt.
- **Stripe pro plan**: `PlanSection` "Upgrade to Pro" →
  `POST /api/payments/checkout` → `window.location.href = session.url` →
  Stripe fires the webhook (records payment + sets `plan: 'pro'`) →
  `/payment/success` polls `GET /api/payments/status` until the row appears
  (new "processing" state with Check again after ~18s), force-refreshes the
  Better Auth session from the database, then shows success.
  Prices: $15 tutor / $10 student (one-time).
- Navbar (role badge, dashboard/profile links, theme toggle, mobile sheet)
  and Footer. `next.config.ts` allows **all image hosts** (http + https).

**Backend** (see section 3 for folder structure)

- Foundation: `src/server.js` (env validation → MongoDB connect → listen),
  `src/app.js` (CORS `CLIENT_URL`, `express.json()`, 5 routers, 404 +
  global error handler in order), `src/config/db.js` (`connectToMongoDB` /
  `getDb` + 5 collection refs + **unique index on
  `payments.stripeSessionId`**), `ensureDatabase` lazily initializes and
  reuses a MongoDB connection for serverless requests, `notFound` /
  `errorHandler` middleware,
  `ApiResponse` / `ApiError`, `.env.example`, `npm start` / `npm run dev`,
  `index.js` compat wrapper.
- `src/utils/plan.js` — `getPlan(email)` → `free`/`pro` (used by all three
  plan-limit checks: 2 posts / 5 bookmarks / 5 applications).
- **Route modules all implemented**: `tuitions.js` (9 endpoints incl.
  moderation, `withTutorPlan` PRO-badge join), `applications.js` (4),
  `saved.js` (3), `payments.js` (checkout/webhook/status/list), `users.js`
  (`/stats` + sample), `healthRoutes.js`.
- Consistent response shape everywhere: `{ success, message, data? }`.
- **JWT authorization**: `verifyToken` validates Better Auth EdDSA JWTs against
  the remote JWKS endpoint; `requireRole` and route-level ownership filters
  protect private endpoints. Public tuition reads, health, payment status, and
  the signature-verified Stripe webhook remain intentionally accessible.
- **JWT tests**: Node's built-in test runner covers valid/invalid/expired
  tokens, role checks, and protected-vs-public route behavior.
- **Dependencies**: express, cors, dotenv, mongodb, `stripe`, and `jose`
  (server).

#### Backend test results (actually run on 2026-11-21)

> Historical snapshot from the foundation phase — newer routes (saved,
> payments, applications, `/tuitions/all`, `/latest`, `/:id`) have **not**
> been through this table; verify them manually before relying on it.

| Test                                   | Result                                                                 |
| -------------------------------------- | ---------------------------------------------------------------------- |
| `npm start` (server startup)           | ✅ `Server is running on port 5000`                                    |
| `node index.js` (compat wrapper)       | ✅ also starts the server correctly                                     |
| MongoDB connection (real Atlas cluster)| ✅ `You successfully connected to MongoDB!`                            |
| `GET /api/health`                      | ✅ 200 `{"success":true,"message":"MentorLagbe API is running","data":{"status":"OK"}}` |
| `GET /api/users` (sample endpoint)     | ✅ 200 `{"success":true,"message":"users retrived successfully","data":null}` |
| `POST /api/tuitions` (valid body)      | ✅ 201, stored with `approvalStatus:"pending"` (server-forced)         |
| `POST /api/tuitions` (injection attempt: client sent `approvalStatus:"approved"`, fake `createdAt`) | ✅ 201 but server overwrote both → `pending` + real date |
| `POST /api/tuitions` (missing fields)  | ✅ 400 `{"success":false,"message":"title, subject, classLevel and monthlyFee are required"}` |
| `GET /api/tuitions`                    | ✅ 200, returns **only** `approved` docs (pending test doc was hidden) |
| `GET /api/tuitions/mine?tutorEmail=…`  | ✅ 200, returns only that tutor's posts (newest first)                 |
| `GET /api/tuitions/mine` (no email)    | ✅ 400 `tutorEmail query param is required`                            |
| Frontend `npm run build`               | ✅ compiled + TypeScript passed (route count since changed — re-run before relying on it) |
| Stub route `/api/applications`        | ✅ 404 *at the time* — **now implemented**, this row is obsolete |
| Unknown route `GET /api/does-not-exist`| ✅ 404 `{"success":false,"message":"Route not found: GET /api/does-not-exist"}` |
| Invalid JSON POST (error handler)      | ✅ 400 with `{"success":false,...}` — global handler caught it         |
| CORS header                            | ✅ `Access-Control-Allow-Origin: http://localhost:3000`                |
| Server logs                            | ✅ No runtime errors                                                   |

### 🚧 Placeholders (page exists but is not functional)

- `DashboardHeader` search input ("Search...") and notification bell —
  UI only, no behavior. (The Navbar has no search box.)
- Hero search on the homepage — only shows a toast ("opens in a later
  phase") instead of navigating to `/tuitions` with the query.
- Footer social links, TrustStrip stats (1.5M+ etc.) — static/hard-coded.

> Everything else that used to be a placeholder is now implemented: all
> three dashboard overviews, student my-applications / saved-tuitions,
> tutor applicants / my-tuitions / post-tuition, admin tuitions /
> transactions / **users**, the three profile pages, and the public
> homepage.

### ❌ Not started

- **Server-side search/filter query params** on `GET /api/tuitions`
  (current filtering is client-side in the browser).
- **`phone` / `bio` profile fields** (not declared, not sent, not shown).
- Cleanup: dead `checkout_sessions` route, unused `@stripe/stripe-js` and
  `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, unused `usersCollection` export.

## 11. Implementation Roadmap

**Phase 0 — Foundations** ✅ **complete**

1. ✅ **Backend foundation done** — Express app, env validation, CORS
   (`CLIENT_URL`), `express.json()`, MongoDB connection, 404 + global error
   handler, health check, `.env.example`, `npm start`/`npm run dev` scripts.
2. ✅ Add the `jwt()` plugin from `better-auth/plugins/jwt` to `src/lib/auth.ts`;
   `jwtClient()` is configured in `src/lib/auth-client.ts`.
3. ✅ Client env vars present: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_IMGBB_API_KEY`.
4. ✅ Extend `src/lib/api.ts` / `src/lib/actions.ts` to fetch
   `/api/auth/token`, cache the JWT in memory, and attach
   `Authorization: Bearer` to API requests (keep the same response parsing).
5. ✅ Server: `jose`, `verifyToken` + `requireRole`, and `req.user` identity
   enforcement across tuitions, applications, saved, payments, and users.

**Phase 1 — Users API + admin user management** ✅ **done (admin plugin)**

- ✅ Frontend: `dashboard/admin/users` table — search, role dropdown,
  ban/unban, driven by the Better Auth admin plugin (see D9). The planned
  Express endpoints (`GET /api/users/:email`, `PATCH /api/users/:email/role`)
  were **not built** — Better Auth's `/api/auth/admin/*` routes replace them
  and already enforce the admin role.
- ⬜ (optional) Only revisit a custom users API if Express later needs
  profile data beyond Better Auth's admin plugin.

**Phase 2 — Tuitions API + tutor pages** ✅ **done**

- ✅ Backend: create, list (approved), latest, mine, all, detail, edit +
  `isActive`, admin status, delete.
- ✅ Frontend: post-tuition, my-tuitions (dialogs), admin moderation queue.
- ⬜ Optional: server-side search/filter query params (Phase 4 backend half).

**Phase 3 — Applications API + student/tutor pages** ✅ **done**

- ✅ Backend: apply (no dupes, free = max 5), my applications, tutor's
  applicants, accept/reject.
- ✅ Frontend: student my-applications (status badges + refresh), tutor
  applicants (accept/reject).

**Phase 4 — Homepage search & filters** (partially done ✅)

- ✅ Frontend: `/tuitions` search + subject/class/mode/fee filters
  (client-side), homepage featured list, `SavedTuitionsProvider` bookmarks.
- ⬜ Backend: query-param filters on `GET /api/tuitions` + wire Hero search
  to `/tuitions?q=…`.

**Phase 5 — Stripe pro plan** ✅ **done (webhook flow)**

- ✅ `POST /api/payments/checkout` → `window.location.href = session.url`,
  Stripe → `POST /api/payments/webhook` (raw body + signature check →
  upserts `payments`, sets `plan: 'pro'`), `/payment/success` polls
  `GET /api/payments/status`, admin transactions page reads `payments`,
  `PlanSection` upgrade buttons, plan limits (2/5/5) enforced with
  `getPlan()`.
- ✅ Verified locally: signature accept/reject, unpaid/unknown events
  acknowledged with 200 and ignored, status endpoint read-only.
- ⬜ **User setup step**: fill `STRIPE_WEBHOOK_SECRET` in the server `.env`
  (dashboard signing secret, or `stripe listen` for local dev) — see §9.
- ✅ Checkout is JWT-protected and uses the verified user's email/role.
  Payment status intentionally remains public and only returns whether a
  checkout session has been recorded.

**Phase 6 — Route protection & polish**

- ✅ Dashboard student/tutor/admin layouts enforce server-side role checks
  using a fresh Better Auth session read (cookie cache bypassed); no session
  → `/login`, wrong role → `/unauthorized`.
- ⬜ Fix known issues (section 13): login/signup redirect, `/register` link,
  Google login decision, `users` vs `user` cleanup, dead Stripe sample code.

## 12. Important Decisions

- **D1 — Better Auth is untouchable.** Signup/login/session stay on Better Auth
  + MongoDB. No custom password/JWT auth will be written on the frontend.
- **D2 — JWT comes from Better Auth's own `jwt` plugin** (built into
  better-auth 1.7.25): `GET /api/auth/token` returns `{ token }` for the
  current session; Express verifies it against Better Auth's JWKS endpoint
  (`/api/auth/jwks`, EdDSA) using `jose`. This keeps one auth system and needs
  no shared secret juggling. The plugin, frontend token flow, and Express
  verification are implemented. *Alternative (simpler
  but less standard): HS256 shared secret with `jsonwebtoken` — reconsider
  only if JWKS setup gets confusing.*
- **D3 — Admin users are not self-registered.** Signup offers student/tutor
  only; an admin is promoted directly in the `user` collection (or later via
  an admin API call). Keeps Better Auth config untouched.
- **D4 — IMGBB upload happens from the frontend** directly to
  `https://api.imgbb.com/1/upload` using `NEXT_PUBLIC_IMGBB_API_KEY`; only the
  returned URL is stored in MongoDB. (Alternative: a backend proxy — skip it,
  no benefit for an assignment.) Implemented in `src/lib/imgbb.ts` and used
  for profile photos and tutor tuition banners.
  `next.config.ts` now allows **all http/https image hosts**, so no
  per-host `remotePatterns` entry is needed anymore.
- **D5 — No new frontend libraries.** Stripe checkout = backend creates the
  session, frontend does `window.location.href = session.url`. No stripe.js,
  no data-fetching library, no state manager. (Note: `@stripe/stripe-js` and
  `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` exist in the repo but are unused —
  leftovers to remove, see "Not started" cleanup.)
- **D6 — "Real time" application status = simple refetch/polling**
  (`router.refresh()` or a small `setInterval`), not websockets.
- **D7 — Snapshots in `applications`** (tuitionTitle, subject, fee, tutorEmail)
  so student lists render without joins and ownership checks stay one-line.
- **D8 — Stripe uses a webhook as the source of truth** (changed from an
  earlier verify-endpoint design). Stripe POSTs `checkout.session.completed`
  to `POST /api/payments/webhook`, which is mounted with `express.raw()`
  **before** `express.json()` and verified with
  `stripe.webhooks.constructEvent(rawBody, stripe-signature,
  STRIPE_WEBHOOK_SECRET)`. The handler upserts `payments` (unique
  `stripeSessionId` index = idempotent across Stripe's retries) and sets
  `plan: 'pro'`. The success page does **not** write anything — it only
  polls the read-only `GET /api/payments/status?sessionId=…` until the
  webhook's row appears (amber "processing" + Check again after ~18s), then
  refetches the Better Auth session with `disableCookieCache` so the updated
  plan appears immediately without signing out and back in.
  *Tradeoffs: webhook delivery must be reachable (Stripe dashboard URL in
  prod, `stripe listen` locally — see §9), which is why the success page
  tolerates a slow/absent delivery instead of failing.*
- **D9 — Admin user management uses Better Auth's `admin()` plugin**, not
  Express. `src/lib/auth.ts` adds `plugins: [admin()]` and
  `src/lib/auth-client.ts` adds `adminClient()`, so the page calls
  `authClient.admin.listUsers / setRole / banUser / unbanUser`
  (endpoints `/api/auth/admin/*`, session cookie + admin-role check
  server-side) — no new backend API was needed. A
  `databaseHooks.user.create.before` hook in `auth.ts` maps the validated
  `signupRole` (`student` or `tutor`) to the admin plugin's server-managed
  `role` field. Signup cannot set `role` directly, preventing self-registration
  as `admin` and protecting these admin endpoints (closes the gap behind D3 /
  rule #8).

## 13. Known Issues (fix during the roadmap)

1. **Login redirect**: `LoginForm` sends `callbackURL: "/"` (should be
   `/dashboard/{role}`). Signup now explicitly redirects to `/login` after
   account creation and does not auto-sign-in.
2. ~~**No dashboard route protection**~~ ✅ **resolved** — student, tutor,
   and admin layouts use the server-side `requireRole` guard, which bypasses
   the cookie cache when validating session state.
3. **Google login will fail** — no Google OAuth provider configured in Better
   Auth env. The login button really calls `signIn.social({ provider:
   "google" })` (errors → "Google sign-in failed"); the signup Google button
   is UI-only (toast "available soon"). Configure it or remove both.
4. **Mobile Navbar "Sign Up" links to `/register`** (404 — only `/signup`
   exists). The desktop button is correct; the mobile sheet one is not.
5. ~~`next.config.ts` only allows `images.unsplash.com`~~ ✅ **resolved** —
   `remotePatterns` now allows all http/https hosts.
6. **`users` vs `user` collection mismatch**: `db.js` exports
   `usersCollection = db.collection('users')` (plural) but Better Auth and
   every route use **`user`** (singular). The export is never imported —
   dead code that will confuse anyone who uses it. Either point it at
   `user` or delete it.
7. ~~Server has no `start` script~~ ✅ **resolved** — `npm start` and
   `npm run dev` now exist.
8. **Commit messages can overstate progress** — always verify against this
   file, not the git log.
9. ~~**No endpoint verifies a JWT**~~ ✅ **resolved** — protected Express
   routes verify the token, derive identity from `req.user`, and enforce role
   and ownership checks. Public tuition reads, health, payment status
   (`{ recorded }` only), and the signed Stripe webhook remain deliberate.
10. **Never run `npm run build` while `npm run dev` is running** — mixing
    production build artifacts into `.next` corrupts the dev module graph
    and causes `module factory is not available` / `Could not validate
    instant` errors. If it happens: stop dev, delete `.next`, restart dev,
    hard-reload the browser (`Ctrl+Shift+R`).
11. **Dead Stripe leftovers in the client**: `src/app/api/checkout_sessions/`
    (hard-coded test price ID, nothing calls it), `src/lib/stripe.ts` (only
    it imports `stripe`), the `@stripe/stripe-js` dependency and
    `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` env var are all unused — the real
    flow is server-side in `mentorlagbe-server/src/routes/payments.js`.
    Removing them prevents someone "fixing" payments in the wrong place.
12. **`phone` / `bio` are specified but not implemented** — not declared as
    Better Auth `additionalFields`, no form field, nothing reads them (see
    7.1). The profile flow is currently only name + image + password (the
    permission matrix row was corrected to match). Either implement the
    fields or drop them from the spec.
13. **`STRIPE_WEBHOOK_SECRET` value is empty** (key added, no value) — until
    it is filled in (§9), every Stripe delivery is rejected with 500, the
    success page stays on "processing", and no one becomes Pro. Local dev
    also needs `stripe listen --forward-to localhost:5000/api/payments/webhook`.
    The server prints a startup warning while this is missing.

## 14. Next Recommended Tasks (in order)

1. **Fill `STRIPE_WEBHOOK_SECRET`** (issue #13, 2-minute config task):
   dashboard signing secret or `stripe listen` — until then Pro upgrades
   never complete (§9 has the steps).
2. **Phase 6 polish**: auth redirects (issue #1) + the `/register` link
   (issue #4). Dashboard role checks are implemented in server layouts.
3. **Phase 4 backend**: query-param filters on `GET /api/tuitions` + wire
   the Hero search to `/tuitions?q=…`.
4. Cleanup pass (issues #6, #11): delete dead Stripe sample code, unused
   deps/env, fix or remove `usersCollection`.
5. Decide Google login (issue #3) and `phone`/`bio` (issue #12), then a
   final manual test of the full flows (signup → post → approve → apply →
   accept → upgrade).

---

*Last updated: 2026-11-23 — full project re-read and AGENTS.md brought in
line with the actual code: tuitions/applications/saved/payments APIs and all
dashboard pages are implemented, custom loading and error routes are added,
IMGBB uploads cover profile photos and tuition banners, Stripe now runs on a
**webhook** (D8: signature-verified raw-body endpoint is the source of
truth; the success page only polls a read-only status endpoint — the old
verify endpoint was removed), plan limits (2 posts / 5 bookmarks / 5
applications) are enforced, and the remaining gaps are filling
`STRIPE_WEBHOOK_SECRET`, auth redirect polish, and cleanup
(see sections 10–14). *2026-11-23 (later): user management built with the
Better Auth **admin plugin** — `admin()` + `adminClient()` (D9), the
`dashboard/admin/users` table (list / search / change role / ban) and a
signup hook that blocks self-registered admins. 2026-11-23 (later): added
server JWT plugin/client, in-memory token cache + Bearer headers on API
helpers, and server-side role guards for student/tutor/admin dashboard layouts.*
