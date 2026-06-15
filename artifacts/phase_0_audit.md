# Phase 0 — Endpoint + Contract Extraction

This document provides a comprehensive inventory of all endpoints, environment configs, state stores, integrations, and business logic parsed from the current `frontend/` directory before proceeding to deletion.

---

### API Endpoints Used
List of all unique URL patterns called via fetch/axios/apiClient:
- `POST /auth/register` → `lib/api/auth.ts` → registers a new user account
- `POST /auth/login` → `lib/api/auth.ts` → logs in a user using email and password
- `POST /auth/google` → `lib/api/auth.ts` → handles registration/login using Google OAuth credentials
- `POST /auth/refresh` → `lib/api/auth.ts` & `lib/api/client.ts` → refreshes expired access tokens
- `POST /auth/logout` → `lib/api/auth.ts` → logs out the currently authenticated user
- `GET /auth/me` → `lib/api/auth.ts` → returns the logged-in user profile details
- `POST /bookings` → `lib/api/bookings.ts` → creates a new booking order for an outfit
- `GET /bookings/{id}` → `lib/api/bookings.ts` → retrieves detailed info for a single booking
- `GET /bookings/mine` → `lib/api/bookings.ts` → retrieves a list of bookings made by the logged-in renter
- `GET /bookings/seller` → `lib/api/bookings.ts` → retrieves a list of bookings for outfits owned by the logged-in seller
- `PATCH /bookings/{id}/status` → `lib/api/bookings.ts` → updates the rental state/status of a booking
- `POST /bookings/{id}/cancel` → `lib/api/bookings.ts` → cancels a booking (includes cancellation reasoning)
- `GET /outfits` → `lib/api/outfits.ts` → browses and filters the catalog of outfits
- `GET /outfits/{id}` → `lib/api/outfits.ts` → retrieves detail view of a specific outfit
- `GET /outfits/trending` → `lib/api/outfits.ts` → retrieves a list of trending/popular outfits
- `POST /outfits` → `lib/api/outfits.ts` → creates a new outfit listing (seller operation)
- `PUT /outfits/{id}` → `lib/api/outfits.ts` → updates a specific outfit listing
- `DELETE /outfits/{id}` → `lib/api/outfits.ts` → deletes a specific outfit listing
- `PUT /outfits/{id}/submit` → `lib/api/outfits.ts` → submits an outfit for admin verification/approval
- `POST /outfits/{id}/view` → `lib/api/outfits.ts` → tracks outfit page views/impressions
- `GET /wishlist` → `lib/api/outfits.ts` → retrieves a list of outfits saved in the user's wishlist
- `POST /wishlist/{outfitId}` → `lib/api/outfits.ts` → adds an outfit to the user's wishlist
- `DELETE /wishlist/{outfitId}` → `lib/api/outfits.ts` → removes an outfit from the user's wishlist
- `GET /seller/outfits` → `lib/api/outfits.ts` → retrieves list of outfits listed by the logged-in seller
- `POST /disputes` → `lib/api/disputes.ts` → files a new rental/deposit dispute
- `POST /reviews` → `lib/api/reviews.ts` → writes a rating and review comments for a booking
- `GET /reviews/outfit/{outfitId}` → `lib/api/reviews.ts` → retrieves all reviews associated with an outfit
- `GET /reviews` → `lib/api/reviews.ts` → lists recent global reviews (with optional limit)
- `POST /support/tickets` → `lib/api/support.ts` → renter/seller creates a support ticket
- `GET /support/tickets` → `lib/api/support.ts` → gets support tickets for the current user
- `GET /admin/support/tickets` → `lib/api/support.ts` → retrieves all tickets globally (admin-only)
- `PUT /admin/support/tickets/{id}/status` → `lib/api/support.ts` → changes the resolution status of a support ticket
- `POST /admin/support/tickets/{id}/reply` → `lib/api/support.ts` → sends a reply from support agents/admins on a ticket
- `GET /users/profile` → `lib/api/user.ts` → retrieves active profile information
- `PUT /users/profile` → `lib/api/user.ts` → updates active profile information
- `GET /users/addresses` → `lib/api/user.ts` → retrieves saved user addresses
- `POST /users/addresses` → `lib/api/user.ts` → adds a new shipping/pickup address
- `DELETE /users/addresses/{id}` → `lib/api/user.ts` → deletes a saved address
- `PUT /users/addresses/{id}/default` → `lib/api/user.ts` → sets an address as default shipping destination
- `GET /admin/stats` → `lib/api/admin.ts` → gets platform-wide operational KPIs and stats
- `GET /admin/aiops` → `lib/api/admin.ts` → returns technical health metrics for the AI engine
- `GET /admin/kyc` → `lib/api/admin.ts` → lists outstanding seller KYC submissions
- `PUT /admin/kyc/{userId}/approve` → `lib/api/admin.ts` → approves seller KYC
- `PUT /admin/kyc/{userId}/reject` → `lib/api/admin.ts` → rejects seller KYC with feedback reasoning
- `GET /admin/outfits` → `lib/api/admin.ts` → lists outfit listings waiting for approval
- `PUT /admin/outfits/{id}/approve` → `lib/api/admin.ts` → approves an outfit listing
- `PUT /admin/outfits/{id}/reject` → `lib/api/admin.ts` → rejects an outfit listing with reasoning
- `GET /admin/disputes` → `lib/api/admin.ts` → lists active dispute logs
- `PUT /admin/disputes/{id}/resolve` → `lib/api/admin.ts` → resolves disputes, adjusting escrow payouts/refunds
- `GET /admin/logs` → `lib/api/admin.ts` → returns audit/security logging lines
- `POST /payments/verify` → `app/booking/checkout/page.tsx` & `app/dashboard/page.tsx` → verifies Razorpay signature and finalizes payment
- `POST /ai/chat` → `stores/ai-chat.store.ts` → sends query to Gemini-powered AI Stylist assistant and returns recommendations

