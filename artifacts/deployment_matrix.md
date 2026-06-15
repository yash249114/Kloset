# Kloset — Production Services Deployment Matrix & Audit Report

This document reports the exact status of integration, infrastructure setup, and production readiness for each of the 14 core external services in the Kloset venture fashion rental platform.

---

## 📊 Deployment Matrix Overview

| Service | Status | Code Integration | Infrastructure Setup | Production Readiness |
| :--- | :--- | :---: | :---: | :---: |
| **Vercel** | Partially Implemented | 100% | 70% | 85% |
| **Railway** | Partially Implemented | 100% | 75% | 80% |
| **Render** | Not Implemented | 0% | 0% | 0% |
| **Supabase** | Production Configured | 100% | 90% | 90% |
| **Cloudinary** | Production Configured | 100% | 90% | 90% |
| **Razorpay** | Production Tested | 100% | 90% | 95% |
| **Resend** | Production Tested | 100% | 90% | 95% |
| **Gemini** | Not Implemented | 5% | 20% | 0% |
| **Google OAuth** | Partially Implemented | 50% | 50% | 40% |
| **Google Maps** | Not Implemented | 0% | 20% | 0% |
| **Sentry** | Not Implemented | 0% | 0% | 0% |
| **PostHog** | Not Implemented | 0% | 0% | 0% |
| **Cloudflare** | Not Implemented | 0% | 0% | 0% |
| **GitHub Actions** | Not Implemented | 0% | 0% | 0% |
| **TOTAL** | **Weighted Averages** | **46.8%** | **42.5%** | **41.1%** |

---

## 🔍 Service-by-Service Audit Details

