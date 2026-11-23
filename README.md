# MentorLagbe Client

MentorLagbe is a tuition and mentorship marketplace that connects students with tutors. Students can explore approved tuition listings, apply for opportunities, and save their favorite listings. Tutors can publish tuition listings and manage applicants, while admins oversee platform activities, moderate listings, manage users, and review payments.

This repository contains the **Next.js frontend** of MentorLagbe. The Express.js backend is maintained separately in the [mentorlagbe-server repository](https://github.com/Riaz-RZ/mentorlagbe-server).

## Live Demo

- **Frontend:** [MentorLagbe Client](https://mentorlagbe-client-smoky.vercel.app)
- **Backend API:** [MentorLagbe Server](https://mentorlagbe-server-bay.vercel.app)
- **Backend Repository:** [GitHub](https://github.com/Riaz-RZ/mentorlagbe-server)

## Features

- **Tuition Discovery:** Browse approved tuition listings, search, filter, and view tuition details.
- **Authentication:** Better Auth email/password authentication with student and tutor roles.
- **Role-Based Dashboards:** Separate dashboards for students, tutors, and admins.
- **Student Features:** Apply for tuition opportunities and save favorite listings.
- **Tutor Features:** Create and manage tuition listings and review applicants.
- **Admin Management:** Moderate tuition listings, manage users, and review payment records.
- **Pro Subscription:** Stripe-hosted checkout for upgrading to the Pro plan.
- **Image Uploads:** IMGBB integration for profile photos and tuition banners.
- **Theme Support:** Light and dark mode.
- **Responsive Design:** User-friendly interface across desktop, tablet, and mobile devices.

## Tech Stack

**Frontend**
- Next.js 16 (App Router)
- React
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- Lucide React

**Backend**
- Node.js
- Express.js
- MongoDB
- Better Auth JWT verification
- REST API

**Authentication & Integrations**
- Better Auth
- Stripe Checkout and Webhooks
- IMGBB
- Sonner Toast Notifications

## Requirements

- Node.js and npm
- MongoDB connection string
- MentorLagbe backend running locally or deployed
- IMGBB API key

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Riaz-RZ/mentorlagbe-client
cd MentorLagbe
```


### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```dotenv
BETTER_AUTH_SECRET=your_long_random_secret
BETTER_AUTH_URL=http://localhost:3000
DB_URI=your_mongodb_connection_string
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

**Environment variable notes:**

- `BETTER_AUTH_SECRET`: Secret used by Better Auth.
- `BETTER_AUTH_URL`: Frontend origin used by Better Auth.
- `DB_URI`: MongoDB connection string. Better Auth stores its data in the `mentorlagbe` database.
- `NEXT_PUBLIC_API_URL`: Base URL of the Express backend.
- `NEXT_PUBLIC_IMGBB_API_KEY`: API key used for browser-based image uploads.

The frontend defaults to the deployed backend URL if `NEXT_PUBLIC_API_URL` is omitted:

```text
https://mentorlagbe-server-bay.vercel.app
```

Use `http://localhost:5000` when running the backend locally.

Never expose private secrets through `NEXT_PUBLIC_` environment variables.

### 4. Start the frontend

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Run the backend locally

Clone the [backend repository](https://github.com/Riaz-RZ/mentorlagbe-server) separately and configure its environment variables.

```bash
cd ../mentorlagbe-server
npm install
npm run dev
```

Refer to the backend [README](https://github.com/Riaz-RZ/mentorlagbe-server#readme) for backend configuration and additional setup instructions.

## Authentication and API

Better Auth manages user registration, login, and sessions.

The frontend obtains a short-lived JWT from Better Auth and sends it as a Bearer token when making protected API requests.

The Express backend verifies tokens using Better Auth's JWKS endpoint and enforces role-based access and resource ownership through reusable middleware.

Frontend API helpers:

- `src/lib/api.ts` — GET requests.
- `src/lib/actions.ts` — POST, PATCH, and DELETE requests.

API responses follow this structure:

```json
{
  "success": true,
  "message": "Request completed successfully",
  "data": {}
}
```

## Admin Credentials

For evaluation purposes:

- **Email:** admin@gmail.com
- **Password:** 12345678


## NPM Packages

- next
- react
- react-dom
- typescript
- better-auth
- tailwindcss
- lucide-react
- sonner
- stripe

## Stripe Payments

MentorLagbe uses Stripe Checkout for one-time Pro plan purchases.

The payment flow:

1. An authenticated student or tutor requests a checkout session.
2. The backend creates a Stripe Checkout session.
3. The frontend redirects the user to Stripe-hosted checkout.
4. Stripe sends a webhook event to the backend after checkout.
5. The backend verifies the webhook signature.
6. When `checkout.session.completed` is received and the payment status is `paid`, the backend records the payment and upgrades the user's plan to Pro.

**Production webhook endpoint:**

```text
https://mentorlagbe-server-bay.vercel.app/api/payments/webhook
```

**Required backend environment variables:**

```dotenv
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_signing_secret
CLIENT_URL=your_deployed_frontend_url
```

The webhook signing secret must come from the Stripe Dashboard endpoint configured for your deployed backend. Never expose Stripe secret keys or webhook signing secrets in the frontend or commit them to Git.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Check TypeScript types |
| `npm run build` | Create a production build |
| `npm run start` | Serve a production build |

Build the project before running `npm run start`. Avoid running the production build while the development server is active.

## Deployment

The frontend and backend are deployed separately on Vercel.

**Frontend environment variables:**

Configure these in your frontend Vercel project:

- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `DB_URI`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_IMGBB_API_KEY`

Set `BETTER_AUTH_URL` to your deployed frontend origin and `NEXT_PUBLIC_API_URL` to:

```text
https://mentorlagbe-server-bay.vercel.app
```

**Backend environment variables:**

Configure the backend's required environment variables in its own Vercel project, including:

- MongoDB connection settings
- Better Auth JWT verification configuration
- `CLIENT_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

Set `CLIENT_URL` to the exact deployed frontend origin. Configure CORS to allow requests from that origin.

After changing environment variables in Vercel, redeploy the relevant project for the changes to take effect.

---

## Author

**Md Riazul Islam**

- [GitHub](https://github.com/Riaz-RZ)
- [LinkedIn](https://www.linkedin.com/in/riazul-islam89)

