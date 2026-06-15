# Implementation Plan — Kloset Frontend Reconstruction (Phase 2)

We will rebuild the Kloset frontend from scratch. This plan details the execution path, files to create, design system configurations, state shapes, and component validation parameters.

## Proposed Steps & Execution Order

We will build in the precise sequence mandated:

1. **Styling & Theme setup**:
   - `app/globals.css`: Define standard styling variables and configure Tailwind CSS v4 `@theme` block.
   - `tailwind.config.ts` / root config: Configure custom fonts (`Playfair Display`, `Inter`) and colors.
2. **Core API & Utility Layer**:
   - [lib/api.ts](file:///y:/swetha/Kloset/frontend/lib/api.ts): Base Axios client configuration. It handles auth injection via request interceptors and token refresh requests via response interceptors.
   - [lib/razorpay.ts](file:///y:/swetha/Kloset/frontend/lib/razorpay.ts): Standard wrapper for Razorpay script dynamic loading and payment event hooks without native alerts.
   - [lib/cloudinary.ts](file:///y:/swetha/Kloset/frontend/lib/cloudinary.ts): Configures unsigned image uploading via XMLHttpRequest, with progress triggers and local file validation limits.
3. **Zustand State Stores**:
   - `store/useAuthStore.ts`: Coordinates authentication status, user details, access/refresh tokens.
   - `store/useCartStore.ts`: Coordinates cart items, discount coupon updates, subtotal computations.
   - `store/useWishlistStore.ts`: Holds list of user wishlisted outfits.
   - `store/useUIStore.ts`: Manages open/close states of drawers and modals.
4. **Reusable UI Components**:
   - `components/ui/Button.tsx`: Sized to minimum 52px height. Variants: primary, ghost, outline.
   - `components/ui/Input.tsx`: Custom styled text/date fields with minimum 52px height.
   - `components/ui/Modal.tsx`: Portal-based popup container with body scroll lock logic.
   - `components/ui/Drawer.tsx`: Sliding panel container with body scroll lock logic.
   - `components/ui/Toast.tsx`: Integration wrapper for `sonner` notifications.
   - `components/ui/Badge.tsx`: Visual tags.
   - `components/ui/Card.tsx`: Standard card wrappers with rounded borders.
   - `components/ui/Skeleton.tsx`: Custom loading shimmer blocks.
5. **App Layout Switchers & Sidebars**:
   - `components/layout/AppShell.tsx`: Switcher layout selector based on page route prefix (renter vs. seller vs. admin views).
   - `components/layout/RenterNavbar.tsx` & `components/layout/RenterFooter.tsx`: Customer-facing navbar and footer.
   - `components/layout/SellerSidebar.tsx`: Dashboard sidebar navigation for sellers.
   - `components/layout/AdminSidebar.tsx`: Sidebar navigation for administration views.
6. **Layout Entry Point**:
   - `app/layout.tsx`: Root HTML layout importing google fonts, setting up providers, and rendering AppShell.
7. **Customer Pages & Drawer Integrations**:
   - `app/page.tsx`: Homepage including all 12 requested sections.
   - `app/discover/page.tsx`: Grid view for outfit searches with filters.
   - `app/outfit/[id]/page.tsx`: Detailed couture view with size/date selectors and recommendations.
   - `components/cart/CartDrawer.tsx`: Slide-in cart sidebar listing rentals and prices.
   - `components/ai/AIStylistDrawer.tsx`: Interactive bot helper.
   - `components/upload/ImageUploader.tsx`: Drag-and-drop media compiler for up to 6 images.
   - `components/payments/RazorpayButton.tsx`: Dynamic payment execution button.
8. **Checkout Flow (3 Pages)**:
   - `app/booking/checkout/page.tsx`: 4-step wizard interface (Address → Review → Payment → Confirmation).
   - `app/booking/confirmation/page.tsx`: Successful booking visual validation.
9. **Seller Dashboard**:
   - `app/seller/page.tsx`: Core seller dashboard layout.
   - `app/seller/listings/page.tsx`: Seller's listings catalog.
   - `app/seller/orders/page.tsx`: Rental orders management.
   - `app/seller/analytics/page.tsx`: Revenue analytics.
   - `app/seller/earnings/page.tsx`: Seller balance and payouts ledger.
10. **Admin Portal**:
    - `app/admin/page.tsx`: Stripe-like administrative overview with key platform metrics.
    - `app/admin/users/page.tsx` & `app/admin/sellers/page.tsx`: Admin customer management.
    - `app/admin/transactions/page.tsx`: Rent and escrow ledger log.
    - `app/admin/disputes/page.tsx`: Escalated dispute resolution dashboard.
    - `app/admin/kyc/page.tsx`: Verification queue listings.
    - `app/admin/aiops/page.tsx`: Gemini agent live operations polling dashboard.
    - `app/admin/settings/page.tsx`: Portal configuration options.
11. **Authentication Screens**:
    - `app/auth/login/page.tsx` & `app/auth/register/page.tsx`: Custom pages containing Google OAuth buttons.
12. **Customer Studio Accounts**:
    - `app/profile/page.tsx`: User personal profile settings.
    - `app/orders/page.tsx`: Active and past rental orders timeline.
    - `app/wishlist/page.tsx`: Wishlisted items.
13. **Custom Hooks**:
    - `hooks/useAuth.ts`: Hook interfacing authentication store state.
    - `hooks/useOutfits.ts`: Fetching and caching catalog outfits.
    - `hooks/useBookings.ts`: Fetching booking lists and canceling rentals.

## Absolute Constraints to Enforce

1. **Feedback & Failures**: No `window.alert()`, `confirm()`, or `prompt()`. All alerts will be delivered via `sonner` toasts.
2. **Palette & Typography**: Use only named CSS variables in styling classes. Headings will use `font-display` (Playfair Display) and elements will use `font-sans` (Inter).
3. **Animations**: Every page/major component will render entry animations via Framer Motion.
4. **z-Index Hierarchy**: Strict layering rules:
   - Content: `z-0`
   - Sticky header: `z-100`
   - Dropdown/Tooltip: `z-200`
   - Cart Drawer: `z-300`
   - AI Chat Drawer: `z-400`
   - Modals/Overlays: `z-500`
   - Toast: `z-600`
5. **Scroll Locks**: Every Modal and Drawer will apply `document.body.style.overflow = 'hidden'` on mount and restore it on unmount.
6. **Interactives Height**: Buttons and input selectors must maintain a height of exactly `52px`.

---

## Verification Plan

### Automated Checks
- Compiling the application: `npm run build`
- Verify typescript check results: `npx tsc --noEmit`

### Manual Verification
- Render checking: Run `npm run dev` and perform routing checks to verify that each route handles dynamic animations correctly.
