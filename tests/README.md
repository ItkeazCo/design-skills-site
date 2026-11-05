# QA scripts (Playwright)
Run against `npx vite --port 5199`. These need `playwright` and `@axe-core/playwright` installed next to them. On the box they run from /tmp/pw.
- qa-states.mjs: every interactive component in default, hover, focus-visible, pressed and disabled states, on desktop and mobile, in light and dark. It writes shots/qa-states.png and checks:
  - exactly one focus ring (outline + border + box-shadow, including the field host and its children)
  - the ring sits on the field, not on the inner input
  - hover never changes size
  - no console errors
  - axe WCAG 2.2 AA
- targets.mjs: hit areas of at least 32 px on desktop and 44 px on mobile, counting `::after` hit slop.
- layout-shift.mjs: hover never moves anything.
- spacing-audit.mjs: every computed gap, padding and margin is on the Graphite scale.
- topbar.mjs: top-bar controls share one height and one centre line.
