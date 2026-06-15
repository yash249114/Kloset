# Kloset V6 — Reconstructed Files Audit

This file-by-file audit analyzes every core component and route reconstructed under the **Kloset V6** specifications, documenting their exact workspace paths, technical roles, styling tokens, and Torch Rule compliance status.

---

## 🎨 1. Styles & Shells Foundations

### 1.1 [app/globals.css](file:///y:/swetha/Kloset/frontend/app/globals.css)
* **Technical Role**: Root style stylesheet. Declares Tailwind CSS v4 `@theme` directives, global HTML resets, typography bindings, input styling, and base button modifier classes.
* **V6 Styling Tokens**: Custom theme definitions for `--color-ivory` (`#FAF7F2`), `--color-charcoal` (`#2C2C2C`), `--color-champagne` (`#C9A96E`), `--color-rose-gold` (`#B76E79`), and radii assignments (`4px` for buttons, `8px` for cards, `12px` for modals).
* **Torch Rule Audit**: Enforces `.btn` default height at `52px` and `.input` default height at `52px` globally.

### 1.2 [components/layout/AppShell.tsx](file:///y:/swetha/Kloset/frontend/components/layout/AppShell.tsx)
* **Technical Role**: Workspace routing manager. Triggers auth initialization on mount and checks route prefixes to mount either the dark `AdminLayout`, persistent `SellerLayout`, minimal `AuthLayout`, or default `RenterLayout` with header and footer.
* **Torch Rule Audit**: Houses root components and drawer anchors.

### 1.3 [components/layout/RenterNavbar.tsx](file:///y:/swetha/Kloset/frontend/components/layout/RenterNavbar.tsx)
* **Technical Role**: Storefront header. Renders navigation links, search, wishlists, cart icons, and triggers the AI Stylist drawer.
* **Torch Rule Audit**: Fixed header at height `64px`.

### 1.4 [components/layout/RenterFooter.tsx](file:///y:/swetha/Kloset/frontend/components/layout/RenterFooter.tsx)
* **Technical Role**: Storefront footer. Renders directory columns, email newsletter input, and custom inline SVG social links.
* **Torch Rule Audit**: Set with dark charcoal mid background (`bg-charcoal` `#2C2C2C`), ivory typography, and spacing scale padding (`py-16 px-8`).

---

## 🛒 2. Renter Portal Pages

### 2.1 [app/page.tsx](file:///y:/swetha/Kloset/frontend/app/page.tsx)
* **Technical Role**: Storefront homepage. Coordinates 12 separate editorial rails (Hero, Trending Rentals, Curated asymmetric grid, Occasion tagging, circular designers list, spotlights, reviews, FAQ, and recommendation grids).
* **V6 Styling Tokens**: Uses Playfair Display (`font-display`) for editorial headings, staggered animations via Framer Motion, and zoom-on-hover card rails.
* **Torch Rule Audit**: All CTA button selectors utilize standard height classes. Card grid spacing adheres to `gap-6` (24px padding).

### 2.2 [app/discover/page.tsx](file:///y:/swetha/Kloset/frontend/app/discover/page.tsx)
* **Technical Role**: Search catalog. Matches a 280px left multi-filter sidebar with a responsive 3-column product grid. Synced directly to bookmarkable URL parameters.
* **Torch Rule Audit**: Replaced custom dropdowns with standard input forms and filter cards conforming to V6 borders.

### 2.3 [app/outfit/\[id\]/page.tsx](file:///y:/swetha/Kloset/frontend/app/outfit/[id]/page.tsx)
* **Technical Role**: Outfit detail layout. Split 60/40 page listing image gallery zooms on hover, sizing grids, rental calendars, accordion details, and 5 separate algorithm grids.
* **Torch Rule Audit**: "Add to Cart" button height set at `h-[56px]` (complying with the 52px button constraint). Sizing selectors styled as select fields.

### 2.4 [components/cart/CartDrawer.tsx](file:///y:/swetha/Kloset/frontend/components/cart/CartDrawer.tsx)
* **Technical Role**: Slide-out cart panel (480px width).
* **Torch Rule Audit**: Locks body scroll on mount (`document.body.style.overflow = 'hidden'`) and unlocks it on dismount. Uses `bg-[#FFFCF8]` (`var(--warm-white)`) instead of raw `#fff` card surfaces.

### 2.5 [app/booking/checkout/page.tsx](file:///y:/swetha/Kloset/frontend/app/booking/checkout/page.tsx)
* **Technical Role**: Stepwise booking checkout workflow. Address addition forms sync with database. Razorpay integration handlers process payment callbacks.
* **Torch Rule Audit**: Completely reconstructed. All inputs changed to the base `.input` style (52px height); all buttons utilize the `.btn` system.

