# Changelog

## Minimal top bar
- Height 64 -> 56 (`--bar-h`), no border/shadow, page-coloured background; logo 15px/600.
- Search: 32px, transparent at rest, well fill on hover/focus, max 360px, placeholder "Search", "/" badge hidden (shortcut kept), focus ring as outline on the field.
- Menu: plain 32px icon, fill on hover/open only; mobile hit slop to 44px.
- `scroll-padding-top` and sidebar offset follow `--bar-h`, so titles never hide under the sticky bar.
- QA: focus-ring check now counts an outline on the field host.

## Motion pass
- Route change: fade + 8px rise on the spring (300ms), first 12 tiles staggered 30ms.
- Accordions: height + content fade/rise open (300ms spring), quick fade close (180ms); chevrons and +/- turn.
- Tiles lift translateY(-2px) + hover shadow, press scale(.97); buttons, chips, segments, menu items press.
- Menu fades and scales in from its trigger and fades out.
- Sidebar: one marker element that slides between the current pages.
- Copied state pops (Copy for AI, swatches).
- Fixed: overlay grow-from-card never ran in the React version (dialog ref was null in the first layout effect because Radix Portal mounts late). Now tracked with a callback ref.
- Reduced motion no longer kills all transitions; it keeps fades/colour and removes movement.

## Palettes
- Circles replaced by a joined strip of tiles (outer --r-lg, flush seams), name + hex below, in-place hover, click copies.
- Accordion rows: no bottom border/shadow, spacing only. Small strips in summaries use --r-xs.

## Brand: custom (#000000) + Hedvig Letters Sans
- Added `src/graphite/brand.css` (exact generated config), imported after Graphite tokens, styles and typography.
- `<html data-theme="light" data-brand="custom" data-size="large">`. The theme switch still works: Auto removes `data-theme` and follows the OS. Without a saved choice the page starts in light, per the HTML attribute.
- Titles (page h1, home hero, overlay title, story h1) use `var(--font-display)`, Hedvig Letters Sans 400 with no synthetic bold, leading 1.1 and balanced wrap. Everything else stays Inter.
- The site's `--brand-*` aliases are renamed `--site-*` so they don't override the brand ramp.
- Hard-coded chrome colours replaced by tokens: scrim, hover and floating shadows, menu shadow, copied state, mini-lane, play button. The PNG export reads tokens and uses Inter and Hedvig. Diagnostic sketches and palette mocks keep their content colours on purpose.
- `data-size`: Graphite v1.2.0 (vendored tokens, styles and README) has no size tokens, so the attribute is set but inert.
- QA now forces the theme per run (light/dark).

## Merged top-bar menu
- Top bar is now: logo · centred search · "More options" icon button (36 px, Graphite IconButton style).
- The menu is a Radix Popover with Graphite styling (surface, 12 radius, items concentric at 8, floating shadow). It holds Library, About, Skills (mobile) and Mode (Auto/Light/Dark).
- Keyboard: Enter or Space opens it, Esc closes it, and focus returns to the button.
- The same pattern is used on mobile. The theme switch moved out of the sidebar.

## Visual first + one radius system
- Home tiles show a preview and a short title only. The description, author and section count moved to the overview page.
- Section pages: every card has a visual. Items without one get a sketch chosen from keywords (`src/sketch.js`), and the explanation is in the overlay.
- Intros are cut to one line. Sidebar and pager labels use short names (`short` in the JSON). Full names stay as page titles.
- "Copy for AI" on every skill and section copies the full text as markdown.
- Top bar: Library and About now look the same (plain, hover well, current = primary 600).
- Sidebar selection: no white pill. The current item is primary 600, the rest are secondary 500. The current sub-page gets a 2 px marker on the tree line. Toggles are top-aligned and long names use a hanging indent.
- Radius system:
  - One map of `--r-*` variables from Graphite tokens, with a raw-radius lint (`tests/radius-lint.mjs`).
  - Nested corners are concentric. Dividers, text and full-bleed bars have none.
  - Invisible hit areas carry the card radius, so focus rings match.
  - Computed-radius audit added (`tests/radius-audit.mjs`).
- GRAPHITE.md: radius map and best-practice section with sources.

