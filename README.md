# ETROYL — Foundational Website

Engineering firm specializing in Degital design, embedded systems, DSP, Ground Penetrating Radar, Electromagnetic modeling.

## Philosophy

Zero-dependency by design. No frameworks, no build steps, no node_modules.
Plain HTML5, CSS3, and vanilla JavaScript — served exactly as written. This keeps the site performant, auditable, and resilient to dependency-rot over time.

## Directory Structure

The repository is organized to separate global assets from page-specific content, ensuring a clean, scalable codebase.

etroyl/\
├── assets/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Global static assets\
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── css/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Layout, variables, and reset stylesheets\
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── js/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Global scripts (main entry point)\
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── img/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Logos, favicons, site-wide imagery\
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── fonts/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Self-hosted professional typography\
├── components/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Reusable HTML snippets\
├── projects/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Subdirectory for individual project pages\
├── blog/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Subdirectory for articles and publications\
├── about/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# About page assets\
├── index.html&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# The primary entry point\
├── robots.txt&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# SEO indexing configuration\
└── sitemap.xml&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Search engine discovery file

## Conventions

- **Design Tokens**: Colors, spacing, and typography are defined in variables.css using CSS custom properties and referenced via var(--token-name). Hardcoded values in style.css are prohibited.
- **Semantic HTML**: Structure is defined by meaning (\<nav\>, \<section\>, \<header\>) rather than presentation.
- **Layout Engines**: Flexbox is utilized for one-dimensional alignment (rows/columns); CSS Grid is reserved for complex, two-dimensional arrangements.
- **Accessibility (A11y)**: Every interactive element is keyboard-navigable. Focus states (:focus-visible) are strictly maintained for keyboard users.
- **Performance**: Assets are self-hosted to avoid third-party latency, and font-display: swap is utilized to ensure instant text rendering.

## Hosting & Paths

The site is designed for high-availability hosting via GitHub Pages and Cloudflare.
- **Absolute vs. Relative**: Internal paths use relative linking for standard components. Open Graph metadata (og:image) utilizes absolute URLs to ensure social media crawlers reliably locate preview assets.
- **Caching**: To refresh social media preview cards, perform a cache purge via the LinkedIn Post Inspector or the respective social platform's debugger.

## Phase Roadmap
- **Phase 1**: Structure, semantics, accessibility, and theming scaffold. [Complete]
- **Phase 2**: Visual identity — typography, color tokens, and branding. [Complete]
- **Phase 3**: Active interaction — Dark/Light mode integration and system preference detection. [Complete]
- **Phase 4**: Expansion of content-specific subdirectories (projects, blog). [In Progress]