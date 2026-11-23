# MentorLagbe Client

MentorLagbe is a tuition and mentorship marketplace. Students can browse
approved tuition listings, apply, and save listings. Tutors can post listings
and manage applicants. Admins can moderate listings, manage users, and review
payments.

This repository contains the Next.js frontend. The Express API is maintained
in the separate
[mentorlagbe-server repository](https://github.com/Riaz-RZ/mentorlagbe-server).

## Features

- Public tuition search, filters, tuition details, and pricing pages.
- Better Auth email/password signup and login with student and tutor roles.
- Role-specific student, tutor, and admin dashboards.
- Tuition applications, saved tuitions, tutor listing management, and admin
  moderation.
- Stripe-hosted checkout for the Pro plan.
- IMGBB uploads for profile photos and tuition banners.
- Light and dark themes.

## Tech Stack

- Next.js 16 App Router, React, and TypeScript
- Tailwind CSS 4 and shadcn/ui
- Better Auth with MongoDB
- `fetch`-based API helpers and Sonner toasts

## Requirements

- Node.js and npm
- MongoDB connection string
- The MentorLagbe backend, locally or deployed
- An IMGBB API key for image uploads

## Local Setup

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root:

```dotenv
BETTER_AUTH_SECRET=replace_with_a_long_random_secret
BETTER_AUTH_URL=http://localhost:3000
DB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

`DB_URI` must point to the MongoDB cluster used by the application. Better Auth
stores its data in the `mentorlagbe` database. `NEXT_PUBLIC_API_URL` should be
the URL of the backend; the frontend defaults to the deployed API
`https://mentorlagbe-server-bay.vercel.app` when this variable is omitted.
Set it to `http://localhost:5000` when using a local backend.

The `NEXT_PUBLIC_` values are available in the browser. Do not put private
secrets in variables with this prefix. The IMGBB key is used by the browser
for direct uploads.

Start the frontend:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To run the backend locally, configure its environment and start it from the
backend repository:

```bash
cd ../mentorlagbe-server
npm install
npm run dev
```

See the backend
[README](https://github.com/Riaz-RZ/mentorlagbe-server#readme) for its
environment variables and Stripe webhook setup.

## Authentication and API

Better Auth manages signup, login, and sessions. The frontend obtains a
short-lived JWT from Better Auth and attaches it as a Bearer token to protected
backend requests. The backend verifies that token against Better Auth's JWKS
endpoint and checks roles and resource ownership.

The frontend API helpers are in `src/lib/api.ts` (GET requests) and
`src/lib/actions.ts` (POST, PATCH, and DELETE requests). Responses use the
backend's `{ success, message, data }` format.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Check TypeScript types |
| `npm run build` | Create a production build |
| `npm run start` | Serve a production build |

Build the project before running `npm run start`. Avoid running the production
build while the development server is active.

## Deployment

When deploying the frontend, configure `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`,
`DB_URI`, `NEXT_PUBLIC_API_URL`, and `NEXT_PUBLIC_IMGBB_API_KEY` in the hosting
provider. Set `BETTER_AUTH_URL` to the deployed frontend origin and
`NEXT_PUBLIC_API_URL` to the deployed backend URL. The backend's `CLIENT_URL`
must exactly match the deployed frontend origin for CORS.

Stripe checkout and webhook secrets belong only in the backend environment;
the frontend redirects users to the Stripe-hosted checkout page.
