# Titan visual language

Pulled from https://www.titan.com/ on Nov 5, 2026 (computed styles and `:root` CSS variables, headless Chromium at 1440 px). Reference screenshots are in `shots/titan-ref-*.png`.

## Palette (Titan `--brand-*` tokens)
| Token | Hex | Use |
|---|---|---|
| brand-00 | #FDFEFA | page background, light text on dark |
| brand-10 | #F6F7F3 | surface / cards |
| brand-20 | #E9EAE6 | muted fill, hover |
| brand-30 | #E2E2DE | borders |
| brand-40 | #D0D0CC | focus ring |
| brand-50 | #878784 | mute (legal text only, 3.6:1, too low for body) |
| brand-60 | #595755 | secondary text |
| brand-80 | #2A2826 | dark fills |
| brand-100 | #12100E | lead / ink, dark sections |
| success / green | #556B2F | brand primary accent |
| warning | #9F6B17 | |
| error | #7E2828 | |

Warm off-white and warm near-black, never pure #FFF or #000.

## Type
- Font: **Neue Montreal** (Pangram Pangram, commercial). Closest free Google font used here: **Hanken Grotesk**.
- Everything at weight 400, including headings; 600 only for emphasis. Normal letter spacing.
- Scale seen: display 48 px (line 60–66), h2 24 px (30), h3 20 px (27.5), h4/body lead 16 px (24), body 14 px (21), legal 12 px (15).
- The TITAN wordmark is a serif logo image, not a web font.

## Shape, spacing, motion
- Radius `--radius: .625rem` (10 px); large section blocks and the hero use ~16 px rounded corners; buttons are full pills (padding 16px 24px).
- Primary button dark (#12100E) with light text; secondary is a light translucent pill.
- Generous spacing: nav side padding 96 px, footer top padding 256 px, accordion rows 32 px × 24 px.
- Borders: 1 px #E2E2DE, used sparingly; mostly surfaces separate by fill.
- Imagery: full-bleed warm documentary photography inside rounded blocks.
- Motion: `filter .3s ease-out` on buttons, `.15s cubic-bezier(0.4, 0, 0.2, 1)` on accordions.

## How the site applies it
Light #FDFEFA page, dark rounded inset sidebar (#12100E), pill search and pill nav items (small controls only), cards on #F6F7F3 with 10 px radius and no borders, weight-400 headings at 64/40/20 px, secondary text #595755 (passes 4.5:1), accent green #556B2F, the last step in a strip filled with ink.
