# ETROYL — Foundational Website

Engineering firm site: FPGA · Embedded Systems · Signal Processing · Applied AI.

## Philosophy

Zero-dependency by design. No frameworks, no build step, no `node_modules`.
Plain HTML5, CSS3, and vanilla JavaScript — served exactly as written. This
keeps the site fast, auditable, and free of dependency-rot over time.

## Structure

The repo is currently flat — every file lives at the root, no
subfolders. This is a deliberate simplification for how the repo is
currently being managed via GitHub's web upload UI, which doesn't
reliably preserve dragged subfolders unless you drag real OS folders
(not individually-picked files) into it.

```
index.html          Homepage
education.html       Education & Resources library
reset.css            Browser-default normalization (rarely changes)
variables.css        Design tokens: color, type, spacing (the theme)
style.css             Global layout & components (all pages)
education.css         Page-specific styles, loaded only by education.html
script.js             Global page behavior, small named functions + one init()
education.js          Resource manifest + render logic for the Education page
logo-icon.png          Header logo (transparent, cropped to icon only)
logo-full.png           Footer logo (icon + wordmark lockup)
banner-hero.webp / .jpg  Hero banner, WebP with JPEG fallback via <picture>
CNAME                    Custom domain configuration (GitHub Pages)
```

As real education content (videos/images/PDFs) is added, consider
creating one `education-media/` folder to keep those separate from
the site's code files — see the note at the top of `education.js`
for exactly how to do that via GitHub's web UI without needing git
on the command line.

## Hosting note: relative paths, on purpose

Every internal `href`/`src` in this repo is a **relative, same-folder
path** (`style.css`, `logo-icon.png`, `education.html`) — never
root-absolute (`/style.css`) and never assuming subfolders that don't
exist in this repo. This is deliberate: GitHub Pages project sites
(`username.github.io/repo-name`) serve the repo from a subpath, not
the domain root, so a root-absolute path silently 404s there — and a
path assuming an `assets/` folder 404s the moment that folder doesn't
actually exist in the repo. Same-folder relative paths resolve
correctly regardless of subpath, custom domain, or repo layout.
**If subfolders are reintroduced later**, every path that crosses
into or out of that folder needs updating to match — that's the one
tradeoff of the current flat layout: it's simple today, but nothing
here auto-adjusts if the shape of the repo changes without matching
the code.

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
