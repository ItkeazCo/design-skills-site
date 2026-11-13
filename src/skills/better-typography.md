# Typography Skill

Good typography reinforces the meaning of the text and conserves the reader's
attention. Use this as a baseline when an AI agent designs or builds screen UI.
Numbers are benchmarks, not a single correct value: deviate for a reason, never
from habit. When sources disagree, the default is listed first and the other
range is noted.

**Precedence** if rules conflict: (1) content correctness and semantics;
(2) accessibility, language, and licensing; (3) user intent and medium;
(4) typographic benchmarks; (5) project taste. (Butterick)

## Modes

**Enforce** (when building). Apply every Critical and High rule automatically
in HTML, CSS, and visible UI copy. Do not ask permission and do not explain the
typography unless asked. Paste real UTF-8 characters in source. In JSX, paste
the character or use a JS expression such as `{'’'}`; a `\u2019` escape inside
tag text may render literally. (bencium)

**Audit** (when reviewing). Classify medium, language/script, and text roles
first. Never "fix" quotes, dashes, or spaces inside code, commands, URLs,
emails, IDs, or data. Inspect the strongest evidence available: declared CSS is
not proof of the rendered font or measure. Report each finding as impact,
element, observed problem, correction, and evidence level. Run Critical rules
before High, then Medium, then Polish. End with the three fixes that would help
most. (Butterick, mblode, bencium)

## Body-text-first workflow

Set body typeface, size, line height, and measure before headings, labels, or
display type. Every other role is calibrated against body; do not apply body
ranges to display type. Encode roles as a reusable type scale or tokens, not
one-off local styles. (Butterick, bencium, mblode, Figma)

## Key numbers

Use these as starting points; the rules below repeat the same figures in context.

| Topic | Default for screen UI | Other sourced ranges |
|---|---|---|
| Body size | Start at 16px / 1em (Figma) | 15–25px web, 10–12pt print (Butterick, bencium); 16–24px desktop, 16–19px mobile, never below 16px on mobile (mblode) |
| Line height | Unitless 1.2–1.45 (Butterick, Figma, bencium) | Layouts must hold at 1.5× (WCAG 1.4.12, Figma); mblode web default 1.45–1.6; avoid above ~1.8 (mblode) |
| Measure | 45–75 characters; ideal ~66 (Figma, mblode) | Butterick/bencium allow 45–90; WCAG max 80 (Figma); if past 75, increase line-height (Figma) |
| Contrast | 4.5:1 regular; 3:1 large (Figma, WCAG, mblode) | Large = 18pt / ~24px, or 14pt bold / ~18.7px (Figma); AAA 7:1 (Figma) |
| Resize / spacing tests | Hold at 200% zoom (Figma, WCAG) | WCAG 1.4.12 *test* values, not defaults: line-height 1.5, paragraph spacing 2× size, letter-spacing 0.12em, word-spacing 0.16em (Butterick, WCAG) |
| Caps tracking | 0.05–0.12em on caps and small caps (Butterick, bencium) | bencium often uses 0.06em; mblode allows 0.05–0.2em, more on smaller caps |
| Weights | 2–3 weights; body 400 or 500; bold 700 (Figma, mblode) | Do not use thin/ultra-light for body (mblode) |
| Families | Max two, plus mono for code (Butterick, bencium, mblode) | One capable family is often enough (Butterick) |

## Critical

