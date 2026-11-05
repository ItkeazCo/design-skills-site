# Design skills

A small local site for a library of design skills. Vite + vanilla JS; content lives in JSON.

```
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
```

## Add a skill

1. Create `src/skills/<slug>.json` (copy an existing one as a template).
2. Register it in `src/skills/index.js`: import it and add it to the `skills` array.

That's it. The sidebar, search, and section sub-nav are generated from the data.

### Skill file shape

```json
{
  "slug": "my-skill", "title": "My skill", "source": "Author",
  "sourceUrl": "https://… (optional link)", "sourceNote": "Where it came from", "summary": "One line.", "accent": "#600C49",
  "overview": {
    "purpose": "One line: what it is for", "when": "When to use it",
    "takeaways": ["3 to 5 key points"], "start": "section-id to start with"
  },
  "sections": [ { "id": "anchor-id", "title": "Shown in the sub-nav", "intro": "optional", "type": "cards", ... } ]
}
```

Each skill gets an overview page (`#/<slug>`) built from `overview`, and every section its own page (`#/<slug>/<section-id>`) with previous/next links. The sidebar tree is generated from `sections`.

Long content collapses automatically: more than 6 cards or diagnostics, or more than 8 checklist items, show a "Show all" button; palettes, pairings, fonts and command groups are collapsible groups (first one open). Add `"more": "…"` to a card to put extra detail behind a disclosure.

Section types (renderers in `src/render.js`):

| type | fields |
|---|---|
| `cards` | `items: [{ title, text, more?, colors?: [color], shape?: "round"\|"repeat"\|"crack" }]` |
| `diagnostics` | `items: [{ symptom, fix, viz }]`; `viz` picks a CSS before/after mini visual (`grid, group, focus, scale, busy, heavy, empty, glow, warm, flat, message, muddy, words`) |
| `palettes` | `groups: [{ name, palettes: [{ name, colors: [color] }] }]` |
| `typography` | `items: [{ method, use, html }]`, `fonts: [{ name, text }]`, `note` |
| `pairs` | `groups: [{ name, items: [string] }]` |
| `steps` | `tutorials: [{ title, tool?, steps: [string] }]` (rendered as a step strip) |
| `checklist` | `items: [string]` (tickable list) |
| `commands` | `groups: [{ name, items: [{ name, text }] }]` (grouped command list) |
| `prose` | `text` |

A color is `{ "name": "plum", "hex": "#600C49", "approx": false }`. Set `approx: true` unless the source gave the exact hex.

## Docs

- `docs/STORY.md`: how the project started (also in the site under About / Story)
- `docs/ARCHITECTURE.md`: file layout and routing
- `CHANGELOG.md`

## Credits

- Design critique & brand color: A.Song Studio
- Unslop AI UI: Charles Liu
- Impeccable: Paul Bakaus, https://impeccable.style/ (Apache 2.0, github.com/pbakaus/impeccable)