---

### Auth Tokens / Headers
- **Authorization header pattern**:
  - `Authorization: Bearer <kloset_access_token>`
  - Set dynamically in Axios interceptor when `kloset_access_token` is present in `localStorage`.
- **Token/Profile keys in localStorage**:
  - `kloset_access_token`: Access JWT token
  - `kloset_refresh_token`: Refresh JWT token
  - `kloset_user`: JSON-serialized user data
- **Cookies**:
  - `kloset-auth`: Cookie used to store verification state (e.g. `kloset-auth=true`) for routing/middleware checks. Cleared on logout.

---

### Environment Variables
Variables referenced under `process.env` / `NEXT_PUBLIC_`:
- `NEXT_PUBLIC_API_URL`: Backend API base URL
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Cloud name for Cloudinary media uploads
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`: Upload preset for Cloudinary media uploads
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`: Razorpay public Key ID
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Google OAuth Web Client ID
- `NEXT_PUBLIC_SENTRY_DSN`: Sentry DSN configuration
- `NEXT_PUBLIC_POSTHOG_KEY`: PostHog SDK analytics key
- `NEXT_PUBLIC_POSTHOG_HOST`: PostHog host URL
- `VERCEL_ENV`: Vercel environment flag

---

### Zustand Stores
List of all stores, shapes, and their consumers:
1. `stores/ai-chat.store.ts` (`useAiChatStore`):
   - **State Shape**:
     - `messages`: `ChatMessage[]` (`{ sender: 'user' | 'bot'; text: string; timestamp: string }`)
     - `isLoading`: `boolean`
     - `isOpen`: `boolean`
   - **Consumers**: `components/ai/AIDrawer.tsx`, `app/support/page.tsx`
2. `stores/auth.store.ts` (`useAuthStore`):
   - **State Shape**:
     - `user`: `User | null`
     - `accessToken`: `string | null`
     - `refreshToken`: `string | null`
     - `isAuthenticated`: `boolean`
     - `isLoading`: `boolean`
     - `isInitialized`: `boolean`
   - **Consumers**: `components/layout/SellerLayout.tsx`, `components/layout/RenterNavbar.tsx`, `components/layout/Navbar.tsx`, `components/layout/AppShell.tsx`, `components/layout/AdminLayout.tsx`, `components/auth/RegisterForm.tsx`, `components/auth/LoginForm.tsx`, `app/support/page.tsx`, `app/page.tsx`, `app/seller/support/page.tsx`, `app/seller/page.tsx`, `app/dashboard/page.tsx`, `app/booking/checkout/page.tsx`
3. `stores/booking.store.ts` (`useBookingStore`):
   - **State Shape**:
     - `outfitId`, `outfitTitle`, `outfitImage`: `string | null`
     - `selectedSize`: `string`
     - `selectedDuration`: `1 | 3 | 7`
     - `pickupDate`, `returnDate`: `string | null`
     - `deliveryType`: `'pickup' | 'delivery'`
     - `addressId`: `string | null`
     - `rentalAmount`, `securityDeposit`, `deliveryFee`, `platformFee`: `number`
     - `paymentStatus`: `'idle' | 'processing' | 'success' | 'failed'`
     - `orderId`: `string | null`
   - **Consumers**: `app/outfit/[id]/page.tsx`
