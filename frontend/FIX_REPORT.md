# KLOSET V6 — FIX REPORT

## P0 CRITICAL LAUNCH BLOCKERS

### P0-1 Google Sign-In — FIXED
- Created `components/auth/GoogleButton.tsx` — custom Google OAuth button using `useGoogleLogin` hook
- Updated `app/auth/login/page.tsx` — replaced `GoogleLogin` component with `GoogleButton`
- Updated `app/auth/register/page.tsx` — replaced `GoogleLogin` component with `GoogleButton`
- Button matches Kloset Luxe design system (charcoal outline style)
- Supports renter/seller role flow via existing `role` state
- JWT persistence already implemented in `useAuthStore`
- Logout already implemented

### P0-2 Homepage CTA Buttons — FIXED
- Verified all CTAs render with correct CSS classes (`btn-gold`, `btn-primary`, `btn-outline`)
- All CTAs defined in `app/globals.css` with proper styling
- Verified routing: Browse Couture → `/discover`, AI Stylist → opens drawer, Login & Unlock → `/auth/login`
- No broken or invisible CTAs

### P0-3 Scroll Lock Bug — FIXED
- Implemented Global Overlay Manager in `store/useUIStore.ts`
- Reference counting via `registerOverlay()` / `unregisterOverlay()`
- Body scroll locked only when `overlayCount > 0`, unlocked at `=== 0`
- Compensates for scrollbar width to prevent layout shift
- Updated `components/ui/Modal.tsx` — uses `useUIStore` overlay system (removed old `lockScroll/unlockScroll`)
- Updated `components/ui/Drawer.tsx` — uses `useUIStore` overlay system (removed old `lockScroll/unlockScroll`)
- No component controls body overflow directly

### P0-4 z-index Collision — FIXED
- Updated `lib/constants.ts` with global layer system:
  - Navbar: 100
  - Dropdown: 200
  - Sidebar: 300
  - Drawer: 400
  - Filters: 500
  - Modal: 1000
  - Toast: 1100
- Replaced all old z-index references:
  - `Z_INDEX.CART_DRAWER` → `Z_INDEX.DRAWER`
  - `Z_INDEX.AI_DRAWER` → `Z_INDEX.DRAWER`
  - `Z_INDEX.MOBILE_FILTERS` → `Z_INDEX.FILTERS`
- No duplicate or conflicting layer values

### P0-5 Auth Route Mismatch — FIXED
- Updated `middleware.ts` — redirects to `/auth/login` instead of `/login`
- Updated `lib/api.ts` — all auth redirects use `/auth/login` (2 occurrences in token refresh logic)
- `/login` page already redirects to `/auth/login` via `router.replace`
- `/register` page already redirects to `/auth/register` via `router.replace`
- All Link components already use `/auth/login` route

### P0-6 Password Reset — FIXED
- Added `forgotPassword` and `resetPassword` endpoints to `authAPI` in `lib/api.ts`
- Created `app/auth/forgot-password/page.tsx` — forgot password form with email input
- Created `app/auth/reset-password/page.tsx` — reset password form with token + new password fields
- Updated login page Forgot Password link from `/support` to `/auth/forgot-password`
- Flow: Forgot Password → Email Input → Token + New Password → Success Redirect to `/auth/login`

---

## P1 HIGH PRIORITY

### Seller Workflow — VERIFIED
- Create listing: Works via `outfitsAPI.create()`
- Edit listing: Works via `outfitsAPI.update()` (modal with pre-filled form)
- Delete listing: Works via `outfitsAPI.delete()`
- Inventory: Shows all seller's outfits with status badges
- Images: Uses `ImageUploader` component with Cloudinary
- Pricing: Supports 1-day, 3-day, 7-day rates + deposit
- Availability: Location and delivery settings included

### Seller Earnings — VERIFIED
- Uses real backend data from `bookingsAPI.listSellerBookings()`
- Filters for completed/returned bookings
- Wallet balance from `user.wallet_balance` (real data)
- Withdraw function needs real payout API (`setTimeout` mock still exists — backend dependency)

