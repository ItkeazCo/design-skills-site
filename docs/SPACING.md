# Spacing rules

## Rule set
1. **Use one scale and nothing off it.** Use Graphite's 4-based tokens: 2 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40, plus 64 and 104 for page rhythm, derived as 40+24 and 64+40. Material uses an 8dp scale (space100 = 8dp) and treats 4 as the fine step. ([M3 Spacing](https://m3.material.io/styles/spacing), [8-pt grid](https://spec.fm/specifics/8-pt-grid))
2. **Inside ≤ between.** A container's padding must never be larger than the gap around it. Related things sit closer together than unrelated things. ([Cieden: internal ≤ external](https://cieden.com/book/sub-atomic/spacing/spacing-best-practices), [NN/g: proximity](https://www.nngroup.com/articles/gestalt-proximity/))
3. **Step up one level per level of grouping.** Spacing is roughly 1.5–2× per level:
   - label→control: 4
   - between items: 8–12
   - heading→its content: 12–16
   - group→group: 24
   - section→section: 40–64
   A heading is always closer to what it introduces than to the section above it. ([Refactoring UI](https://www.refactoringui.com/): "more space between groups than within them")
4. **Parents own spacing.** Use `gap` or padding on the container instead of margins on children. Children don't push each other. ([M3 Spacing](https://m3.material.io/styles/spacing), [Every Layout: Stack](https://every-layout.dev/layouts/stack/))
5. **Use one control height per row.** Controls that share a bar share a height (36, `control-md`) and a centre line. Touch targets reach 44 with invisible hit slop, not by making the visual bigger. ([WCAG 2.2 target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/layout))
6. **Optical padding.** Pills take horizontal padding of 16 (`inset-button`), or 12 when there is an icon or field (`inset-control`). The trailing side of a field is tighter (8) when a key hint or icon fills it. Icon-only buttons are square.
7. **Gutters depend on the breakpoint.** On compact screens the gutter is 20 (`inset-container`; Apple's compact margin is 16 and regular is 20). From 760 px up it is 40 (`gap-section`). Tile grids use a 24 column gap on desktop and 16 on mobile. ([Apple margins](https://developer.apple.com/news/?id=s8sl4tpa), [M3 breakpoints](https://m3.material.io/foundations/layout/breakpoints))
8. **Density comes from content.** Tighten text and dividers, never hit targets.
9. **Use one inset per container.** The overlay uses 40 on every side (20 on mobile), cards use 20, and fields 12. There are no asymmetric paddings.

## What was off (audit, 5 Nov 2026)
- **Sidebar.** Rows used 5/6 px padding with a 10 px gap, and toggles had 1/6 px padding. All of these were off scale.
- **Inline links.** They had 10 px vertical padding (toc, `.primary`). The `.up` link and preview list used a 6 px gap.
- **Tiles.** The gap from media to caption (16) equalled the gap between tiles (16), so captions didn't read as belonging to their tile.
- **Palette groups.** There was 0 between groups, so different sections ran together.
- **Overlay.** Padding was 0 / 64 / 40, so the top, sides and bottom all differed. Action buttons were 24 apart, wider than the gap between unrelated blocks. Swatch labels collided at an 8 px gap.
- **Top bar.** About was 44 px tall while the theme control and search were 36. Search padding was 0 6 0 12.
- **Overlay scrolling.** The overlay had `overflow: hidden`, so long details couldn't scroll.

Graphite's own internals are exempt as designed: the segmented track inset of 3, option gap of 6 and kbd padding of 5.

## Now
- `--s1…--s7` are aliases of Graphite tokens, and a final "SPACING LAYER" in `style.css` sets every component.
- The audit script (tests/spacing-audit.mjs) reports 0 off-scale values outside Graphite's own components.
