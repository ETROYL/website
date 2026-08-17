# ETROYL Website

The public website for **ETROYL — Enjoy The Rest Of Your Life**.

ETROYL is an engineering company built around three connected stages:

**SCIENCE → ENGINEERING → DEPLOYMENT**

The website reflects that identity: scientific depth, practical engineering,
and solutions that are ultimately intended for real-world use.

**Production:** https://www.etroyl.com

---

## Engineering Focus

ETROYL's current technical focus includes:

- FPGA and digital design
- Embedded systems and embedded Linux
- Digital signal processing (DSP)
- Radar signal processing and sensing
- Ground-Penetrating Radar (GPR)
- Electromagnetic and near-field modeling
- Real-time video processing
- Robotics and intelligent systems
- Hardware/software co-design and system integration

The site deliberately uses **technical capabilities** as first-class landing
pages. These pages describe areas of engineering expertise; they are not project
case studies and therefore live at the top level of the website rather than
under `/projects/`.

---

## Website Structure

```text
/
├── index.html                         # Main multilingual homepage
├── about/
│   ├── about.html                     # About ETROYL
│   └── founder.html                   # Founder & Technical Director
├── education.html                     # ETROYL Academy / engineering resources
│
├── fpga-design/
│   └── index.html                     # FPGA design capability
├── embedded-linux/
│   └── index.html                     # Embedded Linux capability
├── radar-signal-processing/
│   └── index.html                     # Radar DSP capability
├── ground-penetrating-radar/
│   └── index.html                     # GPR capability
├── electromagnetic-modeling/
│   └── index.html                     # EM modeling capability
├── real-time-video-processing/
│   └── index.html                     # Real-time video capability
│
├── ar/ de/ es/ fr/ it/ nl/ zh/        # Published language versions
├── assets/
│   ├── css/                           # Site styles and design tokens
│   ├── js/                            # Shared behavior and page-specific behavior
│   ├── img/                           # Logos, photography, graphics, icons
│   └── fonts/                          # Self-hosted Inter variable font
│
├── i18n/                               # Source translations (JSON)
├── templates/
│   └── index.template.html             # Homepage template
├── build.py                            # Local multilingual build + sitemap generator
├── robots.txt
├── sitemap.xml
├── CNAME
└── README.md
```

### Projects and Insights

The homepage currently contains the **Featured Projects** and **Selected
Engineering Insights** sections. Dedicated project case studies and insight
articles are part of the future content expansion.

When those pages are introduced, they should follow this separation:

- `/projects/<project>/` — a concrete ETROYL project or case study
- `/insights/<topic>/` — a technical insight, research note, or engineering article
- `/<technical-capability>/` — a durable technical capability / SEO landing page

A capability page should not be placed under `/projects/` simply because the
subject may also appear in a project. The URL hierarchy should communicate the
role of the page clearly.

---

## Multilingual Architecture

The homepage is maintained from a shared HTML template and JSON translation
sources.

```text
templates/index.template.html
          +
      i18n/*.json
          │
          ▼
       build.py
          │
          ├── index.html
          ├── ar/index.html
          ├── de/index.html
          ├── es/index.html
          ├── fr/index.html
          ├── it/index.html
          ├── nl/index.html
          └── zh/index.html
```

`build.py` is intentionally a **local build tool**, not a runtime framework.
The deployed website remains plain static HTML, CSS and JavaScript.

A locale is included in the generated homepage only when it is published in
its corresponding `i18n/<language>.json` file. English is always live.

The generated pages include canonical URLs and `hreflang` alternates for the
published language set.

### Runtime language preference

Language preference is handled centrally by `assets/js/script.js`.

- The language selector is the only mechanism that changes the saved language.
- The selected language is persisted in `localStorage`, with a cookie fallback.
- Internal links are localized according to the saved preference.
- English can always be explicitly selected and clears the non-English behavior.
- Local development uses same-origin detection, so language behavior can be
  tested without deploying first.
- Section anchors such as `#services`, `#projects`, and `#contact` are preserved
  when links are localized.

Technical pages are English-only. `assets/js/technical-pages.js` contains only
technical-page-specific behavior and uses the shared language state from
`script.js` to display the English-only notice when a non-English language is
selected.

---

## Shared JavaScript Architecture

The site follows a simple shared-behavior model:

- **`assets/js/script.js`** — single shared runtime for site-wide behavior,
  including theme handling, language preference, navigation localization,
  footer component, language switcher, icons, and contact-form behavior.
- **`assets/js/config.js`** — configuration only (for example contact details
  and service credentials). It should not contain site behavior or functions.
- **`assets/js/technical-pages.js`** — optional page-specific behavior for the
  six technical capability pages. It must rely on `script.js` for shared
  language and theme state.
- **`assets/js/education.js`** — page-specific behavior for Education/Academy.

Do not introduce a second implementation of a shared feature when extending
the site. In particular, theme and language behavior should remain centralized
in `script.js`.

