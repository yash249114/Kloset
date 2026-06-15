# KLOSET — ENTIRE PRODUCTION AUDIT & FRONTEND V2 REBUILD PLAN

> **Audit Date:** 2026-06-12  
> **Auditor:** Antigravity AI  
> **Scope:** Full-stack production readiness + Frontend V2 rebuild specification  
> **Verdict:** ❌ NOT PRODUCTION-READY — Major failures across OAuth, payments, AI, and UX

---

## Table of Contents

1. [Google OAuth Audit](#1-google-oauth-audit)
2. [Razorpay Payment Audit](#2-razorpay-payment-audit)
3. [Chatbot Audit](#3-chatbot-audit)
4. [AI Feature Audit](#4-ai-feature-audit)
5. [Admin Portal Audit](#5-admin-portal-audit)
6. [Recommendation Engine Audit](#6-recommendation-engine-audit)
7. [Session Persistence Audit](#7-session-persistence-audit)
8. [UX Audit](#8-ux-audit)
9. [Frontend V2 Rebuild Specification](#9-frontend-v2-rebuild-specification)
10. [Exact Fixes Required](#10-exact-fixes-required)

---

## 1. Google OAuth Audit

### Current Implementation

| Component | File | Status |
|---|---|---|
| Google Button | [LoginForm.tsx](file:///y:/swetha/Kloset/frontend/components/auth/LoginForm.tsx) | ✅ Renders via `@react-oauth/google` |
| GoogleProvider wrapper | [GoogleProvider](file:///y:/swetha/Kloset/frontend/components/providers/GoogleProvider.tsx) | ✅ Wraps app in `GoogleOAuthProvider` |
| Frontend handler | [LoginForm.tsx#L30-L52](file:///y:/swetha/Kloset/frontend/components/auth/LoginForm.tsx#L30-L52) | ✅ `handleGoogleSuccess` calls `authAPI.googleLogin()` |
| API call | [auth.ts#L15-L18](file:///y:/swetha/Kloset/frontend/lib/api/auth.ts#L15-L18) | ✅ Posts to `/auth/google` |
| Backend handler | [handler.go#L115-L132](file:///y:/swetha/Kloset/backend/internal/auth/handler.go#L115-L132) | ✅ Route registered at `/auth/google` |
| Token verification | [service.go#L253-L335](file:///y:/swetha/Kloset/backend/internal/auth/service.go#L253-L335) | ✅ Uses `google.golang.org/api/idtoken` (secure) |
| User creation | [service.go#L306-L321](file:///y:/swetha/Kloset/backend/internal/auth/service.go#L306-L321) | ✅ Auto-creates renter on first Google login |
| JWT issuance | Backend auth service | ✅ Issues access + refresh tokens |

### Flow Verification

```
Step 1: Google Button renders                     ✅ PASS
Step 2: Google popup opens                        ⚠️ DEPENDS ON CLIENT_ID
Step 3: Google credential received                ✅ PASS (frontend handler exists)
Step 4: Credential reaches backend                ✅ PASS (POST /auth/google)
Step 5: Backend validates token                   ⚠️ CONDITIONAL
Step 6: User created if new                       ✅ PASS
Step 7: User logged in if existing                ✅ PASS
Step 8: JWT issued                                ✅ PASS
Step 9: Frontend session established              ✅ PASS (setAuth called)
Step 10: User remains logged in after refresh     ✅ PASS (zustand persist)
```

### Identified Failure Points

> [!CAUTION]
> **Root Cause of Production Failure: `GOOGLE_CLIENT_ID` environment variable**

1. **Backend requires `GOOGLE_CLIENT_ID` env var** — [service.go#L265-L267](file:///y:/swetha/Kloset/backend/internal/auth/service.go#L265-L267) reads `GOOGLE_CLIENT_ID` via `getEnvVar()`. If this is missing on Render, verification returns `"server is missing GOOGLE_CLIENT_ID configuration"`.

2. **Frontend `NEXT_PUBLIC_GOOGLE_CLIENT_ID`** — Currently set in [.env.local](file:///y:/swetha/Kloset/frontend/.env.local#L6) to `556903365810-b7r421u9a9c5oev7lbmr5e9rh4nksfi0.apps.googleusercontent.com`. This must also be set as a Vercel env var.

3. **CORS crash on Render** — The CORS panic (separate issue) crashes the server before any OAuth endpoint is reachable.

4. **Google Console callback URLs** — Must include the production Vercel domain in Google Cloud Console → OAuth 2.0 Client → Authorized JavaScript Origins and Redirect URIs.

### Required Fixes

| Fix | Priority |
|---|---|
| Set `GOOGLE_CLIENT_ID` on Render backend | 🔴 CRITICAL |
| Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID` on Vercel | 🔴 CRITICAL |
| Fix CORS panic (separate ticket) | 🔴 CRITICAL |
| Add production domain to Google Console Authorized Origins | 🔴 CRITICAL |
| Add production domain to Google Console Redirect URIs | 🔴 CRITICAL |

---

## 2. Razorpay Payment Audit

### Current Implementation

| Component | File | Status |
|---|---|---|
| Razorpay Go client | [razorpay.go](file:///y:/swetha/Kloset/backend/pkg/payment/razorpay.go) | ✅ Exists |
| Payment service | [service.go](file:///y:/swetha/Kloset/backend/internal/payment/service.go) | ✅ Exists |
| Payment handler | [handler.go](file:///y:/swetha/Kloset/backend/internal/payment/handler.go) | ✅ Exists |
| Payment DTOs | [dto.go](file:///y:/swetha/Kloset/backend/internal/payment/dto.go) | ✅ Exists |
| Frontend Razorpay key | [.env.local#L5](file:///y:/swetha/Kloset/frontend/.env.local#L5) | ✅ `rzp_test_SzVkRwLKsV1G7t` |
| Backend config | [config.go#L125-L129](file:///y:/swetha/Kloset/backend/internal/config/config.go#L125-L129) | ✅ Loads `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` |
| Checkout page | [checkout/page.tsx](file:///y:/swetha/Kloset/frontend/app/booking/checkout/page.tsx) | ✅ 55KB file exists |

### Flow Verification

```
Step 1: Order creation endpoint                   ✅ EXISTS
Step 2: Razorpay checkout opens                   ⚠️ NEEDS VERIFICATION
Step 3: Signature validation                      ✅ EXISTS (backend)
Step 4: Payment verification                      ✅ EXISTS (backend)
Step 5: Booking creation                          ✅ EXISTS (backend)
Step 6: Transaction creation                      ✅ EXISTS (backend)
Step 7: Success redirect                          ⚠️ NEEDS VERIFICATION
Step 8: Failure handling                           ⚠️ NEEDS VERIFICATION
```

### Identified Failure Points

> [!WARNING]
> **Production Failure: Environment variables and CORS**

1. **Test key in production** — Frontend uses `rzp_test_*` key. For production, this MUST be replaced with a live key (`rzp_live_*`).

2. **Backend env vars likely missing on Render:**
   - `RAZORPAY_KEY_ID` 
   - `RAZORPAY_KEY_SECRET`
   - `RAZORPAY_WEBHOOK_SECRET`

3. **CORS crash** — If the backend crashes on startup (CORS panic), no payment endpoints are reachable.

4. **Webhook URL** — Razorpay webhook must point to the production backend URL (`https://api.kloset.in/api/v1/payments/webhook` or equivalent).

### Required Fixes

| Fix | Priority |
|---|---|
| Replace test Razorpay keys with live keys for production | 🔴 CRITICAL |
| Set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` on Render | 🔴 CRITICAL |
| Fix CORS crash | 🔴 CRITICAL |
| Configure Razorpay webhook URL in Razorpay Dashboard | 🟡 HIGH |
| Set `NEXT_PUBLIC_RAZORPAY_KEY_ID` on Vercel with live key | 🔴 CRITICAL |

---

## 3. Chatbot Audit

### Current Implementation

| Component | Status | Details |
|---|---|---|
| Widget visible | ✅ YES | [SupportWidget.tsx](file:///y:/swetha/Kloset/frontend/components/support/SupportWidget.tsx) — Floating FAB at bottom-right |
| Included in layout | ✅ YES | [layout.tsx#L54](file:///y:/swetha/Kloset/frontend/app/layout.tsx#L54) — `<SupportWidget />` |
| Mobile responsive | ✅ YES | Widget is `w-80 sm:w-96`, works on mobile |
| Connected to Gemini | ❌ NO | Uses **hardcoded keyword matching**, not Gemini API |
| Recommends products | ❌ NO | No product recommendation capability |
| Support ticket creation | ✅ YES | Can create tickets via `useSupportStore` |

### Chatbot Analysis

The "chatbot" at [SupportWidget.tsx#L66-L88](file:///y:/swetha/Kloset/frontend/components/support/SupportWidget.tsx#L66-L88) uses a simple `setTimeout` + keyword matching system:

```typescript
// Current logic — NOT AI
if (lower.includes('cancel')) { replyText = '🌸 Cancellation Policy...' }
else if (lower.includes('return')) { replyText = '📦 Returns & Shipping...' }
else if (lower.includes('refund')) { replyText = '💰 Refund Timeline...' }
// ... etc
```

> [!CAUTION]
> **The chatbot does NOT use Gemini or any AI.** It is a keyword-matching FAQ bot with 5 hardcoded responses. It is presented as an "AI Assistant" in the UI header, which is misleading.

### Required Fixes

| Fix | Priority |
|---|---|
| Connect chatbot to Gemini API via backend endpoint | 🔴 CRITICAL |
| Add product recommendation capability | 🟡 HIGH |
| Add outfit search integration | 🟡 HIGH |
| Add occasion-based recommendations | 🟡 HIGH |
| Add conversation history persistence | 🟢 MEDIUM |

---

## 4. AI Feature Audit

### Current AI Presence

| Feature | Status | Location |
|---|---|---|
| AI Stylist Chat | ❌ NOT IMPLEMENTED | No AI chat endpoint exists |
| Outfit Recommendation Engine | ❌ NOT IMPLEMENTED | No recommendation algorithm |
| Event-based recommendations | ❌ NOT IMPLEMENTED | — |
| Body-type recommendations | ❌ NOT IMPLEMENTED | — |
| Color recommendations | ❌ NOT IMPLEMENTED | — |
| Occasion recommendations | ❌ NOT IMPLEMENTED | — |
| AI Description Generation | ⚠️ SCHEMA ONLY | `ai_description` field exists in [model.go#L18](file:///y:/swetha/Kloset/backend/internal/outfit/model.go#L18) but no service generates it |
| Gemini API Key Config | ✅ EXISTS | [config.go#L136-L137](file:///y:/swetha/Kloset/backend/internal/config/config.go#L136-L137) — Loads `GEMINI_API_KEY` and `GEMINI_MODEL` |
| Gemini Service/Client | ❌ NOT IMPLEMENTED | No Go service file initializes `genai.Client` |
| AI CTA on site | ❌ NOT VISIBLE | No AI-related CTAs anywhere on the site |

### Summary

> [!CAUTION]
> **Gemini is configured in env vars but NEVER actually used.** There is zero AI functionality in the entire application. The `ai_description` database field is always `null`. No Gemini client is initialized. No AI endpoints exist. The chatbot is keyword-based. The "AI Stylist" referenced in the UI header is a label only.

### Required Implementation

| Feature | Priority | Scope |
|---|---|---|
| Create Gemini AI service in backend | 🔴 CRITICAL | New `internal/ai/service.go` |
| AI outfit description generator | 🟡 HIGH | POST `/ai/describe` endpoint |
| AI stylist chat endpoint | 🔴 CRITICAL | POST `/ai/chat` endpoint |
| Connect frontend chatbot to AI endpoint | 🔴 CRITICAL | Replace keyword logic |
| AI recommendation engine | 🟡 HIGH | Based on user history + preferences |
| AI CTA components across site | 🟡 HIGH | Homepage, product page, discover page |

---

## 5. Admin Portal Audit

### Current Implementation

| Feature | Status | Location |
|---|---|---|
| Admin URL | ✅ `/admin/dashboard` | [admin/dashboard/page.tsx](file:///y:/swetha/Kloset/frontend/app/admin/dashboard/page.tsx) |
| Admin login | ⚠️ PARTIAL | Uses same login as users; redirects admin role to `/admin/dashboard` |
| Admin credentials strategy | Role-based | User with `role: "admin"` in database |
| Platform metrics | ⚠️ MOCK DATA | Uses hardcoded mock metrics (₹1,48,500, 1,248 members, etc.) |
| KYC verification queue | ⚠️ MOCK DATA | Hardcoded `mockPendingKYC` array |
| Outfit approval queue | ⚠️ MOCK DATA | Hardcoded `mockPendingOutfits` array |
| Transaction charts | ⚠️ MOCK DATA | Hardcoded `transactionData` array |
| Category distribution | ⚠️ MOCK DATA | Hardcoded `categoryDistribution` array |

### Admin Features Checklist

| Feature | Status |
|---|---|
| Dashboard overview | ⚠️ EXISTS (mock data) |
| User management | ❌ NOT IMPLEMENTED |
| Seller management | ❌ NOT IMPLEMENTED |
| Outfit management | ❌ NOT IMPLEMENTED |
| Booking management | ❌ NOT IMPLEMENTED |
| Revenue management | ❌ NOT IMPLEMENTED |
| Reports/exports | ❌ NOT IMPLEMENTED |
| System logs viewer | ❌ NOT IN ADMIN UI |
| Real-time metrics | ❌ NOT IMPLEMENTED |

> [!WARNING]
> **The admin portal is a UI mockup only.** All data is hardcoded. No real API calls are made. The approve/reject buttons only modify local state (React `useState`), not the database. The backend has an `admin` package with real endpoints, but the frontend does not call them.

### Backend Admin API Available

The backend has admin endpoints in [admin.ts](file:///y:/swetha/Kloset/frontend/lib/api/admin.ts) (2,994 bytes) that are NOT used by the admin dashboard.

### Required Fixes

| Fix | Priority |
|---|---|
| Connect admin dashboard to real API endpoints | 🔴 CRITICAL |
| Build user management page | 🟡 HIGH |
| Build seller management page | 🟡 HIGH |
| Build outfit management page | 🟡 HIGH |
| Build booking management page | 🟡 HIGH |
| Build revenue dashboard with real data | 🟡 HIGH |
| Remove all mock data | 🔴 CRITICAL |

---

## 6. Recommendation Engine Audit

### Current Implementation

| Feature | Status | Details |
|---|---|---|
| Similar products | ⚠️ BASIC | [outfit/[id]/page.tsx#L67-L73](file:///y:/swetha/Kloset/frontend/app/outfit/%5Bid%5D/page.tsx#L67-L73) — Fetches same-category outfits, calls it "Recommendations" |
| Recently viewed | ❌ NOT IMPLEMENTED | No `localStorage` or API tracking |
| Trending | ⚠️ BASIC | Homepage calls `outfitsAPI.getTrending(8)` — backend may just return popular |
| Recommended for you | ❌ NOT IMPLEMENTED | No personalization algorithm |
| Customers also viewed | ❌ NOT IMPLEMENTED | No view tracking correlated |
| Based on booking history | ❌ NOT IMPLEMENTED | No booking-to-recommendation pipeline |
| Based on wishlist | ❌ NOT IMPLEMENTED | No wishlist-to-recommendation pipeline |
| "Because you viewed this" | ❌ NOT IMPLEMENTED | No view history tracking |
| Amazon-style recommendation rails | ❌ NOT IMPLEMENTED | No multi-section recommendation layout |

### Current "Recommendation" Logic

The product page fetches "similar" outfits by simply browsing the same category:
```typescript
const sim = await outfitsAPI.browse({ category: data.category, per_page: 5 });
```
This is NOT a recommendation engine — it's a category filter.

### Required Implementation

| Feature | Priority | Approach |
|---|---|---|
| View tracking (recently viewed) | 🔴 CRITICAL | `localStorage` + API event tracking |
| Collaborative filtering | 🟡 HIGH | "Users who rented X also rented Y" |
| Content-based filtering | 🟡 HIGH | Category, color, occasion, price similarity |
| Wishlist-based suggestions | 🟡 HIGH | Analyze wishlisted items for patterns |
| Booking history suggestions | 🟡 HIGH | Repeat category/occasion preferences |
| UI recommendation rails | 🔴 CRITICAL | Homepage + product page multi-section layout |

---

## 7. Session Persistence Audit

### Current Implementation

| Feature | Status | Details |
|---|---|---|
| Login persistence | ✅ IMPLEMENTED | Zustand `persist` middleware + `localStorage` |
| Access token storage | ✅ `localStorage` | `kloset_access_token` |
| Refresh token storage | ✅ `localStorage` | `kloset_refresh_token` |
| User data storage | ✅ `localStorage` | `kloset_user` |
| Cookie flag | ✅ SET | `kloset-auth=true` cookie for middleware |
| Refresh token flow | ✅ IMPLEMENTED | [client.ts#L46-L131](file:///y:/swetha/Kloset/frontend/lib/api/client.ts#L46-L131) — Automatic 401 retry with refresh |
| Logout cleanup | ✅ IMPLEMENTED | Clears all storage + cookie |
| Session recovery on mount | ✅ IMPLEMENTED | [auth.store.ts#L73-L116](file:///y:/swetha/Kloset/frontend/stores/auth.store.ts#L73-L116) — `initializeAuth()` verifies token on load |
| Protected route redirect | ✅ IMPLEMENTED | [middleware.ts](file:///y:/swetha/Kloset/frontend/middleware.ts) — Checks `kloset-auth` cookie |
| Failed queue handling | ✅ IMPLEMENTED | Queues failed requests during token refresh |

### Verdict

> [!NOTE]
> **Session persistence is the BEST implemented feature in the application.** The Zustand + localStorage + Axios interceptor pattern is production-grade. Token refresh, queue management, and protected route handling are all correctly implemented.

### Minor Improvements

| Fix | Priority |
|---|---|
| Add `httpOnly` cookie via backend for SSR routes | 🟢 LOW |
| Add token expiry check before API calls | 🟢 LOW |
| Add "session expired" toast notification | 🟢 LOW |

---

## 8. UX Audit

### Critical UX Problems Identified

#### 8.1 Global Issues

| Problem | Severity | Details |
|---|---|---|
| No back navigation | 🔴 CRITICAL | No back button on any page |
| Tiny buttons | 🔴 CRITICAL | Most buttons are 10-12px text with minimal padding |
| Tiny text throughout | 🔴 CRITICAL | Body text as small as 8-10px in many places |
| No loading states on navigation | 🟡 HIGH | Page transitions show no feedback |
| No error boundaries per section | 🟡 HIGH | Single error.tsx for entire app |
| No skeleton loading on page transitions | 🟡 HIGH | Abrupt content swaps |
| Navbar search collapses to icon on desktop | 🟡 HIGH | Search should always be visible |
| No breadcrumbs on most pages | 🟡 HIGH | Only product page has breadcrumbs |

#### 8.2 Homepage Issues

| Problem | Severity | Details |
|---|---|---|
| Hero depends on Unsplash | 🔴 CRITICAL | External images may fail/change |
| Mock data fallback everywhere | 🔴 CRITICAL | 8 hardcoded mock outfits in [page.tsx#L28-L63](file:///y:/swetha/Kloset/frontend/app/page.tsx#L28-L63) |
| Mock celebrity reviews | 🔴 CRITICAL | "Mira Rajput", "Alia Bhatt", "Ranveer Singh" — legally problematic fake testimonials |
| No AI stylist CTA | 🟡 HIGH | AI features completely absent from homepage |
| No "Recommended for you" section | 🟡 HIGH | Missing personalization |
| No "Recently viewed" section | 🟡 HIGH | Missing re-engagement |
| Horizontal scroll has no snap | 🟡 HIGH | Outfit rail has no scroll-snap |
| Reviews section has no grid wrapper | 🟡 HIGH | Reviews stack vertically without proper grid |

#### 8.3 Product Page Issues

| Problem | Severity | Details |
|---|---|---|
| No image zoom | 🟡 HIGH | Images are view-only |
| Mock reviews hardcoded | 🔴 CRITICAL | [page.tsx#L24-L28](file:///y:/swetha/Kloset/frontend/app/outfit/%5Bid%5D/page.tsx#L24-L28) — 3 fake reviews |
| "Recommendations" is just same-category | 🟡 HIGH | Not a real recommendation |
| No "Frequently rented together" | 🟡 HIGH | Missing cross-sell |
| No seller profile link | 🟡 HIGH | Seller name shown but not clickable |
| No trust indicators beyond "Razorpay Escrow" | 🟡 HIGH | Needs verified seller badge, rating count, etc. |
| No delivery timeline calculator | 🟡 HIGH | Just shows static "+3 days" |
| No rental protection info | 🟡 HIGH | No damage protection upsell |

#### 8.4 Discover Page Issues

| Problem | Severity | Details |
|---|---|---|
| Filter sidebar NOT sticky | 🔴 CRITICAL | Scrolls away with page content |
| Missing filters: Color, Occasion, Brand, Gender | 🟡 HIGH | Only has Category, Price, Size, Rating, City |
| No "Availability" filter | 🟡 HIGH | Can't filter by available dates |
| No search within filters | 🟡 HIGH | No typeahead for categories |
| Empty state is bland | 🟡 HIGH | Just text, no illustration |

#### 8.5 Authentication Issues

| Problem | Severity | Details |
|---|---|---|
| Login form is standard card | 🟡 HIGH | Not a modern split-screen layout |
| Register form is 15KB monolith | 🟡 HIGH | [RegisterForm.tsx](file:///y:/swetha/Kloset/frontend/components/auth/RegisterForm.tsx) — No multi-step flow |
| No progress indicators | 🟡 HIGH | Registration has no steps |
| Password validation feedback is minimal | 🟡 HIGH | Only "at least 8 characters" |

#### 8.6 Dashboard Issues

| Problem | Severity | Details |
|---|---|---|
| Renter dashboard has mock bookings | 🔴 CRITICAL | [page.tsx#L33-L66](file:///y:/swetha/Kloset/frontend/app/renter/dashboard/page.tsx#L33-L66) — Hardcoded mock data |
| Renter dashboard has mock wishlist | 🔴 CRITICAL | [page.tsx#L69-L78](file:///y:/swetha/Kloset/frontend/app/renter/dashboard/page.tsx#L69) — Hardcoded mock data |
| Seller dashboard is 49KB monolith | 🟡 HIGH | Single file, likely has same mock issues |
| Admin dashboard uses all mock data | 🔴 CRITICAL | Zero real API calls |
| No AI stylist in renter dashboard | 🟡 HIGH | Missing AI feature |
| No "Recently viewed" in dashboard | 🟡 HIGH | Missing re-engagement |
| No analytics in seller dashboard | 🟡 HIGH | No real seller analytics |

#### 8.7 Checkout Issues

| Problem | Severity | Details |
|---|---|---|
| Checkout page is 55KB | 🟡 HIGH | Likely over-engineered or has issues |
| No address management visible | 🟡 HIGH | Address selection unclear |
| No order summary sidebar | 🟡 HIGH | Standard checkout pattern missing |

---

## 9. Frontend V2 Rebuild Specification

### Design System Requirements

```
Typography:
  - Display: Playfair Display / Cormorant Garamond
  - Body: Inter / DM Sans (currently using Inter-like system font)
  - Mono: JetBrains Mono / Fira Code

Spacing Scale (rem):
  - xs: 0.25rem (4px)
  - sm: 0.5rem (8px)
  - md: 1rem (16px)
  - lg: 1.5rem (24px)
  - xl: 2rem (32px)
  - 2xl: 3rem (48px)
  - 3xl: 4rem (64px)

Minimum Touch Target: 44px × 44px
Minimum Font Size: 14px (body), 12px (captions)
Minimum Button Padding: 12px vertical, 24px horizontal
```

### Page-by-Page Rebuild Requirements

#### Homepage V2
- Full-viewport hero with video/parallax background
- Persistent search bar in hero
- AI Stylist CTA prominently placed
- 10 content sections: Trending, Recommended, New Arrivals, Wedding, Party, Traditional, Western, Celebrity Inspired, Top Rated, Nearby
- Each section as a horizontal scroll rail with snap
- Real data only — remove ALL mock data

#### Product Page V2
- Full-width image gallery with zoom on hover
- Sticky details panel on scroll
- Trust indicators: Verified Seller badge, Rental count, Rating breakdown
- 6 recommendation sections: Similar, Customers Also Viewed, Recommended, Trending Near You, Based on Wishlist, Because You Viewed
- Live reviews from API
- Delivery timeline calculator
- Damage protection upsell

#### Discover Page V2
- **Sticky** filter sidebar (CSS `position: sticky; top: 70px`)
- Full filter set: Category, Price, Size, Color, Occasion, Brand, Gender, Rating, Availability
- Infinite scroll or pagination
- Sort by relevance, price, rating, newest

#### Auth Pages V2
- Split-screen layout (image left, form right)
- Multi-step registration with progress bar
- Social login (Google) prominently placed
- Real-time validation with visual feedback

#### Dashboards V2
- Card-based layouts
- Real API data
- AI Stylist integration
- Quick actions
- Activity timeline

### Animation Requirements

```
Framework: Framer Motion (already installed)

Required animations:
  - Page transitions (fade + slide)
  - Card hover (lift + shadow)
  - Skeleton loading on all data-dependent components
  - Button press (scale 0.98)
  - Modal/drawer slide-in
  - Scroll-triggered section reveal
  - Image gallery transitions
  - Filter toggle animations
```

### Performance Targets

```
Lighthouse Scores (Target):
  - Performance: > 90
  - Accessibility: > 90
  - Best Practices: > 90
  - SEO: > 90

Requirements:
  - Next.js Image optimization (already using next/image)
  - Lazy loading for below-fold images
  - Code splitting per route (automatic with App Router)
  - Bundle size monitoring
  - No layout shift (CLS < 0.1)
```

---

## 10. Exact Fixes Required

### 🔴 CRITICAL (Must fix before deployment)

| # | Fix | Component |
|---|---|---|
| 1 | Fix CORS panic — validate `frontendURL` in `CORSMiddleware` | Backend |
| 2 | Set `FRONTEND_URL` on Render (not `*`) | DevOps |
| 3 | Set `GOOGLE_CLIENT_ID` on Render | DevOps |
| 4 | Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID` on Vercel | DevOps |
| 5 | Add production domain to Google Console OAuth | DevOps |
| 6 | Set Razorpay live keys on Render + Vercel | DevOps |
| 7 | Remove ALL mock/fake data from frontend | Frontend |
| 8 | Remove fake celebrity testimonials (legal risk) | Frontend |
| 9 | Connect chatbot to Gemini API | Full-stack |
| 10 | Connect admin dashboard to real API | Frontend |
| 11 | Build Gemini AI service in backend | Backend |

### 🟡 HIGH (Should fix for launch)

| # | Fix | Component |
|---|---|---|
| 12 | Make filter sidebar sticky on discover page | Frontend |
| 13 | Add back navigation to all pages | Frontend |
| 14 | Increase minimum font sizes across site | Frontend |
| 15 | Increase button sizes and touch targets | Frontend |
| 16 | Build recommendation engine (at minimum: recently viewed + similar) | Full-stack |
| 17 | Build AI stylist chat connected to Gemini | Full-stack |
| 18 | Connect renter dashboard to real booking/wishlist APIs | Frontend |
| 19 | Add image zoom on product page | Frontend |
| 20 | Build multi-step registration flow | Frontend |
| 21 | Add missing filters: Color, Occasion, Brand, Gender | Frontend |
| 22 | Configure Razorpay webhook URL | DevOps |

### 🟢 MEDIUM (Post-launch improvements)

| # | Fix | Component |
|---|---|---|
| 23 | Add page transition animations | Frontend |
| 24 | Add scroll-triggered section reveals | Frontend |
| 25 | Build seller analytics dashboard | Frontend |
| 26 | Add httpOnly cookie for SSR auth | Full-stack |
| 27 | Add "Frequently rented together" | Full-stack |
| 28 | Add delivery timeline calculator | Frontend |
| 29 | Add damage protection upsell on product page | Frontend |
| 30 | Build complete admin panel (users, sellers, outfits, bookings, revenue) | Full-stack |

---

## Summary Verdict

| Area | Score | Status |
|---|---|---|
| Google OAuth | 6/10 | Code exists but fails due to missing env vars |
| Razorpay | 5/10 | Code exists but uses test keys, CORS blocks it |
| Chatbot | 2/10 | Keyword bot pretending to be AI |
| AI Features | 0/10 | Zero AI functionality implemented |
| Admin Portal | 2/10 | Pure mockup with hardcoded data |
| Recommendation Engine | 1/10 | Category filter labeled as "Recommendations" |
| Session Persistence | 9/10 | Well-implemented, production-grade |
| UX/UI | 4/10 | Functional but congested, tiny, mock-heavy |

> [!CAUTION]
> **Overall Assessment: Kloset is a well-architected prototype with critical production gaps.** The backend architecture is solid (Fiber, GORM, proper module separation), and auth/session management is well done. However, the frontend is heavily reliant on mock data, has zero AI functionality despite configuration, and several env var misconfigurations prevent core features (OAuth, payments) from working in production. The UI needs a complete design overhaul to meet premium fashion marketplace standards.

---

*End of audit. Awaiting approval to begin implementation.*
