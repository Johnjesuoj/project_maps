# Design System: S-Maps
**Project ID:** projects/13847236077950522346
**Theme name:** Nocturne Tactical Navigation
**Source screens:** Home Map - Nearby Places · Location Profile - BUZZ Creative Studio · Navigation - Final Approach · Location Confidence & Verification Levels (all mobile, 780px)

## 1. Visual Theme & Atmosphere
Dense, instrument-like tactical luxury. A night-operations map room: near-black canvas with glowing mint telemetry, monospace micro-labels in wide-tracked uppercase, and soft halo glows around live states. Authoritative and precise, never playful. Information is grouped into stacked instrument cards with generous internal breathing room.

## 2. Color Palette & Roles
- Abyssal Canvas (#060E16) — app background, the deepest layer.
- Tactical Surface (#0D141A) — base surface for screens and chrome.
- Instrument Panel (#1A2127) — raised cards holding grouped content.
- Nested Well (#232B32) — inset controls, icon buttons, thumbnails.
- Elevated Sheet (#2C363D) — toasts, floating overlays.
- Signal Mint (#2AFED7 family: #28FED7 container, #00DFBC dim) — primary live/verified accent, glows, progress, primary actions text on dark.
- Deep Pine Ink (#04201B) — text on top of mint fills.
- Ice Text (#DCE3EB) — primary reading text; Pure White (#FFFFFF) for hero headings.
- Muted Sage (#8A969C) — secondary captions, timestamps.
- Community Cyan (#6FE6F7 / #1FD9F2) — secondary guidance accent (route steps, sector labels).
- Caution Amber (#F2B705) — "Look for" visual-anchor accents.
- Alarm Red (#FF0044 pure, #FF5C85 text) — destructive/report actions only.
- Hairline Border (#2F3A41, subtle 60% variant) — card and control outlines.

## 3. Typography Rules (prototype implementation)
Single family only: Montserrat (300–800 + italic 400). Hierarchy comes from
weight, tracking, and case — never from a second family. This deliberately
diverges from the Stitch source (Inter + JetBrains Mono) per product decision.
- Hero/display: Montserrat Light (300), tight negative tracking (-0.03em), 44px desktop / 34px mobile.
- Headlines: Montserrat SemiBold/ExtraBold (600–800), -0.02em tracking, 30/22/20px scale.
- Body: Montserrat Regular/Medium (400–500), 15–17px, relaxed 1.45 line height.
- Micro-labels: Montserrat Bold (700), 12px, wide tracking (0.12em), always uppercase
  (e.g. OWNER VERIFIED, STAGE 3 / 5, LIVE RADAR) — the instrument voice without a mono face.

## 4. Component Stylings
* **Buttons:** Pill-shaped primary actions with mint-to-cyan gradient fill, deep-pine text, and a soft mint halo shadow; press compresses slightly. Secondary actions are quiet nested-well pills with ice text.
* **Cards/Containers:** Gently rounded rectangles (12px) on instrument-panel fill with hairline borders and whisper-soft shadows; section headers pair a small tinted icon with a mono uppercase label.
* **Inputs/Forms:** Dark inset wells with hairline strokes; focus lifts the mint accent.
* **Badges/Pills:** Frosted-glass nested pills (backdrop blur) for verification state, sector tags, and live conditions; glowing dot + mono status word for live states.
* **Iconography:** Material Symbols Outlined throughout, 14–20px, filled variant reserved for confirmed states.

## 5. Layout Principles
- Single-column mobile stack, 20px outer gutters, 16px card rhythm, 8–12px micro-gaps.
- Hero visual first (photo with bottom scrim + floating badge pills), then title/meta, then a full-width action row, then stacked instrument cards in journey order: how-to-find → final approach → look-for → conditions → verified-by → report/claim footer.
- Progress shown as segmented bars (5 stages) with glow on completed segments.
- Numbers, stages, and statuses always set in mono; prose always in Inter.
