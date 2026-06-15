# Kloset Final Environment Readiness Report

---

### Variables Still Missing
* **None.** All environment variables currently parsed or checked by the active Go backend and Next.js frontend codebases are present in [backend/.env](file:///y:/swetha/Kloset/backend/.env) and [frontend/.env.local](file:///y:/swetha/Kloset/frontend/.env.local). 
*(Note: Infrastructure variables like `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` are declared as placeholders in the environment files, but their respective SDK integrations are still missing from the application code).*

---

### Variables Safe to Delete
The following variables exist in template examples or active `.env` configuration files but are completely unused by the current codebase (no references in Go or Next.js code):

* **`GOOGLE_CLIENT_SECRET`** (Google OAuth client secret is unused as the backend validates ID tokens directly without exchange code flow).
* **`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`** (Google Maps SDK is not implemented).
* **`NEXT_PUBLIC_APP_URL`** (Not referenced in frontend code).
* **`ALLOWED_ORIGINS`** (CORS middleware references `FRONTEND_URL` instead).
* **`LOG_LEVEL`** (Unused by backend logger).
* **`RENDER_EXTERNAL_URL`** (Unused by backend routing).
* **`CLOUDFLARE_ZONE_ID`** (Unused).
* **`CLOUDFLARE_API_TOKEN`** (Unused).
* **`SLACK_WEBHOOK_URL`** (Unused).
* **`DISCORD_WEBHOOK_URL`** (Unused).
* **`UPTIME_WEBHOOK_URL`** (Unused).
* **`VERCEL_ENV`** (Unused).
* **`NEXT_PUBLIC_GOOGLE_CLIENT_ID`** (Unused in frontend code).
* **`NEXT_PUBLIC_SENTRY_DSN`** (Unused in frontend code).
* **`NEXT_PUBLIC_POSTHOG_KEY`** (Unused in frontend code).
* **`NEXT_PUBLIC_POSTHOG_HOST`** (Unused in frontend code).

---

### Variables Needing Values from External Services
The following third-party integration variables require active live credentials from their respective SaaS providers to function in a production environment:

* **Supabase PostgreSQL:** `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (Supabase Connection Pooler credentials).
* **Cloudinary:** `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (Cloudinary Developer Console keys).
* **Razorpay:** `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID` (Razorpay Live Dashboard keys).
* **Resend:** `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (Resend API Key and verified domain name).
* **Gemini AI:** `GEMINI_API_KEY` (Google AI Studio token).
* **Google OAuth:** `GOOGLE_CLIENT_ID`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (Google Cloud Developer Console credentials).
* **Sentry:** `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN` (Sentry Project DSN tokens).
* **PostHog:** `NEXT_PUBLIC_POSTHOG_KEY` (PostHog Project API key). Custom host default `https://us.i.posthog.com` is preconfigured.
