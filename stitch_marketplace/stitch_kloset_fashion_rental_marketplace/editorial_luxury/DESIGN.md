---
name: Editorial Luxury
colors:
  surface: '#fbf9f4'
  surface-dim: '#dbdad5'
  surface-bright: '#fbf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ee'
  surface-container: '#f0eee9'
  surface-container-high: '#eae8e3'
  surface-container-highest: '#e4e2dd'
  on-surface: '#1b1c19'
  on-surface-variant: '#4d4635'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f1ec'
  outline: '#7f7663'
  outline-variant: '#d0c5af'
  surface-tint: '#735c00'
  primary: '#735c00'
  on-primary: '#ffffff'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#e9c349'
  secondary: '#79545c'
  on-secondary: '#ffffff'
  secondary-container: '#feced7'
  on-secondary-container: '#7a555d'
  tertiary: '#625e58'
  on-tertiary: '#ffffff'
  tertiary-container: '#b8b2ab'
  on-tertiary-container: '#48453f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#ffd9e0'
  secondary-fixed-dim: '#e9bbc4'
  on-secondary-fixed: '#2e131a'
  on-secondary-fixed-variant: '#5f3d45'
  tertiary-fixed: '#e8e1da'
  tertiary-fixed-dim: '#ccc6be'
  on-tertiary-fixed: '#1e1b17'
  on-tertiary-fixed-variant: '#4a4641'
  background: '#fbf9f4'
  on-background: '#1b1c19'
  surface-variant: '#e4e2dd'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.03em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-tablet: 32px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style
The brand personality of this design system is sophisticated, curated, and high-end, mirroring the experience of a luxury fashion atelier. It targets an audience that values sustainability through circular fashion without compromising on the prestige of designer labels. 

The design style is **Editorial Minimalism**. It prioritizes high-contrast typography and generous whitespace to allow product photography to breathe, much like a physical fashion magazine. The emotional response should be one of "attainable luxury"—feeling exclusive yet welcoming and deeply trustworthy. The UI utilizes a "Less is More" philosophy, where every line, border, and shadow serves a deliberate structural purpose.

## Colors
The palette is rooted in warmth and tactile elegance. 
- **Warm Ivory (#F9F7F2)** serves as the primary canvas, replacing stark whites to provide a softer, more premium feel. 
- **Soft Beige (#F2EBE3)** is used for subtle container backgrounds and section dividers to create depth without introducing heavy lines. 
- **Champagne Gold (#D4AF37)** is the primary accent, used sparingly for calls-to-action, active states, and premium badges to denote value.
- **Soft Rose (#E2B4BD)** acts as a romantic secondary accent for highlights, hover states, or promotional elements. 
- **Charcoal Typography (#1A1A1A)** ensures high readability and a grounded, authoritative feel for all content.

## Typography
The typography strategy relies on the interplay between a classic, high-contrast serif and a modern, understated sans-serif. 

**Playfair Display** is used for all headlines and display text, evoking the feel of a luxury masthead. Large font sizes are used for hero sections to create an immediate impact. **DM Sans** provides a clean, functional contrast for body copy and UI labels, ensuring that technical information (like rental terms or sizes) remains clear and legible. Use uppercase styles for labels and buttons to reinforce the architectural and structured nature of the design system.

## Layout & Spacing
The layout follows a **Fixed Grid** model on desktop, centered within the viewport to create a contained, boutique-like experience. 

- **Desktop:** A 12-column grid with a 1280px max-width. Margins are intentionally wide (64px) to emphasize the premium nature of the content.
- **Section Gaps:** Vertical rhythm is intentionally loose. Use large gaps (120px) between major landing page sections to prevent the UI from feeling cluttered.
- **Mobile:** Content reflows to a single column with 20px margins. Headlines scale down to maintain readability without overwhelming the viewport.
- **Internal Spacing:** Use an 8px base unit. Component padding should favor vertical breathing room (e.g., button padding of 16px top/bottom).

## Elevation & Depth
Elevation is handled with extreme subtlety to maintain a flat, editorial aesthetic. 

- **Tonal Layers:** Depth is primarily communicated through color shifts between Warm Ivory and Soft Beige rather than heavy shadows. 
- **Ambient Shadows:** When shadows are necessary (e.g., for hovering over product cards or open modals), use extremely diffused, low-opacity shadows with a slight tint of the Primary color (#D4AF37) to keep them warm. 
- **Thin Borders:** Use 1px borders in Soft Beige (#F2EBE3) to define card boundaries and form fields. This creates a "hairline" detail common in luxury print design.
- **Glassmorphism:** Apply light backdrop blurs (8px to 12px) on sticky navigation bars to maintain context of the underlying photography as the user scrolls.

## Shapes
This design system utilizes **Soft** roundedness. While high-fashion often leans toward sharp corners, the "Soft" setting (0.25rem / 4px) provides a more approachable and trustworthy feel, making the digital platform feel modern and tactile. 

Full-bleed images should retain sharp corners to maximize their editorial impact, while interactive elements like buttons, input fields, and tags utilize the soft radius. Larger containers, such as modal overlays or product cards, can scale up to 8px (rounded-lg) for a gentler appearance.

## Components
- **Buttons:** Primary buttons feature a solid Charcoal background with White or Gold text. Secondary buttons use a Champagne Gold hairline border with uppercase labels.
- **Premium Product Cards:** Images should have a 3:4 aspect ratio. The product title and designer name are placed below the image in Playfair Display, with the rental price highlighted in Gold. A subtle 1px border appears only on hover.
- **Availability Calendars:** Use a minimal, non-grid approach. Selected dates are highlighted with a Soft Rose circle. The interface must feel clean, avoiding the "busy" look of traditional booking systems.
- **Rental Filters:** Implement as an elegant side-drawer or a horizontal bar with "Ghost" dropdowns. Use refined icons and generous text spacing.
- **Editorial Hero Sections:** Feature large-scale imagery with overlapping "Display-lg" typography. Use asymmetrical layouts to mimic magazine spreads.
- **Professional Dashboards:** For the "Kloset" management side, use Soft Beige backgrounds for content areas and clear, tabular data with DM Sans for high density without visual noise.
- **Input Fields:** Bottom-border only or very light 1px outlines. Labels should always be visible and use the "Label-sm" style.