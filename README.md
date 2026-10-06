# Mystery Message

An anonymous messaging app where users can receive messages from anyone via a shareable link, without the sender needing an account. Built with Next.js, MongoDB, NextAuth, and Gemini AI.

---

## What It Does

- Users sign up and get a personal link: `/u/[username]`
- Anyone can visit that link and send an anonymous message — no login required
- The recipient sees all messages in a dashboard and can delete them individually
- Users can toggle whether they want to receive messages at all
- Gemini AI suggests icebreaker questions on the send page to help senders think of something to write
- Email verification is required on sign-up via Resend

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | MongoDB via Mongoose |
| Auth | NextAuth v4 |
| Email | Resend + React Email |
| AI | Google Gemini (`@ai-sdk/google`) |
| UI | shadcn/ui + Tailwind CSS v4 |
| Forms | React Hook Form + Zod |
| Notifications | Sonner |

---

## Prerequisites

- Node.js 18+
- A MongoDB database (Atlas or local)
- A [Resend](https://resend.com) account for sending verification emails
- A [Google AI Studio](https://aistudio.google.com) API key for Gemini

---

## Setup

**1. Clone and install**

```bash
git clone <your-repo-url>
cd Feedback_App
npm install
```

**2. Create your `.env` file**

```bash
cp .env.sample .env
```

Then fill in the values:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
RESEND_API_KEY=re_xxxxxxxxxxxx
NEXTAUTH_SECRET=some-long-random-secret
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-api-key
NEXTAUTH_URL=http://localhost:3000
```

> `NEXTAUTH_SECRET` can be any random string. Run `openssl rand -base64 32` if you want a proper one.

**3. Run the dev server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Project Structure

```
src/
  app/
    (app)/          # Authenticated routes (dashboard)
    (auth)/         # Sign-in, sign-up, verify pages
    api/            # All API route handlers
    u/[username]/   # Public anonymous message page
  components/       # Navbar, MessageCard, shadcn UI components
  context/          # NextAuth session provider wrapper
  helpers/          # sendVerificationEmail utility
  lib/              # dbConnect, resend client, utils
  model/            # Mongoose User + Message schema
  schemas/          # Zod validation schemas
  types/            # TypeScript type extensions (next-auth.d.ts)
emails/             # React Email templates (VerificationEmail)
```

---

## API Routes

| Method | Route | Description |
|---|---|---|
| POST | `/api/sign-up` | Register a new user |
| POST | `/api/verify-code` | Verify email with OTP |
| GET | `/api/check-username-unique` | Check if username is available |
| GET | `/api/get-messages` | Get all messages for logged-in user |
| POST | `/api/send-message` | Send anonymous message to a user |
| DELETE | `/api/delete-message/[messageid]` | Delete a specific message |
| POST | `/api/accept-messages` | Toggle accepting messages on/off |
| GET | `/api/accept-messages` | Get current accepting-messages status |
| POST | `/api/suggest-messages` | Stream AI-suggested questions (Gemini) |
| `*` | `/api/auth/[...nextauth]` | NextAuth session handling |

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `RESEND_API_KEY` | Yes | Resend API key for email |
| `NEXTAUTH_SECRET` | Yes | Secret used to sign session tokens |
| `NEXTAUTH_URL` | Yes (prod) | Full URL of your deployment |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Yes | Google AI key for suggest-messages |

---

## Auth Flow

1. User signs up → OTP sent to email via Resend
2. User verifies OTP → account marked as verified
3. NextAuth credentials provider handles sign-in
4. Middleware redirects unauthenticated users away from `/dashboard` and authenticated users away from `/sign-in`, `/sign-up`, `/verify`

---

## Deployment

The app is standard Next.js and deploys to Vercel without any special config. Make sure to add all environment variables in your Vercel project settings.

For other platforms (Railway, Render, etc.), set the same env vars and run `npm run build && npm run start`.
