/* ==================================================
   SCRIPT.JS — MAIN BEHAVIOR
   ==================================================
   PURPOSE: Vanilla JS entry point for the site. Phase 1
   only needs one real behavior (auto-updating the footer
   year), but the FILE STRUCTURE below is written the way
   it should look once real interactivity is added — so
   you're establishing the pattern now, not retrofitting
   it once the file gets larger.

   ARCHITECTURE NOTE: Instead of one long procedural script,
   this file is organized as small, named functions, each
   responsible for exactly one behavior, called once from
   a single init() at the bottom. This mirrors good embedded
   firmware structure: small, single-purpose routines called
   from a clear main() — not one 200-line blob where every
   concern is tangled together. It also means each function
   can be tested, understood, or removed independently.
   ================================================== */

'use strict';
/* Strict mode catches common mistakes at parse time
   (e.g. accidental global variable creation from a typo'd
   assignment) rather than failing silently at runtime. */

/**
 * Updates the copyright year in the footer automatically.
 * WHY THIS EXISTS: Without this, a hardcoded "© 2026" in
 * the HTML becomes visibly wrong every New Year's Day
 * unless someone remembers to edit it. This is a small
 * example of a broader principle: any value that changes
 * on a schedule should be computed, not hardcoded.
 */
 

// 1. SELECTORS & CONSTANTS (Define these first!)
const htmlElement = document.documentElement;
const toggleButton = document.getElementById('theme-toggle');
const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');

/**
 * <site-footer> — a custom element that injects the shared
 * footer markup into itself on connect. WHY THIS INSTEAD OF
 * COPY-PASTING THE FOOTER INTO EVERY PAGE: the footer's content
 * (nav links, social URLs, copyright) is one piece of data that
 * happens to render in four places. Before this, changing the
 * LinkedIn URL meant editing index.html, about.html, founder.html,
 * and education.html by hand — four chances to introduce a typo
 * or forget one file. Now it's edited once, here, and every page
 * that includes <site-footer></site-footer> picks it up on next
 * deploy automatically.
 *
 * No build step, no framework — customElements is a native
 * browser API. connectedCallback() runs the moment the browser
 * parses the tag, synchronously, before the rest of this file
 * runs setCurrentYear() below — which is why this class definition
 * sits above init() in this file, not after it.
 */
const FOOTER_I18N = {
    en: {
        company: 'Company', about: 'About', leadership: 'Leadership', careers: 'Careers',
        resources: 'Resources', education: 'Education', blog: 'Blog', documentation: 'Documentation',
        connect: 'Connect', contact: 'Contact', linkedin: 'LinkedIn', youtube: 'YouTube',
        rights: 'All rights reserved.'
    },
    fr: {
        company: 'Société', about: 'À propos', leadership: 'Direction', careers: 'Carrières',
        resources: 'Ressources', education: 'Formation', blog: 'Blog', documentation: 'Documentation',
        connect: 'Nous suivre', contact: 'Contact', linkedin: 'LinkedIn', youtube: 'YouTube',
        rights: 'Tous droits réservés.'
    },
    es: {
        company: 'Empresa', about: 'Nosotros', leadership: 'Liderazgo', careers: 'Empleo',
        resources: 'Recursos', education: 'Formación', blog: 'Blog', documentation: 'Documentación',
        connect: 'Conectar', contact: 'Contacto', linkedin: 'LinkedIn', youtube: 'YouTube',
        rights: 'Todos los derechos reservados.'
    },
    de: {
        company: 'Unternehmen', about: 'Über uns', leadership: 'Führungsteam', careers: 'Karriere',
        resources: 'Ressourcen', education: 'Wissen', blog: 'Blog', documentation: 'Dokumentation',
        connect: 'Netzwerk', contact: 'Kontakt', linkedin: 'LinkedIn', youtube: 'YouTube',
        rights: 'Alle Rechte vorbehalten.'
    },
    nl: {
        company: 'Bedrijf', about: 'Over ons', leadership: 'Directie', careers: 'Carrière',
        resources: 'Bronmateriaal', education: 'Kennis', blog: 'Blog', documentation: 'Documentatie',
        connect: 'Volg ons', contact: 'Contact', linkedin: 'LinkedIn', youtube: 'YouTube',
        rights: 'Alle rechten voorbehouden.'
    },
    it: {
        company: 'Azienda', about: 'Chi siamo', leadership: 'Leadership', careers: 'Lavora con noi',
        resources: 'Risorse', education: 'Formazione', blog: 'Blog', documentation: 'Documentazione',
        connect: 'Contatti sociali', contact: 'Contatti', linkedin: 'LinkedIn', youtube: 'YouTube',
        rights: 'Tutti i diritti riservati.'
    }
};