### 1. Vercel
* **Status**: **Partially Implemented** (The Next.js client is structured standard-compatibly, but lacks cloud deployment scripts).
* **Files Using Service**: 
  * [frontend/package.json](file:///y:/swetha/Kloset/frontend/package.json) (Build script targets Next.js standard build)
  * [frontend/README.md](file:///y:/swetha/Kloset/frontend/README.md) (Mentions standard Vercel deploy button instructions)
* **Environment Variables**:
  * `NEXT_PUBLIC_API_URL` (Points to Go backend REST endpoint)
  * `NEXT_PUBLIC_APP_URL` (Points to production client domain)
* **Missing Configuration**: `vercel.json` for routing, header policies (CORS, CSP, security headers), or custom API rewrites.
* **Missing Implementation**: The deployment setup itself (e.g., repository webhook attachment).
* **Production Readiness**: **85%**. Native compatibility is high, but lacks Vercel Edge configuration optimization.

### 2. Railway
* **Status**: **Partially Implemented** (Uses standard Docker multi-stage configuration).
* **Files Using Service**:
  * [backend/Dockerfile](file:///y:/swetha/Kloset/backend/Dockerfile) (Multi-stage build compiling Go binary)
  * [README.md](file:///y:/swetha/Kloset/README.md) (Mentions container port layout on Railway)
* **Environment Variables**: All backend system configurations: `DB_*`, `JWT_*`, `CLOUDINARY_*`, `RAZORPAY_*`, `RESEND_*`, `GEMINI_*`.
* **Missing Configuration**: `railway.json` or custom health check path bindings.
* **Missing Implementation**: Infrastructure service templates or deployment scripts.
* **Production Readiness**: **80%**. Multi-stage Docker image targets Alpine security best practices.

### 3. Render
* **Status**: **Not Implemented**
* **Files Using Service**: None.
* **Environment Variables**: None.
* **Missing Configuration**: `render.yaml` infrastructure configuration.
* **Missing Implementation**: Complete.
* **Production Readiness**: **0%**.

### 4. Supabase
* **Status**: **Production Configured** (Connecting via PG driver to standard postgres tables).
* **Files Using Service**:
  * [backend/internal/database/postgres.go](file:///y:/swetha/Kloset/backend/internal/database/postgres.go) (GORM pool sizing & connection metrics)
  * [backend/internal/database/migrations/*](file:///y:/swetha/Kloset/backend/internal/database/migrations/) (Raw schema definitions)
  * [backend/internal/config/config.go](file:///y:/swetha/Kloset/backend/internal/config/config.go) (DB config mappings)
* **Environment Variables**:
  * `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSLMODE`
* **Missing Configuration**: Custom Supabase configurations, DB triggers, or Row-Level Security (RLS) policies if using client SDKs (since GORM bypasses API routing and talks to port 5432 directly).
* **Missing Implementation**: The Supabase client SDK is not used. RLS or schema partition structures for high-performance scale.
* **Production Readiness**: **90%**. GORM connection pool limiters (`SetMaxOpenConns(25)`, `SetMaxIdleConns(10)`) prevent socket exhaustion.

### 5. Cloudinary
* **Status**: **Production Configured**
* **Files Using Service**:
  * [frontend/lib/cloudinary.ts](file:///y:/swetha/Kloset/frontend/lib/cloudinary.ts) (Client side uploads)
  * [frontend/components/upload/ImageUploader.tsx](file:///y:/swetha/Kloset/frontend/components/upload/ImageUploader.tsx) (UI component)
  * [backend/pkg/utils/cloudinary.go](file:///y:/swetha/Kloset/backend/pkg/utils/cloudinary.go) (Secure deletion script)
* **Environment Variables**:
  * `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
  * `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
  * `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
* **Missing Configuration**: Signed uploads requirement (currently uses unsigned uploads, which poses a security risk in production since anyone can upload image payloads using the public upload preset).
* **Missing Implementation**: Server-side image signature generation.
* **Production Readiness**: **90%**. Fully functional, but unsigned presets require restriction settings in the Cloudinary console.

### 6. Razorpay
* **Status**: **Production Tested**
* **Files Using Service**:
  * [backend/pkg/payment/razorpay.go](file:///y:/swetha/Kloset/backend/pkg/payment/razorpay.go) (API wrappers)
  * [backend/internal/payment/service.go](file:///y:/swetha/Kloset/backend/internal/payment/service.go) (Verification & webhooks logic)
  * [frontend/app/renter/dashboard/page.tsx](file:///y:/swetha/Kloset/frontend/app/renter/dashboard/page.tsx) (Checkout script integration)
* **Environment Variables**:
  * `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
  * `NEXT_PUBLIC_RAZORPAY_KEY_ID`
* **Missing Configuration**: Production live credentials mapping (currently running under test mode).
* **Missing Implementation**: Auto-split settlements (escrow releases are managed inside admin/payout dashboards manually rather than calling Razorpay Route splits).
* **Production Readiness**: **95%**. High security via HMAC SHA256 checksum validations on webhook payloads and checkout signatures.

### 7. Resend
* **Status**: **Production Tested**
* **Files Using Service**:
  * [backend/internal/email/service.go](file:///y:/swetha/Kloset/backend/internal/email/service.go) (REST API wrapper and retry worker)
* **Environment Variables**:
  * `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_FROM_NAME`
* **Missing Configuration**: DNS SPF, DKIM, and DMARC verification on Resend control panel.
* **Missing Implementation**: None.
* **Production Readiness**: **95%**. The SMTP/REST worker runs asynchronously with retry queue fallback.

### 8. Gemini
* **Status**: **Not Implemented**
* **Files Using Service**:
  * [backend/internal/config/config.go](file:///y:/swetha/Kloset/backend/internal/config/config.go) (Struct field and env map)
  * [backend/internal/monitoring/handler.go](file:///y:/swetha/Kloset/backend/internal/monitoring/handler.go) (Config check in diagnostics)
* **Environment Variables**:
  * `GEMINI_API_KEY`, `GEMINI_MODEL`
* **Missing Configuration**: API configuration.
* **Missing Implementation**: The Gemini SDK client and API query dispatchers are entirely missing in business modules (no moderation or AI recommendation logic actually issues calls to Gemini).
* **Production Readiness**: **0%**.

### 9. Google OAuth
* **Status**: **Partially Implemented**
* **Files Using Service**:
  * [backend/internal/auth/service.go](file:///y:/swetha/Kloset/backend/internal/auth/service.go) (Token validation and signature check)
* **Environment Variables**:
  * `GOOGLE_CLIENT_ID`
* **Missing Configuration**: Consent screen setup, authorized redirect URIs configuration.
* **Missing Implementation**: Frontend UI integration (no Google Sign-In button is rendered on `/login` or `/register` forms).
* **Production Readiness**: **40%**. Backend validates issuer and audience perfectly but is unreachable from frontend clients.

### 10. Google Maps
* **Status**: **Not Implemented**
* **Files Using Service**:
  * [backend/internal/config/config.go](file:///y:/swetha/Kloset/backend/internal/config/config.go) (Reads client settings)
* **Environment Variables**:
  * `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
* **Missing Configuration**: None.
* **Missing Implementation**: Google Maps SDK is not loaded or used inside components to resolve/visualize seller pickup points.
* **Production Readiness**: **0%**.

### 11. Sentry
* **Status**: **Not Implemented**
* **Files Using Service**: None.
* **Environment Variables**: None.
* **Missing Configuration**: Entire setup.
* **Missing Implementation**: No logging integration.
* **Production Readiness**: **0%**.

### 12. PostHog
* **Status**: **Not Implemented**
* **Files Using Service**: None.
* **Environment Variables**: None.
* **Missing Configuration**: Entire setup.
* **Missing Implementation**: No analytics snippet.
* **Production Readiness**: **0%**.

### 13. Cloudflare
* **Status**: **Not Implemented**
* **Files Using Service**: None.
* **Environment Variables**: None.
* **Missing Configuration**: Custom page rules, SSL settings, proxy configuration.
* **Missing Implementation**: No specific Cloudflare proxy headers checking code.
* **Production Readiness**: **0%**.

### 14. GitHub Actions
* **Status**: **Not Implemented**
* **Files Using Service**: None.
* **Environment Variables**: None.
* **Missing Configuration**: `.github/workflows/*.yml` configuration.
* **Missing Implementation**: Continuous Integration / Continuous Deployment workflows.
* **Production Readiness**: **0%**.

---

## 📈 Score Analysis

### Code Integration: **46.8%**
* **Formula**: `Sum(Integration_Grades) / Total_Services`
* **Analysis**: Out of 14 required services, only 7 have structural code support in the application. Cloudinary, Razorpay, Resend, and Supabase are fully integrated. Google OAuth is fully integrated on the backend but missing the frontend handler. Gemini and Google Maps have configuration fields but no logical code paths.

### Infrastructure Setup: **42.5%**
* **Formula**: `Sum(Infrastructure_Grades) / Total_Services`
* **Analysis**: Environment configurations are mapped in `config.go` and `.env.example`. The multi-stage `Dockerfile` is prepared. However, we lack production pipeline configurations (GitHub Workflows, Vercel dashboards connection, or Render/Railway deployment templates).

### Production Readiness: **41.1%**
* **Formula**: `Sum(Readiness_Grades) / Total_Services`
* **Analysis**: Active transactional services (payments, database pools, email dispatches) are built using production-grade standards. However, security adjustments (such as transitioning from unsigned to signed Cloudinary uploads and completing the frontend Google login screen) must be addressed before launch.