- **Body size.** Start UI body at 16px (1em). Keep web body in 15–25px; print 10–12pt. Do not go below 16px on mobile, and do not make mobile body smaller than desktop. Adjust for x-height; avoid ordinary UI body above ~24px. (Figma, Butterick, bencium, mblode)
- **Line height.** Use a unitless body `line-height` of 1.2–1.45 (120–145%). Layouts must still hold when the user sets line-height to 1.5× (WCAG 1.4.12). Longer measures need more leading; display type is tighter. mblode's web default is a slightly looser 1.45–1.6. Avoid fixed-px line-height, which headings inherit badly, and leading above ~1.8. (Butterick, Figma, WCAG, bencium, mblode)
- **Measure.** Target 45–75 characters per rendered English line (about 66 is a common ideal). Stay within Butterick's 45–90 range; do not exceed 80 (WCAG). If a line must go past 75, increase line-height. Put `max-width` on text containers (`65ch` is only a starting estimate — `ch` measures the zero glyph). Count real lines at narrow, typical, and wide viewports; never let prose run edge to edge. (Figma, mblode, Butterick, bencium, WCAG)
- **Contrast.** Regular text ≥ 4.5:1; large text ≥ 3:1, where large is 18pt (~24px) or 14pt bold (~18.7px). AAA is 7:1 for regular text. Apply this to secondary, placeholder, and disabled text too. (Figma, WCAG, mblode)
- **Resize and spacing overrides.** Layouts must hold at 200% text enlargement without clipping, overlap, or lost content. Do not disable zoom to hide overflow. The WCAG 1.4.12 values above are override tests, not default styling. (Figma, WCAG, Butterick)
- **Real styles.** Load genuine regular, italic, and bold files (WOFF2). Never rely on faux-bold, faux-italic, or scaled caps. Map all cuts to one `font-family` with distinct `font-weight` / `font-style`. (mblode, Butterick)
- **Fallbacks.** Every stack needs metric-aware system fallbacks. Verify the font that actually loaded, required scripts and accents, and layout shift in the fallback state (`size-adjust` / ascent / descent overrides help). (mblode, Butterick)
- **Quotes.** Use language-appropriate curly quotes and apostrophes in prose (`“ ” ‘ ’`). Apostrophes point down (`don’t`, `’70s`). Leave straight marks in code and data, and for feet/inches unless true primes are used. Never typographically transform code, commands, URLs, or identifiers. (Butterick, bencium, mblode)
- **Dashes.** Hyphen for compounds; en dash for ranges and pairings (`1–10`); em dash for a prose break, typically closed (or a consistently spaced en dash). Never use `--`. If the sentence uses "from," write "to," not an en dash. (Butterick, bencium, mblode)

## High

- **Weights.** Limit a layout to two or three weights. Body at 400 or 500, not thin or ultra-light; use 700 for bold, from the real bold file. (Figma, mblode)
- **Type scale.** Build a fixed set of sizes from the body size (1em) and reuse it. A modular ratio (1.25, 1.333, 1.5) is a starting guide, not a requirement; break it when the face has a sweet spot. Adjacent roles need a clear jump — at least 20–25% — or they should share one size. Figma's worked example is body 16px and H1 at 3em (48px); Butterick prefers the smallest visible distinction that works. (Figma, mblode, Butterick, bencium)
- **Hierarchy.** Use as few heading levels as the structure needs; prefer no deeper than h1–h3 in most UI. Space above should exceed space below; keep headings with the following text; do not underline or hyphenate headings; prefer bold over italic for headings. Change one or two axes at a time (size, then weight). (Butterick, bencium, mblode)
- **Caps tracking.** Letter-space all-caps and real small caps at 0.05–0.12em (bencium often uses 0.06em). mblode allows up to 0.2em on smaller caps, with extra word-spacing so words do not merge. Keep cap runs under one line. Never letter-space lowercase body as a general effect. (Butterick, bencium, mblode, Figma)
- **Paragraphs.** Use first-line indent or paragraph space, never both. Do not indent the first paragraph after a heading. Indent about 1–1.5em (bencium allows 1–4× size, often 1.5em). Paragraph space about 50–100% of font size (0.75em is a common web default). (Butterick, bencium, mblode)
- **Alignment.** Left-align running web prose. Center only short titles or quotes (under one line). Justify only with language-aware hyphenation and a wide enough measure; never letter-space to fill justified lines. (Butterick, bencium, mblode, Figma)
- **Emphasis.** One signal at a time: bold or italic, not both; keep it shorter than a sentence when practical. Do not underline non-links; do not use quotes or all caps for emphasis; do not emphasize whole paragraphs. (Butterick, bencium, mblode)
- **Ellipsis and spaces.** Use the ellipsis character (`…`), not three periods. One word space between sentences, never two. Use non-breaking spaces to keep `© 2026`, `§ 12`, `Fig. 3`, honorifics, and short numeric labels together. (Butterick, bencium, mblode)
- **Numerals.** Use tabular lining figures, right-aligned, in tables and aligned quantities (`font-variant-numeric: tabular-nums lining-nums`). Proportional or oldstyle figures may be used in running prose if the font has them. (Butterick, bencium, mblode)
- **Responsive type.** Measure and leading rules do not change with screen size. Scale `font-size` and container width together; `clamp(16px, 2.5vw, 20px)` is a documented starting pattern. Give text containers at least `padding: 0 1rem` on small screens. Scale display headings down on small screens; do not shrink body, subheads, or controls. (bencium, mblode, Butterick, Figma)
- **Minimum caption size.** Do not add tracking to "save" small type. 12px is a floor for non-essential captions only, never for actionable UI text. (mblode)

## Medium

