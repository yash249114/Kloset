# Kloset V3 UX Audit Report

This report manual audits the front-end page layouts, workflows, and user paths to determine blockers, fragmentation, and layout crowding.

---

## 💻 Landing & Homepage (`/`)

1. **Page Goal**: Introduce the couture rental brand, provide instant discoverability of collections via text search, highlight current trends, and show how renting works.
2. **Action**: Browse outfits, search tags, choose categories, read reviews, open AI Stylist.
3. **Is Obvious?**: Yes, but the category collection rows do not filter results; they are dead-end clicks.
4. **Clicks**: 1 click to search/browse; 1 click to talk to the stylist.
5. **Duplicate Actions**: Yes, the floating support widget and the homepage sections both promote separate chat/styling widgets.
6. **Dead Buttons**: None.
7. **Broken Workflows**: Popular category cards do not trigger active state filters on the discover page.
8. **Duplicated Pages**: None.

---

## 🔍 Discover Page (`/discover`)

1. **Page Goal**: Filter and browse the marketplace outfit showroom.
2. **Action**: Set category, size, color, occasion, price, or availability filters to find outfits.
3. **Is Obvious?**: Yes, using the sticky sidebar.
4. **Clicks**: 1 click per filter application.
5. **Duplicate Actions**: Search queries in the navbar and page search bar are separate.
6. **Dead Buttons**: None.
7. **Broken Workflows**: Sidebar filters are styled nicely but need to fit Design System V3 spacing rules to avoid text overlapping on narrow viewports.
8. **Duplicated Pages**: None.

---

## 👗 Outfit Details Page (`/outfit/[id]`)

1. **Page Goal**: Showcase garment information, pricing scales, security deposits, and prompt reservation bookings.
2. **Action**: View images, select rental dates, choose size, and checkout.
3. **Is Obvious?**: Yes, due to the sticky right purchase card.
4. **Clicks**: 2 clicks to book.
5. **Duplicate Actions**: Header wishlist toggles and card wishlist button are duplicate actions.
6. **Dead Buttons**: None.
7. **Broken Workflows**: Renting policy links go to separate, external static pages, causing the user to lose context.
8. **Duplicated Pages**: None.

---

## 🔑 Login & Registration (`/login`, `/register`)

1. **Page Goal**: Account creation and secure authentication.
2. **Action**: Input credentials, choose account role, log in/sign up.
3. **Is Obvious?**: Yes, split-screen is readable.
4. **Clicks**: 2-3 clicks.
5. **Duplicate Actions**: Registration role buttons.
6. **Dead Buttons**: None.
7. **Broken Workflows**: Renter and Seller onboarding is separate; users who want to rent AND list their own wardrobe must register twice or have limited options. "Both" is required.
8. **Duplicated Pages**: None.

---

## 🎟️ Support Center & Policies (Fragmented)

1. **Page Goal**: Resolve support requests, host FAQs, and display policy text.
2. **Action**: Fill contact forms, read policy terms.
3. **Is Obvious?**: No, support is fragmented across `/faq`, `/contact`, `/help`, and 5 separate policy pages.
4. **Clicks**: 3-4 clicks to navigate between different pages.
5. **Duplicate Actions**: Contact forms are duplicated.
6. **Dead Buttons**: None.
7. **Broken Workflows**: Users are pulled out of active booking context to read cancellation or damage cover terms.
8. **Duplicated Pages**: Yes, `/help`, `/contact`, and `/faq` are highly duplicated.

---

## 🛒 Checkout Page (`/booking/checkout`)

1. **Page Goal**: Address confirmation, Razorpay payment processing, and rental order creation.
2. **Action**: Enter address, select delivery mode, process Razorpay.
3. **Is Obvious?**: Yes.
4. **Clicks**: 3 clicks.
5. **Duplicate Actions**: Simulated inputs and Razorpay checkout overlap.
6. **Dead Buttons**: None.
7. **Broken Workflows**: Adding a new address in checkout does not sync/save it instantly to user profiles, causing loss of data.
8. **Duplicated Pages**: None.