## Spacing, React + Graphite components, QA
- Spacing: rule set added in docs/SPACING.md (sources verified). All gaps and paddings now use Graphite tokens:
  - Sidebar rows 4/8.
  - Tiles: 24 gutter, caption 12.
  - Groups 40, sections 64.
  - Overlay: one 40 inset, actions 8 apart.
  - Mobile gutter 20.
- Bug: the search field showed a square black focus ring inside its rounded well. Fixed: the inner input never draws a ring; the field does, using Graphite's outline system.
- Top bar: About, Library, the theme control and search all render at 36 px on one centre line. Hit areas reach 44 with invisible slop.
- React 18 migration. The chrome uses Graphite's React components (Button, IconButton, Input, Kbd, SegmentedControl, Toast). The overlay is a Radix Dialog styled with Graphite tokens. Content stays data-driven.
- Theme control is now also available in the mobile sidebar.
- Overlay can scroll again (it was `overflow: hidden`).
- Palette mock buttons pick the most legible text colour (fixes axe contrast failures).
- QA suite in tests/: component states grid, axe, focus rings, targets, layout shift, spacing audit.

## Graphite design system
- The real Graphite v1.2.0 CSS is imported from `src/graphite/`, and site tokens map onto its semantic tokens.
- Inter (400/500/600) and Menlo replace Hanken Grotesk.
- Graphite radii replace the global radius-0 rule: pill, 12, 18, 32, 8 and 6.
- Buttons are soft by default with one primary per surface. Overlay chrome uses ghost icon buttons.
- Search sits on a well with a Kbd hint, and `/` focuses it.
- An Auto/Light/Dark segmented control sets dark mode. The choice persists.
- The toast is a floating pill with past-tense copy. The dialog uses radius 32, a scrim and a floating shadow. Counts use a badge.
- Added docs/GRAPHITE.md and updated ARCHITECTURE and STORY (step 18).

## 2026-11-05 (quiet buttons, one radius, graphite ink)
### Changed
- Button chrome toned down to match Abduzeedo. Round chevron circles became plain + / −. Row backgrounds, pills and boxed prev/next are gone. The overlay action bar is text: one bold underlined primary, the rest underlined on hover. Play is a ▶ glyph on the tile. “Open →” only shows on hover or focus. Text cards are plain text with a hairline.
- One corner rule: 0 everywhere, enforced globally. Only content circles keep 50% (demo balls, mock dot and logo, shape samples). Leftover Titan radii (10, 16, 6, 4, 2 px and 999 px pills) were removed from the CSS.
- Ink is graphite instead of black (`--ink #2b2d2f`, `--muted #55585b`, `--hairline #d9d9d6`), all AA. It is a swappable placeholder for the Graphite system.
- Re-checked: 0 targets under 32 px on desktop or 44 px on touch; no layout shift on 8 pages.

## 2026-11-05 (Abduzeedo grid + affordance)
### Changed
- New visual language after abduzeedo.com/tags/ux (docs/ABDUZEEDO-STYLE.md): white page, black bold type, minimal top bar (logo, Library, Search, About), plain bold text tree in the left column with the current item underlined, big bold titles, square tiles in #dcd9d2 with the preview centred.
- Palettes, diagnostics, colour cards, motion demos and Home are tile grids; Home tiles show a real sample of each skill.
- Mobile: “Skills” opens the tree, search on its own row, 2-column tiles.
- Small text scaled up (meta 13 → 14 px, nav 16–17 px).
### Added (affordance)
- Accordion rows are the whole button: 72 px tall, hover background, a 40 px round chevron that rotates, preview thumbnails of the first three palettes when closed.
- Sidebar toggles are 40 px chevron buttons (44 px on touch). Back link and prev/next became real targets; prev/next are large blocks with arrows.
- “Open →” on every card that opens an overlay; hover darkens, press scales 0.97–0.99. Copy shows a toast. Play buttons on demo cards. ← → Esc hint in the overlay.
- Hit targets measured on 12 pages: 0 under 32 px on desktop, 0 under 44 px on mobile. Layout-shift check (now measuring layout boxes, so press transforms don’t count) clean on 8 pages.