class SiteFooter extends HTMLElement {
    connectedCallback() {
        const lang = document.documentElement.getAttribute('lang') || 'en';
        const rootDir = lang === 'en' ? '/' : `/${lang}/`;
        const t = FOOTER_I18N[lang] || FOOTER_I18N.en;

        this.innerHTML = `
            <div class="container footer-grid">
                <div class="footer-brand">
                    <img src="/assets/img/logo.webp" alt="ETROYL" width="778" height="399" class="footer-logo">
                    <p>&copy; <span id="current-year"></span> ETROYL. ${t.rights}</p>
                    <address>Oorbeeksesteenweg 59, Tienen, Belgium</address>
                </div>

                <nav class="footer-nav" aria-label="${t.company}">
                    <h3>${t.company}</h3>
                    <ul>
                        <li><a href="${rootDir}about/about.html">${t.about}</a></li>
                        <li><a href="${rootDir}about/founder.html">${t.leadership}</a></li>
                        <li><a href="#contact">${t.careers}</a></li>
                    </ul>
                </nav>

                <nav class="footer-nav" aria-label="${t.resources}">
                    <h3>${t.resources}</h3>
                    <ul>
                        <li><a href="${rootDir}education.html">${t.education}</a></li>
                        <li><a href="#insights">${t.blog}</a></li>
                        <li><a href="${rootDir}education.html">${t.documentation}</a></li>
                    </ul>
                </nav>

                <nav class="footer-nav" aria-label="${t.connect}">
                    <h3>${t.connect}</h3>
                    <ul>
                        <li><a href="mailto:contact@etroyl.com">${t.contact}</a></li>
                        <li><a href="tel:+32475302555">+32 475 30 25 55</a></li>
                        <li><a href="https://www.linkedin.com/in/etroyl-labs-8990bb425/" target="_blank" rel="noopener">${t.linkedin}</a></li>
                        <li><a href="https://www.youtube.com/@ETROYL-Labs" target="_blank" rel="noopener">${t.youtube}</a></li>
                    </ul>
                </nav>
            </div>
        `;
    }
}
customElements.define('site-footer', SiteFooter);


/**
 * Wires up the language-switcher dropdown: toggles the hidden
 * menu on button click, closes it on an outside click or Escape,
 * and keeps aria-expanded in sync — same "one source of truth
 * drives both the visual state and the accessible state" pattern
 * used by aria-pressed on the Education page's filter buttons.
 */
function initLangSwitcher() {
    const wrapper = document.querySelector('.lang-switcher');
    if (!wrapper) return;

    const toggle = wrapper.querySelector('.lang-switcher__toggle');
    const menu = wrapper.querySelector('.lang-switcher__menu');
    if (!toggle || !menu) return;

    function closeMenu() {
        menu.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
    }

    function openMenu() {
        menu.hidden = false;
        toggle.setAttribute('aria-expanded', 'true');
    }

    toggle.addEventListener('click', (event) => {
        event.stopPropagation(); // prevents this same click from
                                  // immediately re-triggering the
                                  // document-level listener below
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        isOpen ? closeMenu() : openMenu();
    });

    // Clicking anywhere outside the dropdown closes it.
    document.addEventListener('click', (event) => {
        if (!wrapper.contains(event.target)) closeMenu();
    });

    // Escape closes it and returns focus to the toggle button,
    // rather than leaving focus stranded on a now-hidden link —
    // standard expected keyboard behavior for any dropdown/menu.
    wrapper.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
            toggle.focus();
        }
    });
}

// 2. INITIAL THEME LOGIC
if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
} else {
    htmlElement.setAttribute('data-theme', 'dark');
}

// 3. EVENT LISTENERS
if (toggleButton) {
    toggleButton.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

/**
 * Renders every <i data-lucide="..."> tag in the DOM into its
 * corresponding inline SVG icon. WHY THIS IS SEPARATE FROM
 * init() below: Lucide loads via a deferred <script> tag from
 * a CDN (see the <head> of each HTML file), so this call must
 * run after that script has actually executed. `defer` on both
 * script.js and the Lucide script guarantees they run in
 * document order, so by the time this file executes, `window.lucide`
 * is already available.
 */
function renderIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// 4. OTHER FUNCTIONS
function setCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (!yearElement) return;
    yearElement.textContent = new Date().getFullYear();
}

// 5. INITIALIZATION
function init() {
    setCurrentYear();
    initLangSwitcher();
    renderIcons();
}

init();
