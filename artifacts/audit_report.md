# Kloset V2 — Phase 1 Audit Report

## 1. Mock Data / Fake Content
- **Homepage (`app/page.tsx`)**: Contains arrays for `trendingOutfits` (fallback items), `collectionsList`, `customerReviews`, and `occasions`.
- **Product Page (`app/outfit/[id]/page.tsx`)**: Uses `mockReviews` array (3 items) when there are no live reviews.
- **Renter Dashboard (`app/renter/dashboard/page.tsx`)**: Contains fallback lists `mockBookings` and `mockWishlist` when API fetches fail.
- **Seller Dashboard (`app/seller/dashboard/page.tsx`)**: Uses `trendData` for analytics chart and `mockReviews`/`mockListings` for other tabs.
- **Seller Outfits (`app/seller/outfits/page.tsx`)**: Directly references `mockOutfits` as the source of truth instead of checking the `getSellerOutfits()` API.
- **Admin Dashboard (`app/admin/dashboard/page.tsx`)**: Hardcodes `mockPendingKYC`, `mockPendingOutfits`, `transactionData`, and `categoryDistribution`.
- **Checkout (`app/booking/checkout/page.tsx`)**: Uses mock address items (`addr-1`, `addr-2`) and a mock fallback item if cart is empty.

## 2. Hardcoded Dashboard Metrics
- **Admin Dashboard**: Metrics row contains hardcoded strings for Platform Revenue ("₹1,48,500"), Total Members ("1,248"), and Active Rentals ("45").
- **Seller Dashboard**: Cumulative revenue, sales numbers, and views are calculated locally or hardcoded.

## 3. Placeholder Content
- Multiple Unsplash image URLs are used throughout the homepage, discover page, and details page for user avatars and placeholder outfits.

## 4. Broken Buttons & Non-working Pages
- **Social Auth**: Login/Register page Google Sign-In button was not fully integrated into Google's client credential configurations.
- **Admin-Studio / Test-Center**: Contains pages for debug/mock validation that are not intended for production.

## 5. Missing API / AI / Recommendation Integrations
- **AI Recommend endpoint**: Backend had `/ai/chat` and `/ai/describe` but lacked a specific `/ai/recommend` endpoint for personalization queries.
- **Seller Outfits connection**: Renter dashboard linked correctly, but seller listings listing wasn't fetching live listings from API.