## 2026-11-05 (palette overlay bug)
### Fixed
- Second open of any overlay was invisible (dialog and backdrop stuck at opacity 0, scale 0.97) while the page stayed scroll-locked. Cause: the close animation used `fill: forwards`, and the next open committed those end styles inline (`commitStyles`) before cancelling. Animations are now cancelled without committing, inline opacity/transform/origin are cleared after close, and every new animation starts from the current visual state.
- Clicks during the close animation were swallowed by the fading overlay; the closing layer now ignores pointer events, scroll lock is released at once, and reopening mid-close continues from where it is.
- Page no longer shifts sideways when the scroll lock hides the scrollbar (`scrollbar-gutter: stable`).
- Checked at 1440×900 and 390×844: repeated open/close, quick reopen, prev/next, Related, Combos after expanding, keyboard open, deep link, backdrop click during the opening animation. No console errors; layout-shift check still clean.

## 2026-11-05 (Motion)
### Added
- Sidebar and Home grouped into Design, Typography and Motion (`category` per skill).
- Four motion skills: **Apple-style motion** (s1gmamale1, MIT), **Animations that feel right** (Emil Kowalski: animate, review-animations, improve-animations; MIT), **Material 3 motion** (Shelbeely, Apache-2.0), **Motion design** (LottieFiles, MIT). Summarised in my own words, credited and linked.
- Live demos in the overlay: easing curve plot, Play button, side-by-side comparison lane (for example ease-in vs strong ease-out), copyable CSS. Cards with a demo show a small curve. Reduced motion turns travel into an opacity ramp.
### Changed (Apple-style motion on the site)
- Overlay opens with scale 0.94 → 1 and fade from the clicked card on a critically damped spring (380 ms), closes in 220 ms; on mobile it slides up as a sheet.
- Accordions animate height open and closed and can be reversed mid-flight.
- Route changes crossfade (180 ms); prev/next and Related swap content with a 200 ms fade.
- Hover 120 ms, press feedback scale 0.98. One set of motion tokens replaces the old .15s / .2s values.
- Layout-shift check re-run on 8 pages including the new motion cards: no shift.

## 2026-11-05 (Better typography)
### Added
- Skill **Better typography** by Jakub Krehel (MIT, github.com/jakubkrehel/skills): overview, five rule pages and a “Before you finish” checklist. Cards show a title and one line; the overlay has the explanation and a copyable CSS snippet (Copy CSS).
### Changed (the skill applied to this site)
- Type tokens in rem (56 / 28 / 19 / 16 / 13 px), so the browser font size applies.
- `text-wrap: balance` on headings, summaries and ledes; `text-wrap: pretty` on paragraphs and list items.
- Unitless line-height everywhere: body 1.5, h1 1.1, h2/h3 1.25; the px line-heights in hover slots became unitless.
- `tabular-nums` on counts, hex codes, contrast ratios, step numbers.
- `overflow-wrap: break-word` on cards and overlay text; `nowrap` on pills, counts and labels.
- Underlines from the font; font smoothing moved to the root with the Firefox counterpart.
- Search field is 16px on mobile (iOS zoom).
- Weight 700 (not loaded) replaced with 600, which Hanken Grotesk is loaded with.
- Curly quotes, apostrophes and ellipses in rendered copy (skill files and the story); code keeps straight quotes.
- Not applied: negative heading tracking (conflicts with the Unslop checklist and Titan’s 0 tracking); the measure was already capped (56–65ch).

## 2026-11-05 (hover without layout shift)
### Fixed
- Hovering a palette card no longer pushes the grid down. The caption is a fixed one-line slot; the name crossfades to the colour names (with ellipsis).
- Swatch tooltips sit inside the swatch, so they no longer cover the group header's count and toggle.
- Diagnostics: "View" crossfades to the fix inside a reserved two-line slot; the before → after crossfade is stacked.
- Fonts: fixed-height name line, so the font swap on hover cannot change height; the hover description was removed (it is in the overlay).
- Commands: no longer expand on hover (full text is in the overlay).
- Rule: hover and focus never insert or expand content in the page flow. Checked with Playwright: bounding boxes of every element in main are identical before and after hover and focus on palettes, diagnostics, color cards, commands and fonts.

