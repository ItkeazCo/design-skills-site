# Graphite on this site

Source: `ItkeazCo/graphite` (@itkeazco/graphite **v1.2.0**). I read it through the GitHub connector and didn't change the repo. The site carries untouched copies in `src/graphite/`: `tokens.css`, `layers.css`, `styles.css` and `typography.css`. `main.js` imports them before `style.css`. The last block of `style.css` ("GRAPHITE LAYER") maps the site onto them.

## Tokens → site
| Site variable | Graphite token |
|---|---|
| --bg | --bg-page |
| --tile | --bg-stage |
| --card, --brand-20 | --bg-well |
| --tile-hover | --bg-well-hover |
| --white | --bg-surface |
| --ink, --accent | --text-primary (colour only for meaning) |
| --muted | --text-secondary |
| --hairline | --border-subtle |
| --ease | --ease-out cubic-bezier(.2,.8,.2,1) |
| --d-hover / --d-small / --d-overlay | --duration-fast 140 / base 180 / slow 300 |
| font | --font-sans Inter 400/500/600; code --font-mono Menlo |

## Radius (replaces the Abduzeedo radius-0 rule)
- Pressed things (buttons, chips, seg, nav items, toast, badges): `--radius-control` (pill).
- Fields, code blocks and palette strips: 12.
- Tiles and cards: 18.
- Overlay dialog: 32.
- Tooltip: 8.
- Kbd and checkbox: 6.
- Content circles stay round.

## Components used
- **Button:** buttons are soft by default. The first overlay action or `.pill-btn.dark` uses the primary (`--button-primary-bg`), so each surface has one black action. Chrome (overlay nav, sidebar toggles) is ghost.
- **IconButton:** mini-play (raised white circle) and overlay ← → ✕.
- **SegmentedControl:** `.gt-seg` gives Auto/Light/Dark in the top bar. It sets `data-theme` on `<html>`, or removes it for Auto so `prefers-color-scheme` applies, and is saved in `localStorage.theme`.
- **Input:** `.gt-input` search sits on a well that turns white on focus, with a `/` Kbd hint. Pressing `/` focuses it.
- **Toast:** `.gt-toast` is a floating pill. Copy is past tense: "#D9C7A7 copied", "Copied to clipboard".
- **Dialog:** the overlay uses `--bg-scrim`, `--radius-container` and `--shadow-floating`.
- **Badge:** group counts.
- **Stage:** tiles use `--bg-stage` at radius 18.
- **Kbd:** overlay key hints.
- **Selected state:** the raised white thumb (`--bg-surface` + `--shadow-raised`) marks the current sidebar item.

## Kept
- The IA, progressive disclosure, overlay and related items.
- Hit targets: ≥32 px on desktop and ≥44 px on mobile.
- Zero layout shift.
- Spring motion: the WAAPI timings already match Graphite's 180/220 tokens.
- Unslop and better-typography rules.


## React components (step 19)
The UI chrome now renders Graphite's React components (vendored dist bundle, v1.2.0): Button, IconButton, Input, Kbd, SegmentedControl and Toast. The overlay is a Radix Dialog wearing Graphite dialog tokens, because Graphite's Dialog has no focus trap or paging. Badge counts and tiles remain in the HTML page bodies, styled with Graphite classes and tokens.


## Radius system (step 20): the one map
Defined once in `style.css` (RADIUS LAYER). App CSS and JSX use only these variables; `tests/radius-lint.mjs` fails on any raw radius.

| Var | Graphite token | Value | Used for |
|---|---|---|---|
| `--r-xs` | radius-checkbox | 6 | kbd, checkbox, marks inside sketches |
| `--r-sm` | radius-tooltip | 8 | tooltips, small swatches |
| `--r-md` | radius-field | 12 | fields, code blocks, menus/popovers, palette strips, accordion rows, sidebar hover |
| `--r-lg` | radius-card | 18 | tiles, cards, mocks, previews, related items, images, invisible hit areas (so focus rings match) |
| `--r-xl` | radius-container | 32 | dialog; mobile sheet = top corners only |
| `--r-pill` | radius-control | full | everything pressable: buttons, icon buttons, chips, segmented, badges, toast, timeline bars |
| `--r-round` | n/a | 50% | dots, avatars, play circles, content circles |

**Nesting:** inner radius = max(outer − inset, 0). For example, a related thumbnail in an 18 card with an 8 inset gets 10. Text, dividers and full-bleed bars (top bar, scrim) have no radius.

## Radius best practices (sources verified 5 Nov 2026)
1. **Use concentric corners when nesting.** Inner radius = outer radius − padding, clamped to ≥ 0. If they don't match, the gap between the curves is uneven and looks lumpy. ([Cloud Four: The math behind nesting rounded corners](https://cloudfour.com/thinks/the-math-behind-nesting-rounded-corners/), [Apple WWDC25: Get to know the new design system, concentricity](https://developer.apple.com/videos/play/wwdc2025/356/), [Apple: Adopting Liquid Glass](https://developer.apple.com/documentation/TechnologyOverviews/adopting-liquid-glass))
2. **Keep the scale small and tie it to size.** Small things get small radii and big surfaces get bigger ones. Material 3's shape scale is none / XS 4 / S 8 / M 12 / L 16 / XL 28 / full, assigned per component. Graphite's 6 / 8 / 12 / 18 / 32 / full follows the same idea. ([M3 corner radius scale](https://m3.material.io/styles/shape/corner-radius-scale), [M3 shape principles](https://m3.material.io/styles/shape/overview-principles))
3. **Pills mean pressable.** Fully rounded shapes are reserved for controls you press, so a pill reads as clickable. Containers are never pills. ([NN/g: clickable elements](https://www.nngroup.com/articles/clickable-elements/))
4. **Same component type, same radius, everywhere.** This includes hover and pressed states and invisible hit areas.
5. **The focus ring follows the element.** CSS outlines follow `border-radius`, so the ring radius is the element radius plus `outline-offset`. Never put a ring on an inner element with a different shape (that was the search-field bug). ([MDN outline](https://developer.mozilla.org/en-US/docs/Web/CSS/outline), [CSS UI 4](https://www.w3.org/TR/css-ui-4/#outline-props))
6. **Don't mix sharp and round on one surface.** Marks inside rounded previews get `--r-xs`, not 0.
7. **Sheets round only their top corners.** The edge that meets the screen stays square.
8. **Continuous corners (squircles).** Apple uses smoothed "continuous" corners. CSS `corner-shape: squircle` exists but isn't yet supported across browsers, so we keep circular arcs and get coherence from concentricity instead. ([Figma: Desperately seeking squircles](https://www.figma.com/blog/desperately-seeking-squircles/), [MDN corner-shape](https://developer.mozilla.org/en-US/docs/Web/CSS/corner-shape))


## Brand (step 23)
`src/graphite/brand.css` is the generated `custom` brand (from #000000), loaded after Graphite and opted in with `data-brand="custom"` on `<html>`. Primary actions use `--bg-inverse` / `--text-inverse` through `--button-primary-*`. `--font-display` (Hedvig Letters Sans) is used only for titles. Graphite v1.2.0 has no `data-size` tokens.
