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
class SiteFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="container footer-grid">
		<div class="footer-brand">
		        <img
		            src="/assets/img/logo-icon.png"
		            alt="ETROYL"
		            width="408"
		            height="289"
		            class="footer-logo">
		        <p>&copy; 2026&ndash;<span id="current-year"></span> ETROYL. All rights reserved.</p>
		        <!--<address>Oorbeeksesteenweg 59, Tienen, Belgium</address>-->
		    </div>

		    <nav class="footer-nav" aria-label="Company">
		        <h3>Company</h3>
		        <ul>
		            <li><a href="/about/about.html">About</a></li>
		            <li><a href="/about/founder.html">Leadership</a></li>
		            <li><a href="#contact">Careers</a></li>
		        </ul>
		    </nav>

		    <nav class="footer-nav" aria-label="Resources">
		        <h3>Resources</h3>
		        <ul>
		            <li><a href="/education.html">Education</a></li>
		            <li><a href="#insights">Blog</a></li>
		            <li><a href="/education.html">Documentation</a></li>
		        </ul>
		    </nav>

		    <nav class="footer-nav" aria-label="Connect">
		        <h3>Connect</h3>
		        <ul>
		            <li><a href="mailto:contact@etroyl.com">Contact</a></li>
		            <li><a href="tel:+32475302555">+32 475 30 25 55</a></li>
		            <li><a href="https://www.linkedin.com/in/etroyl-labs-8990bb425/" target="_blank" rel="noopener">LinkedIn</a></li>
		            <li><a href="https://www.youtube.com/@ETROYL-Labs" target="_blank" rel="noopener">YouTube</a></li>
		        </ul>
		    </nav>
		</div>
        `;
    }
}
customElements.define('site-footer', SiteFooter);

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
