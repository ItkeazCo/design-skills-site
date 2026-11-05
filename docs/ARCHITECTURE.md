# Architecture

```
index.html            shell, Hanken Grotesk font
src/main.js           routing, sidebar tree, search ( / focus, Esc clear), home / overview / section / story views
src/render.js         one renderer per section type, "Show all" helper, registers layer-2 details
src/motion.js         site motion: overlay in/out, accordion height, page fade, swap (WAAPI)
src/demo.js           live easing demos: curve plot + playable lanes
src/overlay.js        the one reusable detail overlay (dialog, focus trap, prev/next)
src/details.js        layer-2 builders: palette detail, copy helper, PNG export
src/markdown.js       tiny Markdown renderer for the Story page
src/style.css         Abduzeedo layer on top of the earlier Titan tokens, spacing and type scale tokens, layout, mini before/after visuals
src/skills/*.json     one file per skill: overview + sections
src/skills/index.js   registry: order of skills in the sidebar and on Home
docs/STORY.md         project history, also shown at #/story
docs/ABDUZEEDO-STYLE.md the visual language (TITAN-STYLE.md kept for history)
public/story/         images used by the story
```

## Information architecture
Three levels per skill:
1. **Overview** `#/<slug>`: purpose, when to use it, 3 to 5 takeaways, one primary "Start with…" button, a list of sections.
2. **Section** `#/<slug>/<section>`: one section per view, a back link to the skill, previous/next at the bottom.
3. **Details on demand**: long lists collapse behind "Show all" or collapsible groups; card detail sits behind "More".

Other routes: `#/` Home (intro, one entry card per skill, a start-here link) and `#/story` (About / Story).

## Cascading interest (progressive disclosure)
Every item has at most two layers:
1. **Layer 1, scan**: name, a visual, one line. No codes, no long text.
2. **Layer 2, on click**: the shared overlay (`src/overlay.js`) with codes, full explanation, examples, copy/export.

How to add one: in a renderer, call `reg(setId, { id, title, html, actions?, thumb?, cat?, onMount })` (`actions` = action-bar HTML, `thumb` = related-strip preview, `relate()` fills `related`) and render the item as `<button class="opens" ...>`. Items in the same set get prev/next. The overlay mirrors its item in the hash as `?p=<id>`, so `#/design-critique/palettes?p=fitness` opens directly. Items with nothing more to say stay plain (checklists, pairings, tutorials).

Between the layers, hover and keyboard focus reveal a preview (`.tip` tooltip, `.peek` reveal). On touch screens the preview text always shows, so nothing needs hover.

## Interaction states (one set, site-wide)
- Hit targets: at least 32 px on desktop, 44 px on touch (checked with Playwright: 0 under).
- Rest: tiles are big and image-led; text cards end with “Open →”; accordions have a 40 px round chevron button; links are underlined.
- Hover: tile darkens / surface shifts, arrow nudges 3 px. Pressed: scale 0.97–0.99 and darker. Focus: 2 px ring, 3 px offset. Current: underline.
- Copy actions show one toast at the bottom (role=status). Demo cards have a Play button in the grid. The overlay shows ← → Esc hints on desktop.

## Motion tokens (after apple-design-motion)
| Token | Value | Use |
| --- | --- | --- |
| `--spring` / `SPRING` | `linear()` sample of a critically damped spring (no bounce) | overlay in, sheet slide-up, accordion |
| `--ease` / `EXIT` | `cubic-bezier(0.23, 1, 0.32, 1)` | exits, hover, small state changes |
| `--d-hover` | 120 ms | hover colour, tooltip, press release |
| `--d-small` | 200 ms | backdrop, crossfades, content swap, accordion close (260) |
| `--d-overlay` | 380 ms | overlay and sheet in; accordion open 320 |
| page | 180 ms opacity | route change |

Rules: transform and opacity only (accordion height is the one exception), exits shorter than entrances (220 ms), no bounce on chrome, press feedback `scale(0.98)` in 80 ms. Every WAAPI call cancels the running one first, so motion is interruptible. With `prefers-reduced-motion` moves become fades and the accordion is instant. Skills declare a `category` (Design, Typography, Motion); `categories` in `src/skills/index.js` orders the sidebar groups.

## Sidebar tree
```
Design skills
[search]
● Design critique & brand color   +/−
    How to critique, Diagnostics, ...   (shown for the active skill, collapsible)
● Unslop AI UI                     +/−
● Impeccable                       +/−
About / Story
```
The current page is a white pill. Search expands every skill and filters sections. There is no second, horizontal navigation.

## Tokens
Spacing `--s1`..`--s7` (4, 8, 16, 24, 40, 64, 104 px). Type `--t-page` 56, `--t-section` 28, `--t-card` 19, `--t-body` 16, `--t-meta` 13.

## Run
```
npm install
npm run dev     # http://localhost:5173
npm run build   # static site in dist/
```

## Add a skill
1. Add `src/skills/<slug>.json` (copy an existing file, including `overview`).
2. Import it in `src/skills/index.js` and add it to `skills`.

## Sources and credits
- Design critique & brand color: A.Song Studio
- Unslop AI UI: Charles Liu
- Impeccable: Paul Bakaus, https://impeccable.style/ (Apache 2.0, github.com/pbakaus/impeccable)


## Design system: Graphite
The site's styling now comes from Graphite v1.2.0. The repo's CSS is copied into `src/graphite/` (tokens, layers, components, typography) and imported first in `main.js`. The final GRAPHITE LAYER in `style.css` maps the site's variables to Graphite semantic tokens and replaces the Abduzeedo radius-0 rule. Theme is `data-theme` on `<html>`, set by the top-bar segmented control and saved in localStorage. See docs/GRAPHITE.md.


## React + Graphite components (step 19)
The app is now React 18, built with Vite and @vitejs/plugin-react. `src/main.jsx` mounts `<App/>` from `src/App.jsx`.
- **Chrome is all React, using Graphite's own components.** The bundle is vendored at `src/graphite/react/index.js` from dist/index.js in the repo. npm couldn't install the private repo on the box.
  - Top bar: `Button` (ghost/soft), `Input` (search, with a `Kbd` suffix) and `SegmentedControl` (theme).
  - Sidebar: `IconButton` (tree toggles).
  - Overlay: `IconButton` (← → ✕) and `Kbd` (key hints).
  - `Toast`.
- **Overlay:** a Radix `Dialog` (focus trap, Escape, aria-modal) styled with Graphite's dialog tokens. Graphite's own Dialog has no focus trap and no prev/next, so it wasn't used. `src/overlay.js` is now a small store with open, go, to, close and isOpen. Page code still calls it; `<Overlay/>` subscribes. The WAAPI motion is unchanged: overlayIn, overlayOut and swap run in layout effects.
- **Toasts:** `src/toastbus.js` carries `toast(msg)` to `<ToastHost/>`.
- **Page bodies:** `src/pages.js` and render.js stay data-driven HTML strings from the JSON skills, injected into `<main>`. This keeps the content pipeline, deep links (?p=), progressive disclosure and demos as they were.
- **Focus:** one system, Graphite's outline ring (`--focus-width`, `--focus-ring`, `--focus-offset`). Inputs never draw their own ring; the field draws it.
- **QA:** scripts are in `tests/`. See tests/README.md.


## Steps 20–22
- `src/sketch.js` picks a visual for each text card from its words.
- `pages.js` has `toMarkdown()` for Copy for AI and `short()` for nav labels (`short` lives in the JSON).
- The top-bar menu is a Radix Popover inside `Topbar`.
- New tests: `tests/radius-lint.mjs` and `tests/radius-audit.mjs`.
