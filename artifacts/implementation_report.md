# Kloset Fashion Rental Marketplace — Implementation Report

This report summarizes the entire technical architecture and implementation details of the **Kloset Fashion Rental Marketplace** built from scratch to date. The application consists of a high-performance **Go Fiber Backend**, a robust **PostgreSQL** database schema with composite indexing and full-text search, and a premium **Next.js 14 App Router** frontend featuring Zustand state management, a secure stepper checkout simulator, and custom floral-themed editorial design components.

---

## 1. Database Architecture & Schema (PostgreSQL)

The database layers are implemented using 9 migration steps. They utilize key PostgreSQL capabilities such as custom enums, GIN indexes, text-search vectors, and conditional triggers.

### Database Tables & Schema Overview

| Migration File | Tables Created | Key Features & Design Choices |
| :--- | :--- | :--- |
| **001_users.sql** | `users`, `user_addresses`, `refresh_tokens` | Defines `user_role` (`renter`, `seller`, `admin`) and `kyc_status`. Supports trust scoring, wallet balances, and encrypted PAN/Aadhaar hashes for verification. |
| **002_outfits.sql** | `outfits`, `outfit_images`, `outfit_availability_blocks`, `wishlists` | Features an `outfit_status` enum (e.g. `cleaning`, `rented`, `active`). Leverages a PostgreSQL trigger to update a `search_vector` column for full-text search. |
| **003_bookings.sql** | `bookings` | Tracks pickup, return, size, delivery type, payment details (Razorpay IDs), security deposits, and conditions on return. |
| **004_payments.sql** | `transactions` | Handles transaction logs for rental payments, security deposit escrow payments, refunds, and seller payouts. |
| **005_reviews.sql** | `reviews` | Associates reviews with bookings, validating ratings (1-5 stars) and storing array of evidence photos. |
| **006_notifications.sql** | `notifications` | Supports multi-channel messaging (`in_app`, `push`, `sms`, `email`) for state updates (e.g. booking confirmation, KYC, disputes). |
| **007_disputes.sql** | `disputes` | Handles rental disputes with resolution outcomes like `full_refund_renter`, `split`, or `dismissed`. |
| **008_ai_events.sql** | `ai_events`, `recommendation_cache`, `trending_outfits` | Captures user behavioral events (`view`, `click`, `wishlist`) to build recommendations and compute daily trending scores. |
| **009_indexes.sql** | *None (Indexes only)* | Creates conditional performance indexes (e.g., booking overlap verification, unread notification count, and seller dashboard stats). |

---

## 2. Go Fiber Backend API

The backend is built in **Go 1.22** using the fast **Fiber v2** web framework, utilizing **GORM** for DB queries and **Redis** for rate limiting.

