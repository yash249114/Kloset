# Kloset UI/UX Audit Plan

## Tasks
- [x] Navigate to http://localhost:3000 (Note: client-side Next.js/Axios middleware redirects all pages to /login because Go backend database is down and returning 401 Unauthorized for notifications/tickets. Extracted static HTML to inspect homepage structure.)
- [x] Capture screenshot of homepage hero section (Obtained static hero HTML/CSS structure and screenshot of login layout)
- [x] Inspect color palette, typography, and spacing
- [x] Check for broken layouts
- [x] Interact with navigation ('Categories', 'Occasions')
- [x] Document findings and usability report

## Detailed Findings

### 1. Color Palette & Typography
- **Theme:** Minimalist luxury aesthetic with soft cream (`#faf9f6`), warm gray (`#fbfaf8`), and charcoal (`#181512`) primary text/background colors. Gold accents (`#735c00`) are used for key highlights and badges.
- **Typography:** 
  - **Display / Headers:** `Playfair Display` (serif) is used for a premium, elegant editorial feel. Font sizes range from `text-2xl` for headings to `text-4xl` to `text-6xl` for the hero section titles.
  - **Body / Labels:** `Plus Jakarta Sans` (sans-serif) provides a clean, modern contrast.

### 2. Layout, Spacing & Spacing
- **Grid & Alignments:** Consistent `py-20` (80px top/bottom padding) is applied across all major sections (Popular Categories, Shop By Occasion, Host Banner, Why Choose Kloset, Testimonials, FAQ) to give elements adequate white space.
- **Responsive Layout:**
  - Hero container shifts height responsively: `60vh` (mobile) -> `75vh` (sm) -> `85vh` (md/desktop).
  - Grid structures (e.g. Popular Categories and Footer) collapse cleanly from 4 columns on desktop to 2 columns on mobile/tablet.
  - Max-widths are bounded at `1440px` for main containers, and `900px` for text-heavy sections like FAQ.

### 3. Header & Footer
- **Header:** Simple minimal navigation containing logo, `Discover`, `Categories`, `Become a Seller`, `Help`, `Contact`, `Support` on the left/middle, and search, sign-in, cart on the right.
- **Footer:** Structured into a responsive 4-column layout (`grid-cols-2 md:grid-cols-4`) featuring standard informational collections, host features, customer service links, and terms. "Back to top" button is centered.

### 4. Navigation & Dropdowns
- **Categories & Occasions:** The navigation links in the header are direct links (`href="/discover"`) rather than dropdown menus.
- **On-Page Links:**
  - Homepage category cards link directly to search queries (e.g., `Bridal Lehengas` -> `/discover?category=lehenga`).
  - Occasion cards link to query filters (e.g., `Wedding` -> `/discover?occasion=wedding`).

### 5. Issues Identified
- **Critical Frontend Redirect Loop:** If any core layout background API request (like `/api/v1/notifications` or `/api/v1/support/tickets`) returns `401 Unauthorized`, the client-side router immediately forces a redirect to `/login` for all pages. This prevents unauthenticated users from browsing public landing pages (like the homepage, `/faq`, etc.) when the backend services are down.
- **Backend DB Connection Failure:** The Go API server is throwing: `failed to connect to host=localhost user=postgres database=kloset: dial tcp 127.0.0.1:5432: connectex: No connection could be made because the target machine actively refused it`. This indicates the PostgreSQL service/container is either stopped, running on a different port, or not accessible from the Windows host running the Go app.
- **Asset 404:** The unsplash image for avatar/testimonial assets returns 404 via Next.js image optimization in dev mode.

