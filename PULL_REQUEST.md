## i18n: add French localized pages and header/i18n scaffolding

This branch adds localized French versions of the following pages and applies consistent i18n header/footer scaffolding across English and French pages:

- fr/education.html
- fr/about/about.html
- fr/about/founder.html

Additionally, the following English pages were updated to include:
- Hreflang <link rel="alternate"> blocks
- Language switcher markup in the header
- Canonical links where missing
- aria-current on active navigation links
- Meta description tags where missing

Files changed
- Added: fr/education.html, fr/about/about.html, fr/about/founder.html
- Modified: education.html, about/about.html, about/founder.html

Notes
- The footer remains a <site-footer> custom element. script.js reads document.documentElement.lang and selects translated footer strings from FOOTER_I18N.
- Navigation links in localized pages point to localized paths (e.g., /fr/about/about.html). If you prefer a different linking strategy, tell me and I can adjust.

Testing
- Checkout branch i18n/localize-fr-pages
- Serve repo root and verify the localized pages and header behavior.
