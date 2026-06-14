@AGENTS.md
# AGENTS.md — Kloset Frontend Operating Specification

## Agent Roles

| Agent | Model | Scope |
|-------|-------|-------|
| Antigravity CLI | Claude Opus 4.6 | Architecture, UX, design system, Homepage, Discover, Outfit Detail, Checkout |
| Antigravity IDE | Gemini 3.5 Flash High | Components, stores, APIs, dashboards, boilerplate |
| OpenCode | Nemotron 3 Ultra | Review, debugging, verification |
| Cline | Nemotron 3 Ultra | File apply, TS fixes, build fixes, runtime fixes |

---

## Skills (auto-loaded from `frontend/.agents/skills/`)

### high-end-visual-design → always-on
- Premium layouts, luxury aesthetics, editorial hierarchy
- Motion quality, visual direction

### design-taste-frontend → always-on
- Frontend implementation quality
- Accessibility, responsive behavior
- Production-ready component standards

### emil-design-eng → on-demand (invoke during component/motion work)
- Design systems, primitives, patterns
- Motion as state, interaction engineering
- Spring physics: stiffness 300, damping 30

---

## Design System

### Palette (no other colors allowed)
```
--ivory:           #FAF7F2
--ivory-dark:      #F2EDE4
--champagne:       #C9A96E
--champagne-light: #E8D5B0
--rose-gold:       #B76E79
--rose-light:      #F2C4CE
--charcoal:        #2C2C2C
--charcoal-mid:    #4A4A4A
--charcoal-light:  #6B6B6B
--warm-white:      #FFFCF8
--gold-accent:     #D4A853
--border:          #E8E0D5
--success:         #4CAF7D
--error:           #E07070
--admin-bg:        #0F0F0F
--admin-surface:   #1A1A1A
--admin-sidebar:   #161616
--admin-border:    #2A2A2A
```

### Typography
```
font-display: 'Playfair Display', Georgia, serif   → all headings
font-sans:    'Inter', system-ui, sans-serif        → UI, body, forms
```

### Spacing (8px grid, multiples only)
```
button height:  52px
input height:   52px
card padding:   24px
section v-pad:  64px
section h-pad:  80px (max-w-7xl mx-auto px-6)
gap between cards: 24px
border-radius: 4px buttons / 8px cards / 12px modals
```

### z-index Hierarchy (strict)
```
0    page content
100  sticky navbar
200  dropdowns / tooltips
300  cart drawer
400  ai chat drawer
500  modals / overlays
600  toast notifications
```

---

## Hard Rules (enforced by all agents)

1. `window.alert/confirm/prompt` → NEVER. Use sonner toast.
2. Raw `#000` or `#fff` → NEVER. Use palette tokens.
3. No Framer Motion → NEVER ship static components.
4. Modal/drawer opens → `document.body.style.overflow = 'hidden'` + cleanup on unmount.
5. No component below 52px height for interactive elements.
6. No Tailwind default gray palette.
7. No generic hero (centered text + gradient + 2 buttons).
8. No purple gradients anywhere.
9. Spring animations only: `{ type: "spring", stiffness: 300, damping: 30 }`.
10. Stagger lists: `staggerChildren: 0.08`.

---

## Build Order

```
Phase 1 — Foundation       (Gemini)
  globals.css + tailwind.config.ts
  lib/api.ts + lib/razorpay.ts + lib/cloudinary.ts
  store/ (auth, cart, wishlist, ui)
  components/ui/ (Button, Input, Modal, Drawer, Toast, Badge, Card, Skeleton)

Phase 2 — Layout Shell     (Gemini)
  AppShell.tsx
  RenterNavbar.tsx + RenterFooter.tsx
  SellerSidebar.tsx
  AdminSidebar.tsx
  app/layout.tsx

Phase 3 — Critical Pages   (Opus)
  app/page.tsx (homepage, all 12 sections)
  app/discover/page.tsx
  app/outfit/[id]/page.tsx
  app/booking/checkout/page.tsx
  app/booking/confirmation/page.tsx

Phase 4 — Drawers          (Gemini)
  CartDrawer.tsx
  AIStylistDrawer.tsx (single unified entry point)

Phase 5 — Seller Studio    (Gemini)
  app/seller/page.tsx
  app/outfit/new/page.tsx (5-step wizard)
  ImageUploader.tsx (6-image max, Cloudinary)

Phase 6 — Admin Console    (Gemini)
  app/admin/page.tsx
  app/admin/users, sellers, transactions, disputes, kyc, aiops, settings

Phase 7 — Auth             (Gemini)
  app/auth/login/page.tsx (Google OAuth)
  app/auth/register/page.tsx

Phase 8 — Profile/Orders   (Gemini)
  app/profile, app/orders, app/wishlist
```

---

## Razorpay Pattern (mandatory)

```ts
// lib/razorpay.ts — only valid implementation
export function openRazorpay(options) {
  return new Promise<'success' | 'failed' | 'dismissed'>((resolve) => {
    const rzp = new (window as any).Razorpay({
      ...options,
      handler: () => resolve('success'),
      modal: { ondismiss: () => resolve('dismissed'), escape: false },
    })
    rzp.on('payment.failed', () => resolve('failed'))
    rzp.open()
  })
}

// Usage — no alert(), no confirm()
const result = await openRazorpay(opts)
if (result === 'success') router.push('/booking/confirmation')
else if (result === 'failed') toast.error('Payment failed. Please retry.')
else toast('Payment cancelled.')
```

---

## Scroll Lock Pattern (mandatory for all modals/drawers)

```ts
useEffect(() => {
  document.body.style.overflow = 'hidden'
  return () => { document.body.style.overflow = '' }
}, [])
```

---

## OpenCode / Cline Verification Checklist

After every file apply:
```bash
npx tsc --noEmit          # zero errors required
npx impeccable detect src/ # zero slop flags
npm run build              # must succeed
```

Flag and fix immediately:
- [ ] window.alert/confirm anywhere
- [ ] z-index outside defined hierarchy
- [ ] Interactive element < 52px
- [ ] Missing AnimatePresence on conditional renders
- [ ] body overflow not restored after modal close
- [ ] Color outside palette
- [ ] CSS transition instead of Framer Motion spring

---

## API Contract

Base URL: `process.env.NEXT_PUBLIC_API_URL`
Auth: `Authorization: Bearer <token>` via axios interceptor in `lib/api.ts`
All components: real endpoints only. No mock data.
Loading: `<Skeleton />` component.
Error: inline error state + retry button. Never alert().

---

## Per-Screen Build Protocol

1. **Taste** → set direction from references (Zara, AJIO Luxe, Airbnb, Pinterest)
2. **Impeccable** → spacing, type scale, alignment, hierarchy pass
3. **Emil** → motion layer: springs, stagger, micro-interactions
4. **Guard** → `npx impeccable detect src/` before commit