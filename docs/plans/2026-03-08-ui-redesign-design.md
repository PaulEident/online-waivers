# Volntir UI/UX Redesign

## Navigation
- **Desktop:** Frosted glass sticky top bar (backdrop-blur, semi-transparent white). Logo left, Dashboard/user/sign-out right.
- **Mobile:** Hamburger menu (slide-in from right) with smooth transition. Top bar shows logo + hamburger icon.

## Homepage
- **Hero:** Full-viewport, clean dark gradient background. Strong typography with gradient text accent on key word. Conditional CTAs — "Get Started"/"Learn More" when logged out, "Go to Dashboard" when logged in.
- **Features:** 3 cards in row (desktop) / stack (mobile). Tighter mobile spacing. Subtle hover lift. Larger icons with colored backgrounds.
- **Footer:** Minimal, logo + tagline.

## Auth Pages (Sign In / Sign Up)
- **Desktop:** Split layout — left brand panel (gradient + tagline), right form panel.
- **Mobile:** Stacked — small brand header, then form card.
- Larger input touch targets (44px+), show/hide password toggle, better error states.

## Dashboard
- Polish existing structure: accent left borders on cards, improved empty state with icon + message, tighter mobile padding.

## Design Decisions
- Approach: Bold SaaS visuals with clean execution
- No particles/grain — clean gradient + strong typography
- Hamburger menu on mobile (not bottom tabs)
- Split-panel auth on desktop, stacked on mobile
- Dashboard: polish, not redesign