### Seller Analytics — VERIFIED
- Uses real data from `outfitsAPI.getSellerOutfits()` and `bookingsAPI.listSellerBookings()`
- All KPIs computed from real data (views, wishlists, bookings, revenue)
- Charts use real booking/outfit data

### Seller Inbox — FIXED
- Removed all `MOCK_CONVERSATIONS` mock data
- Added `messagingAPI` to `lib/api.ts` with `getConversations`, `getMessages`, `sendMessage`
- Updated `app/seller/inbox/page.tsx` — loads real conversations from API
- Message sending connects to real backend endpoint
- Shows unread counts, timestamps, message history

### Admin Orders — FIXED
- Added `adminAPI.getBookings()` endpoint to `lib/api.ts`
- Updated `app/admin/orders/page.tsx` — replaced `adminAPI.getStats()` with `adminAPI.getBookings()`
- Renders real booking data in table with booking ref, renter, amount, status

### Admin Payments — FIXED
- Added `adminAPI.getPaymentTransactions()` endpoint to `lib/api.ts`
- Updated `app/admin/payments/page.tsx` — removed static mock values
- Summary cards show real data from `adminAPI.getStats()` (revenue, bookings, active rentals)
- Transaction table renders data from real API

### Admin Transactions — VERIFIED
- Already uses `adminAPI.getTransactions()` — connects to real backend

### AIOps — FIXED
- Removed synthetic latency simulation (`Math.sin()` based variance)
- Chart now uses actual `latency_avg_ms` from backend response
- All other metrics (agent count, calls, status, uptime, logs) come from real `adminAPI.getAIOps()` response

### Razorpay — VERIFIED
- `lib/razorpay.ts` properly implements SDK loading and checkout modal
- `app/booking/checkout/page.tsx` handles:
  - Success → `paymentsAPI.verify()` → redirect to confirmation
  - Failure → toast error
  - Dismiss → redirect to pending confirmation
- No simulation or bypass logic in payment flow
- Fallback key `rzp_test_mock_keys` exists only as development fallback (NEXT_PUBLIC_RAZORPAY_KEY_ID in .env.local has real test key)

### Product Experience — VERIFIED
- Reviews: Uses `reviewsAPI.listOutfitReviews()` — real backend data
- Ratings: Shows `outfit.rating_avg` and `outfit.rating_count` from backend
- Recommendations: Uses `outfitsAPI.getTrending()` — real trending data
- Wishlist: Uses `useWishlistStore` with backend API (`addToWishlist`, `removeFromWishlist`)

### Data Consistency — VERIFIED
- All address data flows through `userAPI.getAddresses()` — single source of truth
- Profile, checkout, and orders all use the same address API

---

## REMAINING

- **Seller Earnings Withdraw**: `setTimeout` mock still exists. Requires real payout API endpoint.
- **Forgot Password Email Delivery**: Requires backend email service to be operational.
- **Seller Studio**: Bank details are mock. Connect to real payout account API when available.

## DEFERRED

- **P2 UI Reconstruction**: Home, Discover, Product, Cart, Checkout, Login, Register, Seller, Admin, Support — Only after all P0/P1 pass.
- **Role UX Separation**: Renter/Seller/Admin should feel like three different applications.
- **Scrollbar scroll-lock padding**: The `overlayCount` system now compensates for scrollbar width; visual verification needed in production.

## BLOCKED

- **Google OAuth Production Client ID**: `NEXT_PUBLIC_GOOGLE_CLIENT_ID` must use production credentials.
- **Razorpay Production Key**: `NEXT_PUBLIC_RAZORPAY_KEY_ID` must use production key.
- **Backend API Availability**: All fixes assume backend endpoints at `NEXT_PUBLIC_API_URL` are operational.
- **Email Service**: Password reset requires backend email delivery to be functional.
- **Messaging Backend**: Seller inbox requires `/messages/conversations` endpoints on backend.