### 2.6 [app/booking/confirmation/page.tsx](file:///y:/swetha/Kloset/frontend/app/booking/confirmation/page.tsx)
* **Technical Role**: Booking confirmation status tracking. Displays timeline schedules, reference IDs, and triggers receipt PDF render panels.
* **Torch Rule Audit**: Fully updated. Spaced horizontal steps.

---

## 🏬 3. Merchant Seller Studio

### 3.1 [app/seller/page.tsx](file:///y:/swetha/Kloset/frontend/app/seller/page.tsx)
* **Technical Role**: Seller console page. Renders showcase listings, quick parameters editor, monthly Recharts logs, bookings pipeline selectors, and reviews responses.
* **Torch Rule Audit**: Removed custom `h-9` and `h-12` button modifiers; all controls now conform to the 52px height guidelines.

### 3.2 [app/outfit/new/page.tsx](file:///y:/swetha/Kloset/frontend/app/outfit/new/page.tsx)
* **Technical Role**: Multi-step Listings publication wizard form. Includes details fields, drag-and-drop ImageUploader attachments, and logistics restrictions.
* **Torch Rule Audit**: Expanded sizing chips to `52px` squares; occasion and accessories tags styled as `h-[52px]` pills to satisfy strict height constraints.

### 3.3 [components/upload/ImageUploader.tsx](file:///y:/swetha/Kloset/frontend/components/upload/ImageUploader.tsx)
* **Technical Role**: Drag-and-drop media attachments grid. Tracks upload progress percentages and Cloudinary IDs.
* **Torch Rule Audit**: Card elements styled with `rounded-2xl` boundaries.

---

## 💻 4. Dark Admin Platform Console

### 4.1 [components/layout/AdminLayout.tsx](file:///y:/swetha/Kloset/frontend/components/layout/AdminLayout.tsx)
* **Technical Role**: Unified admin panel dark container shell. Houses logo banners, profile details, exit actions, and routes to sub-pages.
* **V6 Styling Tokens**: Uses `#0F0F0F` background, `#161616` sidebar, and `#C9A96E` (champagne) active state borders.
* **Torch Rule Audit**: Strict Stripe/Linear theme. All link labels are written in uppercase typography.

### 4.2 [app/admin/page.tsx](file:///y:/swetha/Kloset/frontend/app/admin/page.tsx)
* **Technical Role**: Admin Overview metrics page. KPI counters, Recharts sales telemetry area chart, and log stream feeds.
* **Torch Rule Audit**: Completely dark theme. Charts styled with champagne cuts and dark tooltips.

### 4.3 [app/admin/users/page.tsx](file:///y:/swetha/Kloset/frontend/app/admin/users/page.tsx)
* **Technical Role**: Auditable renters and sellers index table.
* **Torch Rule Audit**: Search input field styled using the base `.input` layout.

### 4.4 [app/admin/sellers/page.tsx](file:///y:/swetha/Kloset/frontend/app/admin/sellers/page.tsx)
* **Technical Role**: Verified merchant showrooms listing directory.
* **Torch Rule Audit**: Fully dark theme. Action buttons styled with large paddings.

### 4.5 [app/admin/transactions/page.tsx](file:///y:/swetha/Kloset/frontend/app/admin/transactions/page.tsx)
* **Technical Role**: Transaction ledger tracking commission volumes.
* **Torch Rule Audit**: Completely new V6 component.

### 4.6 [app/admin/disputes/page.tsx](file:///y:/swetha/Kloset/frontend/app/admin/disputes/page.tsx)
* **Technical Role**: Dispute arbitrations mediator. Releases escrow payouts or refunds rental deposits.
* **Torch Rule Audit**: Type checked. Replaced small arbitrate buttons with standard `.btn` elements.

### 4.7 [app/admin/kyc/page.tsx](file:///y:/swetha/Kloset/frontend/app/admin/kyc/page.tsx)
* **Technical Role**: KYC seller document queue and outfit approvals queue.
* **Torch Rule Audit**: Fully new V6 component.

### 4.8 [app/admin/aiops/page.tsx](file:///y:/swetha/Kloset/frontend/app/admin/aiops/page.tsx)
* **Technical Role**: AIOps models logs and latency checks.
* **Torch Rule Audit**: Replaced custom loaders with champagne indicators.

### 4.9 [app/admin/settings/page.tsx](file:///y:/swetha/Kloset/frontend/app/admin/settings/page.tsx)
* **Technical Role**: Platform settings config panel.
* **Torch Rule Audit**: Fully new V6 component.
