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
 
// Detect System Preference
const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');

// Set initial theme
if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
} else if (userPrefersDark) {
    htmlElement.setAttribute('data-theme', 'dark');
} else {
    htmlElement.setAttribute('data-theme', 'light');
} 
 
const toggleButton = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

toggleButton.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

function setCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (!yearElement) return; // Defensive check: if the element
                                // is ever removed from the HTML,
                                // this fails silently instead of
                                // throwing a console error.
    yearElement.textContent = new Date().getFullYear();
}

/**
 * Single initialization entry point.
 * WHY: As more behaviors are added (mobile nav toggle,
 * scroll-based header state, form validation), they each
 * get their own function above and one line here — keeping
 * this init() function as a readable table of contents for
 * everything the page does on load.
 */
function init() {
    setCurrentYear();
}

/* Because script.js is loaded with `defer` in index.html,
   the DOM is guaranteed to be fully parsed by the time this
   line executes — so init() can safely run immediately
   without wrapping it in a DOMContentLoaded listener. */
init();

// Function to randomize the hero slogan
function randomizeSlogan() {
    const slogans = [
        "Engineering the systems others can't.",
        "Engineering Behind Boundaries.",
        "Engineering Intelligent Systems."
    ];

    // Select a random index
    const randomIndex = Math.floor(Math.random() * slogans.length);
    
    // Target the element
    const heroHeading = document.getElementById('hero-heading');
    
    // Update the content
    if (heroHeading) {
        heroHeading.textContent = slogans[randomIndex];
    }
}

// Execute on load
randomizeSlogan();