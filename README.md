# ETROYL — Foundational Website

Engineering firm site: FPGA · Embedded Systems · Signal Processing · Applied AI.

## Philosophy

Zero-dependency by design. No frameworks, no build step, no `node_modules`.
Plain HTML5, CSS3, and vanilla JavaScript — served exactly as written. This
keeps the site fast, auditable, and free of dependency-rot over time.

## Structure

```
index.html                 Entry point
/pages/
    education.html          Education & Resources library
/assets/css/
    reset.css               Browser-default normalization (rarely changes)
    variables.css           Design tokens: color, type, spacing (the theme)
    style.css               Global layout & components (all pages)
    education.css           Page-specific styles, loaded only by education.html
/assets/js/
    script.js               Global page behavior, small named functions + one init()
    education.js            Resource manifest + render logic for the Education page
/assets/images/
    logos/                  logo-icon.png (header), logo-full.png (footer/lockup)
    banner-hero.webp / .jpg Hero banner, WebP with JPEG fallback via <picture>
    icons/                  Favicons
/assets/education/
    videos/ images/ documents/   Real files referenced by educationManifest
/assets/fonts/             Self-hosted font files, if used instead of a CDN
/docs/                     Internal engineering notes
```

## Hosting note: relative paths, on purpose

Every internal `href`/`src` in this repo is a **relative path**
(`assets/css/style.css`, `../assets/css/style.css` from `/pages/`),
never root-absolute (`/assets/css/style.css`). This is deliberate:
GitHub Pages project sites (`username.github.io/repo-name`) serve the
repo from a subpath, not the domain root, so a root-absolute path
silently 404s there. Relative paths resolve correctly regardless of
subpath, custom domain, or renaming the repo. **When adding a new
page**, count its folder depth from the repo root and prefix asset
paths with the matching number of `../` — a page at `/pages/foo.html`
uses `../assets/...`, one at `/pages/sub/foo.html` would use
`../../assets/...`.

## Adding Education content

The Education page has no server-side upload — it's a static site with
nowhere to persist an uploaded file. Content is added by editing a
plain data array (see `/assets/education/README.md` for the full
workflow: drop the file in the matching folder, add one entry to
`educationManifest` in `/assets/js/education.js`, refresh). This keeps
the page fully static while still being trivial to update.

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
