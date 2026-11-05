# Visual language: Abduzeedo grid

Taken from abduzeedo.com/tags/ux (reference: shots/abdz-ref.png). Replaces the Titan style (TITAN-STYLE.md is kept for history).

## Tokens (read from the live CSS)
| Token | Abduzeedo | This site |
| --- | --- | --- |
| Page | #ffffff | `--bg: #ffffff` |
| Ink | #000 | `--ink: #000000`, secondary `--muted: #6b6965` |
| Tile | warm light grey behind each preview | `--tile: #dcd9d2`, hover `--tile-hover: #d2cec6` |
| Text surface | – | `--card: #f2f1ee` for text-only cards |
| Font | Neue Haas Grotesk Text (commercial), 700 titles, 500 nav | Hanken Grotesk 400–700 as the free stand-in |
| Title | 38 px / 700 / 1.1 | `--t-page: 3rem`, 700 |
| Nav | 18 px / 500 | 17 px / 600 skills, 16 px / 500 sections |
| Spacing | `--spacing-main: 16px` grid gap and margins | `--gap: 16px`; rows 40 px apart |
| Corners | 0 (tiles, header, inputs) | 0 everywhere, one rule |

Skipped on purpose: Abduzeedo’s −0.02em heading tracking (the Unslop checklist says no negative tracking).

## Layout
- Top bar: logo left, Library / Search / About spread across the columns. On mobile: logo, About, Skills (opens the tree), search on its own row.
- Left column: plain bold text tree, grouped Design / Typography / Motion. Current item is underlined, no panel or pill.
- Main: big bold title top-left, then a grid of large square tiles (min 260 px, 16 px gutters, 2 columns on mobile).
- Tile: preview centred on the tinted square (palette strip, before/after sketch, easing curve, skill sample); bold title and one line below. Hover darkens the tile, press darkens more.
- Text-only items (rules without a visual) stay as plain blocks on `--card`.

## Corners: one rule
`border-radius: 0` everywhere: tiles, swatch strips, overlay, inputs, toast, menus, focus rings, code blocks. A single global rule enforces it.
Only exception: circles that are **content**, not chrome. These are the demo balls, the dot and logo inside the palette mock, the round shape samples, the round marks in the diagnostics sketch and the Home preview mark. They stay `50%` because the shape is the point.

## Buttons and links (quiet, the Abduzeedo way)
Abduzeedo’s top links and category list are plain text: no background, no border, current item underlined. Same here:
- Primary action: bold text, always underlined. Secondary: regular text, underlined on hover. No pills, no boxes, no circles.
- Accordions: bold title and a plain + / −. Sidebar toggles: plain + / −. Prev/next: big bold text with an arrow. Back link: plain bold, underline on hover. Play: a ▶ glyph on the tile.
- Tiles carry the affordance: big, image-led, the tint darkens and the title underlines on hover. “Open →” appears only on hover or focus (always on touch).
- Hit areas stay large through padding: ≥ 32 px desktop, ≥ 44 px touch (measured).
- Pressed: text goes secondary, tiles darken, small scale on tiles only. Focus: 2 px ink outline, 3 px offset.

## Ink: graphite (swappable)
A simple placeholder layer until the Graphite design system tokens arrive. Five variables in the quiet layer of `src/style.css`:
| Token | Value | Contrast |
| --- | --- | --- |
| `--ink` | #2b2d2f | 13.8:1 on white, 9.8:1 on the tile |
| `--muted` | #55585b | 7.2:1 on white, 5.1:1 on the tile (AA) |
| `--hairline` | #d9d9d6 | dividers only |
| `--brand-80` | #3a3c3f | dark hover |
| `--tile` | #dcd9d2 | unchanged |
