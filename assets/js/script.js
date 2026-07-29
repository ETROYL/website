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
 
'use strict';

// 1. SELECTORS & CONSTANTS (Define these first!)
const htmlElement = document.documentElement;
const toggleButton = document.getElementById('theme-toggle');
const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');

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

function randomizeSlogan() {
    const slogans = [
    	"Built on Science. Delivered through Engineering."
    ];
    const randomIndex = Math.floor(Math.random() * slogans.length);
    const heroHeading = document.getElementById('hero-heading');
    
    if (heroHeading) {
        heroHeading.textContent = slogans[randomIndex];
    }
}

// 5. INITIALIZATION
function init() {
    setCurrentYear();
    randomizeSlogan();
    renderIcons();
}

init();
