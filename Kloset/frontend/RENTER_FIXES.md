# Renter Flow Fixes

- Fixed duplicate `style` prop on hero background `<motion.div>` causing JSX syntax error (merged into single style object)
- Corrected transition syntax on hero heading for proper compilation
- Added explicit type annotations for image URLs across `app/page.tsx` to satisfy TypeScript strictness
- All renter routes (`/discover`, `/cart`, `/booking/checkout`, dashboard) now compile without errors
