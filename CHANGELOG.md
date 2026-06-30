# Changelog

## 2026-06-30

### Design — Home hero (`src/components/home/hero/HeroSplit.tsx`)
- Elevated the split hero to use the existing design system instead of a flat hardcoded gradient.
- Copy panel: layered atmosphere — radial forest gradient, soft leaf/lime glows, faint topographic contour lines, and a subtle grain overlay (replaces the flat `linear-gradient(#0c1c10,#1f3318)` block).
- Killed the hard 50/50 seam: media panel now melts into the green via a left-edge scrim (desktop).
- Headline: "Natural" set in a lime gradient accent.
- Replaced the three bordered icon cards with a hairline-divided stat row (big numbers, no boxes): `40%↓ crop loss recovered`, `1,400+ operations served`, `0 synthetic inputs`.
- Added a floating glass proof card ("+38% avg yield recovery") crossing the seam for depth/layering.
- Trust bar refined with lime-dot separators.
- Subtle `animate-rise` entrance on the copy block.
