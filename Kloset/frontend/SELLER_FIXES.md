# Seller Flow Fixes

- Enforced 6‑image upload cap in `app/outfit/new/page.tsx` (`handleImageUpload`) with a toast error when the limit is exceeded
- `ImageUploader` component already caps at 6 images; the legacy upload flow now also respects this limit
- All seller pages compile without errors; no functional regressions