### Core Middlewares
- [auth.go](file:///y:/swetha/Kloset/backend/internal/middleware/auth.go): Decodes and validates JWT signatures, extracting claims (`sub`, `role`, `email`) and storing them in the Fiber local context (`c.Locals`).
- [role.go](file:///y:/swetha/Kloset/backend/internal/middleware/role.go): Enforces roles (e.g. `SellerOnly`) to prevent renters from adding or altering listings.
- [cors.go](file:///y:/swetha/Kloset/backend/internal/middleware/cors.go): Permits cross-origin requests specifically from the configured frontend URL.
- [ratelimit.go](file:///y:/swetha/Kloset/backend/internal/middleware/ratelimit.go): Uses Redis memory limits to block API spam (configured to 100 requests per minute with automatic IP fallback).

### Backend Routes & Operations

#### 🔐 Auth Module ([handler.go](file:///y:/swetha/Kloset/backend/internal/auth/handler.go))
- **`POST /api/v1/auth/register`**: Registers users, hashes passwords using bcrypt, and initiates profile defaults.
- **`POST /api/v1/auth/login`**: Authenticates credentials, returning access & refresh token structures.
- **`POST /api/v1/auth/refresh`**: Exchanges a valid refresh token for a brand-new access token.
- **`POST /api/v1/auth/logout`**: Removes the active session, invalidating refresh tokens.
- **`GET /api/v1/auth/me`**: Fetches the authenticated user’s credentials and profile data.

#### 👤 User Module ([handler.go](file:///y:/swetha/Kloset/backend/internal/user/handler.go))
- **`GET /api/v1/users/profile`** & **`PUT /api/v1/users/profile`**: Manages personal profile data, trust scores, and active KYC status.
- **`GET /api/v1/users/addresses`**: Lists all user addresses.
- **`POST /api/v1/users/addresses`**: Adds a new address with latitude/longitude coordinates.
- **`PUT /api/v1/users/addresses/:id/default`**: Sets a specific address as default.
- **`DELETE /api/v1/users/addresses/:id`**: Removes an address.

#### 👗 Outfit Module ([handler.go](file:///y:/swetha/Kloset/backend/internal/outfit/handler.go))
- **`GET /api/v1/outfits`**: Main browse and filter endpoint. Uses PostgreSQL GIN full-text index query matching (`plainto_tsquery`) and filters by city, categories, sizes, and price boundaries.
- **`GET /api/v1/outfits/trending`**: Retrieves trending outfits using the SQL calculation:
  $$\text{Score} = (0.3 \times \text{view\_count}) + (0.5 \times \text{wishlist\_count}) + (1.0 \times \text{booking\_count})$$
- **`GET /api/v1/outfits/:id`**: Outfit detailed payload, preloading seller information and sorting images by order.
- **`POST /api/v1/outfits`**: Creates a listing (Sellers only; limits to 6 images, marking the first image as primary).
- **`PUT /api/v1/outfits/:id`** & **`DELETE /api/v1/outfits/:id`**: Updates or deletes listings.
- **`PUT /api/v1/outfits/:id/submit`**: Submits a draft listing for admin review.
- **`GET /api/v1/wishlist`**: Fetches the user’s wishlisted outfits.
- **`POST /api/v1/wishlist/:outfitId`** & **`DELETE /api/v1/wishlist/:outfitId`**: Adds or removes an outfit from the wishlist.
- **`GET /api/v1/seller/outfits`**: Lists outfits listed by the authenticated seller.

---

## 3. Next.js 14 Frontend Architecture

The frontend is implemented in **Next.js 14** using the **App Router**. It coordinates interactions with the Go API and maintains client-side states with **Zustand**.

### API Client Integration ([client.ts](file:///y:/swetha/Kloset/frontend/lib/api/client.ts))
Uses a custom **Axios** client to handle seamless authentication flows:
- **Authorization Interceptor**: Grabs `kloset_access_token` from `localStorage` and injects it as a Bearer token.
- **Token Refresh Interceptor**: If the API returns a `401 Unauthorized` status code:
  1. The client intercepts the error.
  2. If a refresh is already in progress, it queues incoming requests to prevent server flooding.
  3. It calls `/auth/refresh` using `kloset_refresh_token` to retrieve a new token pair.
  4. It replays all queued requests with the updated token.
  5. If the refresh token is missing or expired, it wipes local credentials and redirects to `/login`.

### Zustand Stores
- **`auth.store.ts`**: Persists access/refresh tokens and basic user profile information.
- **`cart.store.ts`**: Coordinates checkout shopping carts, storing rental schedules (start & end dates), and calculating pricing values:
  - Daily rate $\times$ rental days
  - Flat shipping fee
  - Platform service fee (5%)
  - GST / Tax (8%)
  - Refundable security deposits
  - Validates discount codes (`FIRSTRENT` = 10% off, `KLOSETGOLD` = 15% off).
- **`filter.store.ts`**: Tracks search filters (query, categories, price, sizes, sort methods).
- **`booking.store.ts`**: Manages reservation parameters during checkout.
- **`support.store.ts`**: Orchestrates state for the custom support chat widget.

---

## 4. Frontend Pages & Routing

All routes are fully implemented with interactive UIs.

### Core User Pages
1. **Landing Page (`/`)**: Features a luxury editorial banner, collections showcase, scrolling trending outfits, a graphic "How It Works" step-by-step section, and an FAQ accordion.
2. **Discover / Search (`/discover`)**: Grid layout displaying filters (categories, size, price range, city) and sorting drop-downs alongside live outfit cards.
3. **Outfit Details (`/outfit/[id]`)**: Displays a high-resolution gallery, description, pricing tiers (1, 3, or 7 days), size options, interactive calendar date pickers, and seller details (trust scores, verification status).
4. **Listing Creation (`/outfit/new`)**: A multi-step form for sellers to upload listing details, size guides, fabric details, custom availability, and drag-and-drop image uploads.

### Core Dashboard Panels
1. **Renter Dashboard (`/renter/dashboard`)**: Displays active rentals, delivery trackers, past bookings history, review triggers, and refund statuses.
2. **Seller Dashboard (`/seller/dashboard`)**: Outlines seller metrics (total earnings, outfit views, active rentals), payout logs, listed inventory statuses, and charts.
3. **Admin Studio (`/admin-studio` & `/admin/dashboard`)**: Allows admins to review pending listings, manage KYC document queues (Aadhaar & PAN verification), check system logs, and adjudicate renter-seller disputes.

### Checkout Flow Wizard (`/booking/checkout`)
A five-step secure stepper that walks renters through the booking transaction:
```
Step 1: Address → Step 2: Delivery Mode → Step 3: Payment Gateway → Step 4: Final Review → Step 5: Success & Invoice
```
- **Address**: Choice of saved addresses or inline form to save a new shipping destination.
- **Delivery Mode**: Toggle between Courier Delivery (adds delivery fee) and Boutique Self-Pickup.
- **Payment Gateway**: Simulates UPI (VPA verification) and Credit/Debit Cards. It intentionally triggers a card decline error on the first attempt if a card is used, guiding users to retry or switch methods.
- **Final Review**: Details rental rules, damage deposits, and cancellation policies.
- **Success & Invoice**: Triggers a completed order status and opens an **Invoice Viewer** containing a printable invoice layout.

---

## 5. Visual Design Systems & Aesthetics

Kloset is styled using vanilla CSS, utilizing custom tokens for a premium, custom look:
- **Theme Variables**: A luxury-focused palette centering around Ivory background shades (`#faf9f6`), blooming petals, rose accents, sage green tags, and charcoal ink typography.
- **Floral Accents**:
  - `PetalBackground`: Generates soft falling petal elements across major screens.
  - `FloralDivider`: Elegant decorative vectors splitting sections.
- **UX Features**: Custom skeletons for loading states, motion wrappers for float-in transitions, and interactive slide drawers for the shopping cart.