4. `stores/cart.store.ts` (`useCartStore`):
   - **State Shape**:
     - `cartItems`: `CartItem[]` (containing `id`, `title`, `price`, `deposit`, `size`, `startDate`, `endDate`, `quantity`, `image`, `sellerId?`, `sellerName?`)
     - `couponCode`: `string`
     - `discountPercentage`: `number`
     - `isOpen`: `boolean`
   - **Consumers**: `components/layout/RenterNavbar.tsx`, `components/layout/Navbar.tsx`, `components/cart/CartDrawer.tsx`, `app/outfit/[id]/page.tsx`, `app/booking/checkout/page.tsx`
5. `stores/filter.store.ts` (`useFilterStore`):
   - **State Shape**:
     - `filters`: `OutfitFilters` (containing query, city, category, size, price bounds, occasion, sorting, and pagination offset)
     - `isFilterOpen`: `boolean`
   - **Consumers**: None (Legacy/unused store; discover filters are managed internally in `app/discover/page.tsx`)
6. `stores/support.store.ts` (`useSupportStore`):
   - **State Shape**:
     - `tickets`: `SupportTicket[]` (containing `id`, `renterName`, `renterEmail`, `subject`, `description`, `priority`, `status`, `createdAt`, `chatHistory`)
   - **Consumers**: `app/support/page.tsx`, `app/seller/support/page.tsx`, `app/admin/support/page.tsx`

---

### Third-Party SDKs Initialized
- **Razorpay**:
  - Dynamic initialization in checkout (`app/booking/checkout/page.tsx`) and billing retry (`app/dashboard/page.tsx`) via loading the dynamic script `https://checkout.razorpay.com/v1/checkout.js` and instantiating `(window as any).Razorpay`.
  - Keys: `process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID` (defaults to `'rzp_test_mock_keys'`).
  - Callback Handlers:
    - `handler`: redirects to signature verification `POST /payments/verify` on successful checkout.
    - `modal.ondismiss`: triggers cancellation errors when closed by user.
- **Cloudinary**:
  - Image uploading helper in `lib/cloudinary.ts` using unsigned uploads via `XMLHttpRequest`.
  - Cloud Name: `process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (defaults to `'demo'`).
  - Upload Preset: `process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (defaults to `'kloset_uploads'`).
  - Target URL: `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`.
  - Uses progress tracking callback with `xhr.upload.onprogress`.
- **Google OAuth**:
  - Google Sign-In SDK is initialized via `<GoogleOAuthProvider>` wrapper component in `components/providers/GoogleProvider.tsx` using `process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID`.
  - Handles authentication on successful user credential response using `authAPI.googleLogin({ credential })` pointing to backend route `POST /auth/google`.

---

### Critical Business Logic (DO NOT LOSE)
- **Rental Duration Logic**:
  - Start date defaults to tomorrow.
  - End date calculations: `end = new Date(startDate) + selectedDuration`.
  - Inclusive rental duration calculations: `calculateRentalDays = (start, end) => diffDays + 1` (inclusive of start and end dates).
- **Pricing & Fee Formulas**:
  - subtotal = `item.price * rentalDays * item.quantity`
  - securityDeposit = `item.deposit * item.quantity`
  - platformFee = 5% of subtotal (`Math.round(subtotal * 0.05)`)
  - tax = 8% of subtotal (`Math.round(subtotal * 0.08)`)
  - shippingFee = flat rate of ₹25 if cart contains items.
  - discount = percentage-based coupon discount (`Math.round(subtotal * (discountPercentage / 100))`)
  - total = `subtotal + securityDeposit + platformFee + shippingFee + tax - discount`
- **Validation logic**:
  - Max image uploads: 6 images max per outfit listing.
  - Allowed image extensions: `image/jpeg`, `image/png`, `image/webp`, and `image/heic`.
  - Max image size: 10MB limit.
- **Double-Multiplication Discrepancy (CRITICAL WARNING)**:
  - In `outfit/[id]/page.tsx`, the added cart item price is mapped as `price: priceMap[selectedDuration]` (which is already the total rental price for the selected duration: 1, 3, or 7 days).
  - However, in `cart.store.ts` calculations, subtotal is computed as: `item.price * days * item.quantity` (where `days = calculateRentalDays(item.startDate, item.endDate)`).
  - This results in a compounding double-multiplication error (e.g. rent price is multiplied by the number of rental days twice), causing vastly inflated subtotal calculations in the cart drawer.
