# Theme Mode Accessibility Polish

## Goal
- Add light and dark theme support across the customer and admin surfaces.
- Improve button contrast so secondary actions remain distinguishable in both themes.

## Assumptions
- The existing Tailwind v4 utility usage should stay largely intact.
- A persisted client theme preference is acceptable for this mock product.
- Global utility remapping is safer here than touching every screen individually.

## Scope
- Add a root theme provider and a reusable theme toggle.
- Expose the toggle in both customer and admin layouts.
- Introduce global light/dark design tokens and remap the most common background, border, and text utilities.
- Strengthen recurring secondary button treatments for better contrast.
- Add focused tests for the theme toggle interaction.

## Implementation Steps
1. Install and wire `next-themes` at the app root.
2. Add a client theme toggle with light, dark, and system options.
3. Update shared layouts to render the toggle in a predictable location.
4. Extend `globals.css` with theme tokens, dark-mode utility remapping, and contrast-focused action styles.
5. Add tests and run the standard validation suite.

## Risks
- Broad utility remapping could unintentionally affect decorative cards or badges.
- Theme-aware client UI can introduce hydration flicker if mounted state is not handled carefully.
- Button selectors that are too general could catch non-action elements.

## Verification
- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- `npm.cmd run build`