### Theme architecture

The light/dark theme is a **single site-wide preference**. All pages, including
localized pages and technical capability pages, use the same shared theme state
from `script.js`.

Changes to the theme implementation should therefore be treated as a site-wide
change and tested across the main, localized, Education, About, Founder and
technical pages.

---

## Build

Requirements: **Python 3 standard library only.** No package installation is
required.

From the repository root:

```bash
python3 build.py
```

The build regenerates the multilingual homepage files and `sitemap.xml`.

### Important

Generated HTML and `sitemap.xml` are committed to the repository because the
production site is deployed as static files. After changing `i18n/*.json` or
the homepage template, run the build and review the generated files before
committing them.

The six technical SEO landing pages are **static pages** and are intentionally
not generated from the homepage template. `build.py` preserves their sitemap
entries whenever it regenerates `sitemap.xml`.

---

## Design & Engineering Principles

### Zero-dependency by design

The website avoids frameworks, package managers, bundlers and runtime build
systems. This keeps the deployed site small, transparent, auditable and
resilient over time.

The site currently uses Lucide icons through its CDN distribution as a
conscious, limited exception. Core layout, styling, navigation behavior and
shared components remain hand-written.

### Semantic HTML

HTML structure should describe meaning rather than presentation. Use semantic
landmarks, headings, lists, buttons and links appropriately.

### Design tokens

Global colors, spacing and typography are defined in `variables.css` and
consumed through CSS custom properties. Avoid introducing arbitrary values in
component styles when an existing design token is appropriate.

### Accessibility

Interactive elements should remain keyboard accessible, retain visible
`:focus-visible` states, and expose meaningful labels to assistive technology.
Decorative images should use empty `alt` text; informative images should have
descriptive alternatives.

### Performance

Prefer lightweight, static assets, appropriate image dimensions and modern
formats. Keep JavaScript limited to behavior that genuinely requires it.

### Consistency

ETROYL's current brand language is:

> **Built on Science. Delivered through Engineering.**
>
> **Science | Engineering | Deployment**

New pages should reinforce this identity rather than reintroducing the older
**Precision | Reliability | Innovation** positioning.

---

## SEO & Discoverability

SEO is treated as part of the information architecture rather than as a layer
of keywords added after the design is finished.

Current foundations include:

- Canonical URLs on the main pages
- `hreflang` handling for published language versions
- Root-level `robots.txt`
- Root-level `sitemap.xml`
- Six dedicated technical capability landing pages
- Internal linking between the homepage and technical capability pages
- Unique titles and descriptions for the capability pages
- Open Graph metadata on the main pages

`robots.txt` points crawlers to the production sitemap:

```text
https://www.etroyl.com/sitemap.xml
```

### Canonical domain

`https://www.etroyl.com/` is the canonical production domain.

The `.be` and `.eu` domains are brand/regional domains and should not create
competing duplicate versions of the same content. Their final redirect or
canonical configuration is an infrastructure concern and should be verified
separately from the repository.

### Future SEO work

Potential future improvements include:

- Organization / WebSite JSON-LD structured data
- Dedicated project case studies
- Dedicated technical insight articles
- Stronger internal topic clustering as content grows
- Search-performance monitoring and analytics
- Further technical SEO validation across Google and Bing

SEO should remain aligned with the actual engineering content of ETROYL; the
site should not create thin pages solely to target search queries.

---

## Hosting & Domains

The production site is hosted through **GitHub Pages** with **Cloudflare**
providing DNS and CDN-related infrastructure.

- **etroyl.com** — canonical production domain
- **etroyl.be** — Belgian regional domain
- **etroyl.eu** — European regional domain

All production canonical and Open Graph URLs should use `www.etroyl.com`.

---

## Content Roadmap

### Current

- Multilingual homepage architecture
- About and founder pages
- ETROYL Academy / Education foundation
- Technical SEO landing pages
- Search-engine discovery infrastructure
- Responsive visual system and accessibility foundations

### Next

1. Complete and validate the technical landing-page content.
2. Build real project case-study pages under `/projects/`.
3. Build the technical insight library under `/insights/`.
4. Continue developing the ETROYL Academy as a curated engineering knowledge
   repository.
5. Add stronger structured data and measurement once the content structure is
   stable.

### Longer term

ETROYL's broader roadmap includes an engineering knowledge platform, original
research and technical publications where disclosure permits, open-source
engineering material, and the development of ETROYL hardware and sensing
projects.

---

## Repository Philosophy

This repository should remain understandable to an engineer opening it for
the first time.

Prefer:

- simple files over hidden tooling
- explicit structure over abstraction for its own sake
- static output over runtime complexity
- reusable source templates where repetition becomes expensive
- technical accuracy over SEO-driven filler
- clear commits and reviewable changes

The website is not intended to become a generic web application. It is a
technical engineering website that should remain fast, durable and easy to
maintain.
