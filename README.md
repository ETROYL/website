# ETROYL — Foundational Website

Engineering firm site: FPGA · Embedded Systems · Signal Processing · Applied AI.

## Philosophy

Zero-dependency by design. No frameworks, no build step, no `node_modules`.
Plain HTML5, CSS3, and vanilla JavaScript — served exactly as written. This
keeps the site fast, auditable, and free of dependency-rot over time.

## Structure

```
index.html                 Entry point
/pages/                    Secondary pages (Phase 3+)
/assets/css/
    reset.css               Browser-default normalization (rarely changes)
    variables.css           Design tokens: color, type, spacing (the theme)
    style.css               Layout & components (consumes the tokens above)
/assets/js/script.js       Page behavior, small named functions + one init()
/assets/images/            icons/ and logos/ subfolders
/assets/fonts/             Self-hosted font files, if used instead of a CDN
/docs/                     Internal engineering notes
```

## Conventions

- **Colors, spacing, and type sizes are never hardcoded** in `style.css`.
  They're defined once in `variables.css` as CSS custom properties and
  referenced via `var(--token-name)`.
- **Semantic HTML first.** Use the tag that matches the content's meaning
  (`<nav>`, `<section>`, `<header>`) before reaching for a `<div>`.
- **Flexbox for 1D alignment, Grid for 2D layout.** Don't reach for Grid
  on a simple row, and don't fight Flexbox to build a true grid.
- **Accessibility is not optional**: every interactive element must be
  keyboard-reachable, and focus states must remain visible.

## Phase Roadmap

- **Phase 1 (current):** Structure, semantics, accessibility, theming scaffold.
- **Phase 2:** Visual identity — real typography, color, imagery, content.
- **Phase 3:** Secondary pages, expanded components.
