# ETROYL — Foundational Website

Engineering firm specializing in **FPGA & SoC design, embedded systems,
digital signal processing (DSP), radar sensing, AI & robotics, and Ground
Penetrating Radar (GPR) / electromagnetic modeling.**

**Live:** [etroyl.com](https://www.etroyl.com) — see [Domains](#domains-hosting) below for `.be` / `.eu`.

## Philosophy

Zero-dependency by design. No frameworks, no build steps, no `node_modules`.
Plain HTML5, CSS3, and vanilla JavaScript — served exactly as written. This
keeps the site performant, auditable, and resilient to dependency-rot over
time.

**One deliberate exception:** the icon set (Lucide, via CDN — see
`<script src="https://unpkg.com/lucide@latest">` in each page's `<head>`).
Hand-drawing and hand-maintaining ~15 inline SVGs was judged not worth the
tradeoff against a maintained, tree-shaken icon library. Everything else —
layout, theming, interactivity, the resource library, the shared footer
component — remains hand-written with zero external runtime code.

## Directory Structure

The repository separates global assets from page-specific content, keeping
the codebase flat and easy to reason about at this stage.

```
etroyl/
├── assets/
│   ├── css/          # reset.css, variables.css (design tokens), style.css, education.css
│   ├── js/           # script.js (shared behavior + <site-footer> component), education.js
│   ├── img/          # logos, favicons, hero banner, project/insight thumbnails
│   └── fonts/        # self-hosted Inter variable font
├── about/
│   ├── about.html
│   └── founder.html
├── index.html         # homepage: hero, services, who-we-help, projects, insights, stats, about, contact
├── education.html      # resource library — manifest-driven, populated by education.js
└── README.md
```

`/projects/` and `/blog/` are **not yet real subdirectories.** Featured
Projects and Latest Insights currently live as anchor sections on the
homepage (`#projects`, `#insights`) with placeholder links pointing back at
themselves. They become real subdirectories with individual case-study and
article pages in a later phase — see [Phase Roadmap](#phase-roadmap).

`robots.txt` and `sitemap.xml` are referenced here as intended repo-root
files for SEO crawling, but are **not confirmed present yet** — verify
they exist (or add them) before leaning on search-engine discovery.

## Conventions

- **Design Tokens**: Colors, spacing, and typography are defined in
  `variables.css` using CSS custom properties and referenced via
  `var(--token-name)`. Hardcoded values in `style.css` are prohibited.
- **Semantic HTML**: Structure is defined by meaning (`<nav>`, `<section>`,
  `<header>`) rather than presentation.
- **Layout Engines**: Flexbox is used for one-dimensional alignment
  (rows/columns, including wrapping label rows); CSS Grid is reserved for
  genuinely two-dimensional arrangements (card grids, the footer's
  brand+nav-columns layout).
- **Shared markup, not copy-paste**: Repeated cross-page structure (the
  footer) is defined once as a native Web Component (`<site-footer>`,
  registered in `script.js`) and referenced by every page, rather than
  duplicated HTML that has to be kept in sync by hand across four+ files.
- **Accessibility (A11y)**: Every interactive element is keyboard-navigable.
  Focus states (`:focus-visible`) are strictly maintained for keyboard
  users. Empty/placeholder states (e.g. the Education library before real
  content exists) always explain themselves in plain language rather than
  rendering a silent blank space.
- **Performance**: Assets are self-hosted to avoid third-party latency
  (aside from the Lucide exception above), and `font-display: swap` is used
  to ensure instant text rendering.
- **Placeholders are explicit, never silent**: Where real photography,
  case-study pages, or a blog don't exist yet, the site uses clearly-marked
  placeholder graphics or self-referencing anchor links — never a broken
  image or a dead-end click — so the site never looks unfinished by
  accident.

## Domains & Hosting

The site is hosted via **GitHub Pages**, fronted by **Cloudflare** (DNS,
CDN caching, and automatic `mailto:` obfuscation on published email
addresses).

Three domains are associated with the brand:

- **etroyl.com** — canonical, production domain. All internal links,
  `canonical` tags, and Open Graph URLs point here.
- **etroyl.be** — Belgian regional domain.
- **etroyl.eu** — EU regional domain.

**Important for SEO**: search engines penalize duplicate content served
identically across multiple domains. `.be` and `.eu` should each either
(a) redirect to `etroyl.com`, or (b) serve their own content with a
`<link rel="canonical" href="https://www.etroyl.com/...">` tag pointing
back at the `.com` version. Verify this is configured before relying on
either domain for marketing — right now the canonical tags in this repo
only account for `.com`.

- **Absolute vs. relative paths**: Internal navigation uses root-relative
  links (`/index.html`, `/assets/css/style.css`). Open Graph metadata
  (`og:image`) uses absolute URLs, since social-media crawlers need a
  fully-qualified path to reliably fetch preview assets.
- **Social preview caching**: To refresh a stale preview card after
  changing `og:image` or `og:title`, force a re-scrape via the LinkedIn
  Post Inspector or the relevant platform's own debugger/inspector tool —
  platforms cache these aggressively and won't pick up changes on their
  own for a while.

## SEO Notes

The meta description and page `<title>` already lead with the core keyword
set (FPGA, embedded systems, DSP, GPR, radar sensing, AI/robotics) —
keep any future page additions consistent with that same vocabulary rather
than introducing new terminology per-page, so search engines associate all
of it with one coherent topic cluster.

Two low-effort, high-value additions worth prioritizing once the site is
otherwise stable:

- **`robots.txt` + `sitemap.xml`** at the repo root (see note above) — the
  minimum needed for search engines to reliably discover and re-crawl every
  page as new ones are added.
- **JSON-LD structured data** (`schema.org/Organization`) in `index.html`,
  including `sameAs` links to the LinkedIn and YouTube profiles already in
  the footer. This is what lets Google associate the brand name with a
  knowledge-panel-style entity rather than treating it as plain text — a
  meaningful step up for a firm whose name (ETROYL) has no existing search
  presence to compete against.

Neither is implemented yet in this repo; both are natural next steps once
the current content pass is finished.

## Phase Roadmap

- **Phase 1**: Structure, semantics, accessibility, and theming scaffold. **[Complete]**
- **Phase 2**: Visual identity — typography, color tokens, and branding. **[Complete]**
- **Phase 3**: Active interaction — dark/light mode, system-preference detection, shared `<site-footer>` component. **[Complete]**
- **Phase 4**: Front-page content build-out — services, who-we-help, featured projects, insights, stats, about teaser, contact CTA. **[Complete]**
- **Phase 5**: Real content — populate the Education library manifest, replace remaining placeholder project/insight links with dedicated `/projects/` and `/blog/` pages. **[In Progress]**
- **Phase 6**: Search & discoverability — `robots.txt`, `sitemap.xml`, structured data, multi-domain canonical/redirect setup, analytics. **[Planned]**