- **Families.** One capable family is often enough; two is the practical maximum; a third only for a distinct role such as code. Give each family a consistent role. Avoid novelty, script, or monospaced faces for body text. (Butterick, bencium, mblode)
- **OpenType.** Keep kerning on (`font-kerning: normal` or `"kern"`). Enable standard ligatures (`liga`) in prose; keep discretionary ligatures (`dlig`) off in body; disable ligatures and character substitutions in code. Use real small caps (`smcp`) with ~0.05em tracking; never fake them. Confirm the loaded font actually ships the feature. (Butterick, bencium, mblode)
- **Symbols.** Use `© ™ ®` correctly (`©` plus a non-breaking space and year; do not write "Copyright ©"). Use `×` for multiplication and a true minus when the math is clear. Prefer prime/double-prime for measurements when the system supports them; otherwise keep straight foot/inch marks — never curly quotes for that. Preserve diacritics; a missing glyph is a font failure. (Butterick, bencium, mblode)
- **Lists, quotes, tables.** Use semantic lists, not typed bullets; wrap hanging lines with the list text. Distinguish block quotes with indent (about 2–5em) or spacing, not stacked decoration, and drop redundant quotation marks. Prefer padding and a thin header rule over heavy table borders; pad cells about `0.5em 1em`. (Butterick, bencium, mblode)
- **Loading.** Prefer WOFF2 and, where useful, a variable font. Choose a loading policy that avoids invisible text and disruptive layout shift (`font-display: swap` is mblode's default). If an `opsz` axis exists, confirm optical sizing at the rendered size; use text cuts for body and display cuts for large type. (mblode, Butterick)
- **Links and color.** Keep links identifiable without color alone; do not style non-links to look like links. Avoid pure `#000` on `#fff`. In dark mode, use off-white on dark, not pure white on black, and retune weight (mblode: slightly heavier; bencium: slightly lighter). (Butterick, mblode, bencium, Figma)
- **Language metadata.** Set `lang` and direction on the document and on mixed-language runs. This drives hyphenation, quotes, and fallback. (Butterick)
- **UI casing.** Prefer sentence case for headings, buttons, labels, and nav in product UI, applied consistently. (mblode)

## Polish

- **Display type.** At large sizes (mblode: 48px+), tighten line-height and tracking so lines do not gape; do not let descenders collide with the next line. (mblode)
- **Widows.** Use a non-breaking space between the last two words of headlines and short UI strings. `text-wrap: balance` for headings; `pretty` for body (not for short strings). For print: `orphans: 2; widows: 2`. Full widow control of web body is not always practical. (mblode, bencium, Butterick)
- **Hanging punctuation and fine spaces.** Hang opening quotes on block quotes and display lines where support allows. Hair or thin spaces around em dashes if a full space is too wide. (mblode, bencium)
- **Link underline.** If underlining links, keep the stroke thin (`text-decoration-thickness: 1px; text-underline-offset: 2px`). (bencium)

## RTL / Hebrew

Supported by these sources: identify language, script, and direction for each
run and set `lang` and `dir`; do not apply English rules for letter-spacing,
hyphenation, justification, quotation marks, or emphasis to an unfamiliar
script; mixed Hebrew or Arabic with Latin or numbers needs bidirectional
inspection, not source-order guesses; arbitrary tracking can break joining
scripts (called out explicitly for Arabic). (Butterick)

Practice, not found in these sources: do not add letter-spacing to Hebrew; do
not italicize Hebrew; give Hebrew body slightly taller line-height than the
Latin range. Confirm with a language-specific reference and rendered samples
before treating these as hard rules.

## Pre-delivery checklist

Check these before handing off a UI or typography review.

- [ ] Body size, unitless line-height, and rendered measure checked at narrow, typical, and wide viewports
- [ ] Contrast meets 4.5:1 / 3:1; layout holds at 200% zoom and at 1.5 line-height
- [ ] Real weights and italics load; fallbacks are metric-aware; no faux styles
- [ ] Type scale and two–three weights are used consistently; at most two families plus mono for code
- [ ] Prose uses curly quotes, correct dashes, ellipses, and non-breaking spaces; code and data are untouched
- [ ] Caps are tracked; lowercase body is not; tables use tabular lining figures
- [ ] Paragraphs use indent or space, not both; headings have more space above than below
- [ ] No edge-to-edge prose; text does not hit the screen edge; links are not color-only
- [ ] Kerning is on; standard ligatures in prose; ligatures off in code; real small caps only
- [ ] Layout still works under the WCAG 1.4.12 spacing overrides, not just at default styles
- [ ] `lang` / `dir` are set; required scripts have glyph coverage
