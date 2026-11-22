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
- **Admins** approve/reject tuition posts, manage user roles, and track Stripe revenue.
- **Pro plan**: both tutors and students can upgrade to a paid "pro" plan through Stripe.

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
| Data fetching   | **None yet** (no `fetch` calls exist anywhere)    |
| Dev port        | `http://localhost:3000`                           |

Key frontend files:

- `src/lib/auth.ts` — Better Auth **server** config (MongoDB adapter, `role` additional field).
- `src/lib/auth-client.ts` — Better Auth **client** (`authClient`, `signIn`, `signUp`, `useSession`).
- `src/app/api/auth/[...all]/route.ts` — Better Auth HTTP handler (all auth endpoints live under `/api/auth/*`).
- `src/components/auth/LoginForm.tsx`, `SignupForm.tsx` — wired to Better Auth (email/password + Google button).
- `src/app/(dashboard)/layout.tsx` — dashboard shell (sidebar + header).
- `src/components/dashboard/shared/DashboardSidebar.tsx` — role-aware nav (student/tutor/admin), sign-out.
- `src/components/dashboard/shared/DashboardHeader.tsx` — page title, search, notifications, user dropdown.
- `src/app/(root)/page.tsx` — public homepage (currently a placeholder).

### Backend stack (`mentorlagbe-server`)