## 2026-11-05 (overlay v2 + interactivity)
### Changed
- Overlay is near full-viewport (90vw × 90vh, max 1200 px); swatches and previews are the hero. Removed: "n of N" counter, guessed role labels, filler fit notes, repeated title, duplicate buttons.
- One compact action bar per item: primary action first, the rest inline or in an Export menu.
- Tutorials are accordions (first open, "n steps" count).
### Added
- Related strip (up to 5) in every overlay; clicking swaps content and updates `?p=`. Palettes: nearest by colour distance. Diagnostics: same rule section. Commands: same group. Fonts and cards: neighbours.
- Contextual actions. Palettes: Copy all, Check contrast (pairs with ratio and Text / Large only / Avoid), Pair with fonts, Export (CSS, JSON, PNG). Diagnostics: link to the rule section. Commands: Copy command, how to run commands. Fonts: Get the font, Copy name.
- Hover and focus previews (one tooltip style, one reveal style): palette swatch names, diagnostics cross-fade to "after" and show the fix, fonts render in their own face, commands unclamp. On touch screens the preview text always shows. Transitions 180–200 ms ease-out; turned off for prefers-reduced-motion.

## 2026-11-05 (cascading interest)
### Changed
- Site-wide progressive disclosure: layer 1 shows name, visual and one line; layer 2 opens in one shared detail overlay.
- Palette cards show only the swatch strip and name; hex codes moved into the overlay. Cards are buttons with hover and focus states.
- Diagnostics cards show the "before" sketch and symptom; before/after and the fix open in the overlay.
- Impeccable commands, niche fonts and color-rule / mode cards with extra detail open in the overlay; card hex tooltips removed.
### Added
- `src/overlay.js`: one reusable dialog (role=dialog, aria-modal, focus trap, Esc / X / backdrop close, ← → and prev/next, full-height sheet on mobile, deep links `?p=<id>`).
- Palette overlay: large swatches with name, role and hex, click to copy, Copy all, CSS variables, JSON, PNG download (canvas), three usage mocks (poster, UI snippet, badge).
- Font overlay previews the font from Google Fonts; command overlay copies `/impeccable <name>`.
- Unslop checklist pass over the whole site (see STORY step 11).

## 2026-11-05 (information architecture)
### Changed
- The sidebar is the only navigation: a skill tree with the active skill's sections indented and collapsible, current item as a white pill. The horizontal sticky sub-nav is gone.
- Three levels per skill: overview page, one section per route (`#/slug/section`) with previous/next, details on demand.
- Collapsed: diagnostics and cards after 6, checklists after 8 (Show all); palette groups, concept pairings, fonts and command groups are collapsible (first open); Impeccable mode examples behind More.
- Spacing tokens (4 to 104 px) and a type scale (56 / 28 / 19 / 16 / 13); one primary element per view.
### Added
- Home page with three skill entry cards and a start-here link.
- `overview` block in each skill file (purpose, when, takeaways, start); optional `more` on cards.

## 2026-11-05 (Titan restyle)
### Changed
- Visual language from titan.com: Titan brand tokens (#FDFEFA page, #F6F7F3 surfaces, #12100E ink, #595755 secondary, #556B2F accent), 10 px radius.
- Font: Hanken Grotesk (free stand-in for Titan's Neue Montreal) replaces Inter; headings at weight 400.
- Dark rounded inset sidebar, pill search and nav items, dark pill for the current sub-nav section.
- Borderless cards on #F6F7F3, step strips ending in ink, larger section spacing.
- UI accent is now Titan green; each skill's own color stays on its sidebar dot.
### Added
- docs/TITAN-STYLE.md, Titan reference and after screenshots, Story step 8.

## 2026-11-05
### Added
- Impeccable skill (Paul Bakaus): commands, modes, principles, anti-patterns, license note.
- `commands` section type (grouped command lists).
- About / Story page (`#/story`) rendered from `docs/STORY.md`; `docs/ARCHITECTURE.md`.
- `/` focuses search, Esc clears it. Optional `sourceUrl` link in skill headers.
### Changed (critique + Impeccable craft floor + unslop pass)
- Commands shown as grouped lists instead of 23 identical tiles.
- Sub-nav wraps instead of clipping hidden sections; larger, darker links.
- Muted text darkened for contrast; plum sidebar dot ringed so it reads on the dark sidebar.
- Themed text selection and keyboard focus rings; reduced-motion support.

## 2026-11-05 (initial)
- Vite + vanilla JS site with Design critique & brand color and Unslop AI UI skills.