| Item            | Value                                              |
| --------------- | -------------------------------------------------- |
| Runtime         | Node.js, ESM (`"type": "module"`)                  |
| Framework       | Express **5.3**                                    |
| Database        | MongoDB Atlas via official `mongodb` driver **7**  |
| Auth            | JWT issued by Better Auth, verified by Express     |
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
│   │   └── db.js              # connectToMongoDB() + getDb()
│   ├── middleware/
│   │   ├── notFound.js        # 404 handler for unknown routes
│   │   └── errorHandler.js    # global error handler (always last)
│   ├── routes/
│   │   ├── healthRoutes.js    # GET /api/health (implemented)
│   │   ├── users.js           # stub + sample GET /api/users (ApiResponse)
│   │   ├── tuitions.js        # stub: planned Phase 2 endpoints (comments only)
│   │   └── applications.js    # stub: planned Phase 3 endpoints (comments only)
│   ├── utils/
│   │   ├── ApiError.js        # ApiError class (statusCode + message)
│   │   └── ApiResponse.js     # ApiResponse.success() standard success reply
│   ├── app.js                 # express app: cors, json, routes, 404, error handler
│   └── server.js              # env validation → MongoDB connect → listen
├── .env                       # DB_URI, PORT, CLIENT_URL (gitignored)
├── .env.example               # placeholder values, no secrets
├── .gitignore                 # node_modules, .env
└── package.json               # start/dev scripts
```

Notes:
- `index.js` is only a 3-line compatibility wrapper (`import './src/server.js'`)
  so the old filename still works — all real code lives in `src/`.
- The three routers are **mounted** in `app.js` (`/api/users`, `/api/tuitions`,
  `/api/applications`). `users.js` has a sample `GET /api/users`; `tuitions.js`
  and `applications.js` are still comment-only stubs — requests to them
  correctly return 404 until their phases are implemented.

Backend foundation status: **basic foundation complete** — Express app,
dotenv env validation, CORS (`CLIENT_URL`), `express.json()`, MongoDB
connection (server starts only after DB connects), 404 + global error
middleware, consistent `{ success, message, data }` response format, and
`GET /api/health`. Route modules for users/tuitions/applications/payments and
JWT auth middleware are **not implemented yet** (see roadmap).

## 4. Authentication Flow (Better Auth — DO NOT REBUILD)

```
Signup/Login (Next.js)
   └─ better-auth client: signUp.email() / signIn.email()
        └─ /api/auth/* (route.ts) → MongoDB `users` collection
             └─ session cookie stored in the browser

Frontend needs to call the Express API
   └─ GET /api/auth/token   (Better Auth jwt plugin, requires session cookie)
        └─ returns { token: "<JWT>" }   ← JWT payload = verified session user
             (includes id, email, name, role)

Express API calls
   └─ Authorization: Bearer <JWT>
        └─ verifyToken middleware → JWKS verification (see Decision D2)
             └─ req.user = { id, email, role }   ← trusted, server-signed
```

- Better Auth owns **signup, login, session, password** — nothing else does.
- The `role` field is a Better Auth `additionalFields` value, set at signup
  (`student` | `tutor`) and stored on the user document.
- `admin` is **not** selectable at signup (see Decision D3).
- The frontend never sends a role of its own authority; the backend reads the
  role only from the verified JWT.

## 5. Authorization Flow (Express middleware)

Reusable middleware to be built in `mentorlagbe-server/middleware/`:

1. **`verifyToken`** — reads `Authorization: Bearer <token>`, verifies the JWT
   (signature + expiry), attaches `req.user = { id, email, role }`. Rejects
   with 401 otherwise.
2. **`requireRole("admin")` / `requireRole("tutor", "student")`** — checks
   `req.user.role` against an allowed list, rejects with 403 otherwise.

Permission matrix (enforced in the backend, mirrored only for UI hints):

| Action                                   | student | tutor | admin |
| ---------------------------------------- | :-----: | :---: | :---: |
| Browse approved tuitions                 |   ✅    |  ✅   |  ✅   |
| Post a tuition                           |   ❌    |  ✅   |  ✅   |
| Edit own tuitions / set is-active        |   ❌    |  ✅   |  ✅   |
| Approve / reject any tuition             |   ❌    |  ❌   |  ✅   |
| Apply to a tuition                       |   ✅    |  ❌   |  ❌   |
| View **own** applications                |   ✅    |  ❌   |  ❌   |
| View applications for **own** tuitions   |   ❌    |  ✅   |  ✅   |
| Update application status (own tuitions) |   ❌    |  ✅   |  ✅   |
| View all users / change roles            |   ❌    |  ❌   |  ✅   |
| View all payments (revenue)              |   ❌    |  ❌   |  ✅   |
| Update own profile (phone, bio, image)   |   ✅    |  ✅   |  ✅   |
| Upgrade to pro (Stripe)                  |   ✅    |  ✅   |  ❌   |

Ownership rules: a tutor may only touch tuitions where
`tuition.tutorEmail === req.user.email`; a student may only read applications
where `application.studentEmail === req.user.email`.

## 6. User Roles

- **student** — searches tuitions, applies, tracks own application status.
- **tutor** — posts tuitions, manages own listings and their applicants.
- **admin** — approves/rejects tuitions, manages users and roles, sees all
  data and Stripe revenue. Not created via signup; assigned in the DB (D3).

## 7. Database Collections (MongoDB, db: `mentorlagbe`)

### 7.1 `users` — created/updated by Better Auth (signup, profile update), admin role change, Stripe webhook

| Field       | Type   | Notes                                   |
| ----------- | ------ | --------------------------------------- |
| name        | string | required                                |
| email       | string | unique, required                        |
| image       | string | profile photo (IMGBB URL)               |
| role        | string | `student` \| `tutor` \| `admin`         |
| phone       | string | profile                                 |
| bio         | string | profile                                 |
| plan        | string | `free` \| `pro`                         |
| createdAt   | date   | Better Auth manages                     |

### 7.2 `tuitions` — created and managed by tutor, approved/rejected by admin

| Field          | Type   | Notes                                    |
| -------------- | ------ | ---------------------------------------- |
| title          | string | required                                 |
| subject        | string | required                                 |
| classLevel     | string | required                                 |
| mode           | string | `online` \| `offline`                    |
| location       | string | required when offline                    |
| monthlyFee     | number | required                                 |
| daysPerWeek    | number | required                                 |
| bannerImage    | string | IMGBB URL                                |
| description    | string | required                                 |
| tutorName      | string | copied from JWT user                     |
| tutorEmail     | string | copied from JWT user — ownership key     |
| approvalStatus | string | `pending` \| `approved` \| `rejected`    |
| isActive       | bool   | tutor can toggle                         |
| createdAt      | date   |                                          |

### 7.3 `applications` — submitted by student, status updated by tutor

| Field            | Type   | Notes                                    |
| ---------------- | ------ | ---------------------------------------- |
| tuitionId        | string | ref to tuitions                          |
| tuitionTitle     | string | snapshot                                 |
| subject          | string | snapshot                                 |
| monthlyFee       | number | snapshot                                 |
| tutorEmail       | string | used for tutor ownership check           |
| studentName      | string | from JWT                                 |
| studentEmail     | string | from JWT — ownership key                 |
| studentPhone     | string | form input                               |
| preferredSchedule| string | form input                               |
| studentNote      | string | form input                               |
| status           | string | `pending` \| `accepted` \| `rejected`    |
| appliedAt        | date   |                                          |

### 7.4 `payments` — created via Stripe checkout + webhook

| Field         | Type   | Notes                                  |
| ------------- | ------ | -------------------------------------- |
| userEmail     | string |                                         |
| userName      | string |                                         |
| userRole      | string | `student` \| `tutor`                   |
| planName      | string | e.g. `pro`                             |
| amount        | number |                                         |
| currency      | string | e.g. `usd`                             |
| transactionId | string | Stripe payment intent / charge id       |
| stripeSessionId | string | Stripe checkout session id             |
| paymentStatus | string | `paid`                                 |
| paidAt        | date   |                                         |

> Note: `payments` collection is **not yet referenced** in `index.js`.

## 8. API Modules (to be built in `mentorlagbe-server/routes/`)

Base URL: `http://localhost:5000`. All `/api/*` routes except auth-related
public reads require `Authorization: Bearer <JWT>`.

| Module        | Method + Path                                  | Access        | Status |
| ------------- | ---------------------------------------------- | ------------- | ------ |
| **auth token**| `GET /api/auth/token` (Better Auth, client)    | session cookie| ✅ plugin (D2) |
| **users**     | `GET /api/users`                               | admin         | ⬜     |
|               | `GET /api/users/:email`                        | self / admin  | ⬜     |
|               | `PATCH /api/users/profile`                    | self          | ⬜     |
|               | `PATCH /api/users/:email/role`                | admin         | ⬜     |
| **tuitions**  | `POST /api/tuitions`                           | tutor (⚠️ no JWT yet) | ✅     |
|               | `GET /api/tuitions` (approved only, filters)   | public        | ✅ (filters ⬜) |
|               | `GET /api/tuitions/mine`                       | tutor (⚠️ email from query, no JWT yet) | ✅     |
|               | `GET /api/tuitions/:id`                        | public        | ⬜     |
|               | `PATCH /api/tuitions/:id` (edit)               | owner tutor   | ⬜     |
|               | `PATCH /api/tuitions/:id/status`               | admin         | ⬜     |
|               | `PATCH /api/tuitions/:id/active`               | owner tutor   | ⬜     |
| **applications** | `POST /api/applications`                    | student       | ⬜     |
|               | `GET /api/applications/mine`                   | student (own) | ⬜     |
|               | `GET /api/applications/tuition/:tuitionId`     | owner tutor   | ⬜     |
|               | `PATCH /api/applications/:id/status`           | owner tutor   | ⬜     |
| **payments**  | `POST /api/payments/checkout`                  | student/tutor | ⬜     |
|               | `POST /api/payments/webhook` (Stripe, raw body)| Stripe        | ⬜     |
|               | `GET /api/payments`                            | admin         | ⬜     |
| **upload**    | IMGBB upload (see D4)                          | —             | ⬜     |

## 9. Environment Variables

### `mentorlagbe-client/.env` (gitignored)

```
BETTER_AUTH_SECRET=...            # Better Auth signing secret
BETTER_AUTH_URL=http://localhost:3000
DB_URI=mongodb+srv://...          # same Atlas cluster, db: mentorlagbe
NEXT_PUBLIC_API_URL=http://localhost:5000   # ⬜ to be added
NEXT_PUBLIC_IMGBB_API_KEY=...              # ⬜ to be added (D4)
```

### `mentorlagbe-server/.env` (gitignored)

```
DB_URI=mongodb+srv://...          # ✅ present (secret — never commit)
PORT=5000                         # ✅ present, defaults to 5000
CLIENT_URL=http://localhost:3000  # ✅ present, used by CORS
BETTER_AUTH_URL=http://localhost:3000   # ⬜ needed for JWKS verification (D2)
STRIPE_SECRET_KEY=...             # ⬜ for Stripe checkout
STRIPE_WEBHOOK_SECRET=...         # ⬜ for webhook signature
```

`.env.example` exists with placeholder values (no real secrets).
`src/server.js` validates required vars (`DB_URI`, `CLIENT_URL`) at startup
and exits with a clear message if any are missing.

## 10. Current Implementation Status

### ✅ Completed

- Next.js 16 + TS + Tailwind 4 + shadcn/ui project setup, theming (light/dark).
- Better Auth server config (MongoDB adapter, `role` additional field).
- Better Auth client, signup form (role picker: student/tutor), login form.
- Auth API route (`/api/auth/[...all]`).
- Dashboard shell: role-aware sidebar (nav per role), header (title, user menu,
  sign-out), skeletons, toast notifications.
- Navbar with role badge + dashboard/profile links.
- **Backend basic foundation** (see section 3 for folder structure):
  - `src/server.js` — env validation → MongoDB connect → `app.listen`
    (server starts only after the DB connects; exits on failure).
  - `src/app.js` — CORS (`CLIENT_URL` only), `express.json()`, route mounting,
    404 handler, global error handler (all in correct order).
  - `src/config/db.js` — reusable `connectToMongoDB()` + `getDb()`, reads
    `DB_URI` from `.env`, logs a success message.
  - `src/middleware/notFound.js` — 404 handler for unknown routes (passes an
    `ApiError` to the global handler).
  - `src/middleware/errorHandler.js` — global error handler (always last);
    reads `err.statusCode`, only logs 5xx.
  - `src/utils/ApiResponse.js` — `ApiResponse.success(res, { message, data })`
    → `{ success: true, message, data }`.
  - `src/utils/ApiError.js` — `new ApiError(statusCode, message)` error class
    for routes (`next(new ApiError(404, '...'))`).
  - `src/config/db.js` also exports `usersCollection`, `tuitionsCollection`,
    `applicationsCollection` — assigned **after** the connection succeeds
    (module-level `db.collection(...)` would crash with `db === null`).
  - `src/routes/healthRoutes.js` — `GET /api/health` (uses `ApiResponse`).
  - **Frontend API layer** (new): `src/lib/api.ts` (`apiGet` for GET) and
    `src/lib/actions.ts` (`apiPost` / `apiPatch` / `apiDelete` for mutable
    calls) — both parse the `{ success, message, data }` envelope and throw
    `message` on failure. `NEXT_PUBLIC_API_URL` added to client `.env`.
  - **Post a Tuition page** (`dashboard/tutor/post-tuition`): shadcn form
    (title, subject, class level, mode select, location, fee, days/week,
    banner URL, description) → `apiPost("/api/tuitions")` → toast →
    redirects to `/dashboard/tutor/my-tuitions`.
  - **My Tuitions page** (`dashboard/tutor/my-tuitions`): top-right
    "Post a Tuition" button, shadcn **Table** of own posts (title, subject,
    class, mode, fee, status badge, created), loading skeletons, empty
    state; data comes from `apiGet("/api/tuitions/mine?tutorEmail=…")`
    using the Better Auth session email.
  - Consistent response shape everywhere:
    `{ success, message, data? }`.
  - `.env.example`, `npm start` / `npm run dev` scripts; `index.js` kept as a
    thin wrapper (`import './src/server.js'`) so the old filename still works.
  - Route stubs mounted in `app.js`: `routes/users.js` (includes a sample
    `GET /api/users` using `ApiResponse`), `routes/tuitions.js`,
    `routes/applications.js` — planned-endpoint comments only, no real
    logic yet (tuitions/applications return 404 until their phases start).
  - **Dependencies: none added** — express, cors, dotenv, mongodb were
    already installed and are reused.

#### Backend test results (actually run on 2026-11-21)

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
| Frontend `npm run build`               | ✅ compiled + TypeScript passed, all 19 routes generated               |
| Stub route `/api/applications`        | ✅ 404 with consistent error shape (endpoints not implemented yet) |
| Unknown route `GET /api/does-not-exist`| ✅ 404 `{"success":false,"message":"Route not found: GET /api/does-not-exist"}` |
| Invalid JSON POST (error handler)      | ✅ 400 with `{"success":false,...}` — global handler caught it         |
| CORS header                            | ✅ `Access-Control-Allow-Origin: http://localhost:3000`                |
| Server logs                            | ✅ No runtime errors                                                   |

### 🚧 Placeholders (pages exist but contain only an `<h1>`/text)

- `dashboard/student`, `dashboard/student/my-applications`, `dashboard/student/profile`
- `dashboard/tutor` (overview), `tutor/applicants`, `tutor/profile`
- `dashboard/admin`, `admin/users`, `admin/tuitions`, `admin/transactions`, `admin/profile`
- `(root)/page.tsx` (homepage — needs public tuition search)

> Implemented already: `dashboard/tutor/post-tuition` (create form → POST
> `/api/tuitions` → redirect) and `dashboard/tutor/my-tuitions` (shadcn
> Table of own tuitions + "Post a Tuition" button).

### ❌ Not started

- JWT token flow client → Express; `verifyToken` / `requireRole` middleware.
- Every API module listed in section 8 (users, applications, payments, filters).
- IMGBB banner upload, Stripe checkout + webhook, `payments` collection.
- Frontend data fetching for the remaining pages (only tuitions wired so far).
- Dashboard route protection (no `middleware.ts`, no role redirect).
- Homepage search/filter UI.

## 11. Implementation Roadmap

**Phase 0 — Foundations (do first, unblocks everything)**

1. ✅ **Backend foundation done** — Express app, env validation, CORS
   (`CLIENT_URL`), `express.json()`, MongoDB connection, 404 + global error
   handler, health check, `.env.example`, `npm start`/`npm run dev` scripts.
2. ⬜ Add `jwt()` plugin from `better-auth/plugins/jwt` to `src/lib/auth.ts`
   (do not touch existing options — only add the plugin).
3. ✅ `NEXT_PUBLIC_API_URL=http://localhost:5000` added to client `.env`
   (IMGBB key still pending — D4).
4. ⬜ The current `src/lib/api.ts` is a plain GET helper. Extend it (and
   `src/lib/actions.ts`) to fetch `/api/auth/token`, cache the JWT, and
   attach `Authorization: Bearer` to every request.
5. ⬜ Server: add `jose` (D2), `verifyToken` + `requireRole` middleware,
   `payments` collection (needed in Phase 5).

**Phase 1 — Users API + profile pages**

- Backend users module (admin list/role change, self profile get/update).
- Frontend: 3 profile pages (name, phone, bio, image, plan badge) + admin
  users table (search, role dropdown).

**Phase 2 — Tuitions API + tutor pages** (partially done ✅)

- ✅ Backend: `POST /api/tuitions`, `GET /api/tuitions` (approved only),
  `GET /api/tuitions/mine`.
- ✅ Frontend: post-tuition form, my-tuitions table.
- ⬜ Backend: edit / admin approval status / isActive / detail / search filters.
- ⬜ Frontend: admin tuitions approval queue (approve/reject buttons),
  IMGBB banner upload (D4).

**Phase 3 — Applications API + student/tutor pages**

- Backend applications module (own-records-only rules).
- Frontend: student my-applications (status badges, refetch to "track in real
  time"), tutor applicants (accept/reject).

**Phase 4 — Homepage search & filters**

- Public list of approved tuitions: search text, subject, class level, mode,
  fee range filters (query params handled by `GET /api/tuitions`).

**Phase 5 — Stripe pro plan**

- `POST /api/payments/checkout` → redirect to Stripe `session.url`
  (no stripe.js needed), webhook updates `users.plan = "pro"` + inserts into
  `payments`, admin transactions page reads `payments`, "Upgrade to Pro" button
  in dashboard.

**Phase 6 — Route protection & polish**

- Dashboard layout guard: no session → `/login`; role mismatch → own dashboard
  (client-side, using existing `useSession`).
- Fix known issues (section 13), Google login decision, final pass.

## 12. Important Decisions

- **D1 — Better Auth is untouchable.** Signup/login/session stay on Better Auth
  + MongoDB. No custom password/JWT auth will be written on the frontend.
- **D2 — JWT comes from Better Auth's own `jwt` plugin** (built into
  better-auth 1.7.25): `GET /api/auth/token` returns `{ token }` for the
  current session; Express verifies it against Better Auth's JWKS endpoint
  (`/api/auth/jwks`, EdDSA) using `jose`. This keeps one auth system and needs
  no shared secret juggling. *Alternative (simpler but less standard): HS256
  shared secret with `jsonwebtoken` — reconsider only if JWKS setup gets
  confusing.*
- **D3 — Admin users are not self-registered.** Signup offers student/tutor
  only; an admin is promoted directly in the `users` collection (or later via
  an admin API call). Keeps Better Auth config untouched.
- **D4 — IMGBB upload happens from the frontend** directly to
  `https://api.imgbb.com/1/upload` using `NEXT_PUBLIC_IMGBB_API_KEY`; only the
  returned URL is stored in MongoDB. (Alternative: a backend proxy — skip it,
  no benefit for an assignment.) `i.ibb.co` must be added to
  `next.config.ts` `images.remotePatterns`.
- **D5 — No new frontend libraries.** Stripe checkout = backend creates the
  session, frontend does `window.location.href = session.url`. No stripe.js,
  no data-fetching library, no state manager.
- **D6 — "Real time" application status = simple refetch/polling**
  (`router.refresh()` or a small `setInterval`), not websockets.
- **D7 — Snapshots in `applications`** (tuitionTitle, subject, fee, tutorEmail)
  so student lists render without joins and ownership checks stay one-line.

## 13. Known Issues (fix during the roadmap)

1. **Profile links 404**: `DashboardSidebar.tsx` and `Navbar.tsx`
   (`getProfileRoute`) link to `/student|tutor|admin/profile` — missing the
   `/dashboard` prefix. Real routes are `/dashboard/{role}/profile`.
2. **No redirect after auth**: login goes to `/` instead of
   `/dashboard/{role}`; signup `callbackURL` is `/login`.
3. **No route protection**: `/dashboard/*` renders for signed-out visitors
   (sidebar returns `null`, page content still shows).
4. **Google login button will fail** — no Google OAuth provider configured in
   Better Auth env. Either configure it or remove the button.
5. **`next.config.ts`** only allows `images.unsplash.com` — IMGBB images
   (`i.ibb.co`) will throw when used with `next/image`.
6. **`payments` collection** not yet referenced in `src/config/db.js`
   (add in Phase 5 — not needed for the foundation).
7. ~~Server has no `start` script~~ ✅ **resolved** — `npm start` and
   `npm run dev` now exist.
8. **Commit messages overstate progress** — pages referenced in git log are
   still stubs.
9. **`POST /api/tuitions` trusts `tutorName`/`tutorEmail` from the body, and
   `GET /api/tuitions/mine` trusts `tutorEmail` from the query string** —
   both must switch to the verified JWT as soon as `verifyToken` exists
   (marked with TODOs in `src/routes/tuitions.js`). Until then these
   endpoints are open to anyone and a tutor can read another tutor's posts
   by changing the query param.
10. **Never run `npm run build` while `npm run dev` is running** — mixing
    production build artifacts into `.next` corrupts the dev module graph
    and causes `module factory is not available` / `Could not validate
    instant` errors. If it happens: stop dev, delete `.next`, restart dev,
    hard-reload the browser (`Ctrl+Shift+R`).

## 14. Next Recommended Tasks (in order)

1. Phase 0 remainder: Better Auth `jwt()` plugin + `src/lib/api.ts` +
   server `verifyToken` / `requireRole` middleware (`jose`) + client env vars.
2. Phase 1: users API → profile pages (also fixes issue #1 links).
3. Phase 2: tuitions API → post-tuition / my-tuitions / admin approvals.
4. Phase 3: applications API → my-applications / applicants.
5. Phase 4: homepage search & filter.
6. Phase 5: Stripe pro plan + payments + admin transactions.
7. Phase 6: dashboard route guard + known-issue fixes.

---

*Last updated: 2026-11-23 — shared light/dark UI palette applied; backend
basic foundation implemented and tested (see section 10 test table).*
