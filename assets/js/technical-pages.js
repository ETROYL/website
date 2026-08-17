(function () {
    'use strict';

    const SUPPORTED_LANGUAGES = ['ar', 'de', 'es', 'fr', 'it', 'nl', 'zh'];

    function getLanguageFromReferrer() {
        try {
            const referrer = document.referrer;
            if (!referrer) return null;

            const url = new URL(referrer);
            if (url.origin !== window.location.origin) return null;

            const match = url.pathname.match(/^\/(ar|de|es|fr|it|nl|zh)(?:\/|$)/);
            return match ? match[1] : null;
        } catch {
            return null;
        }
    }

    function getVisitorLanguage() {
        const fromReferrer = getLanguageFromReferrer();

        if (fromReferrer) {
            localStorage.setItem('etroyl-language', fromReferrer);
            return fromReferrer;
        }

        const saved = localStorage.getItem('etroyl-language');
        return SUPPORTED_LANGUAGES.includes(saved) ? saved : 'en';
    }

    function showLanguageNote(language) {
        const note = document.getElementById('language-note');

        if (note && language !== 'en') {
            note.hidden = false;
        }
    }

    function localizeInternalLinks(language) {
        if (language === 'en') return;

        const root = `/${language}/`;
        const localizedPaths = new Map([
            ['/', root],
            ['/education.html', `${root}education.html`],
            ['/about/about.html', `${root}about/about.html`],
            ['/about/founder.html', `${root}about/founder.html`],
            ['/#contact', `${root}#contact`]
        ]);

        document.querySelectorAll('a[href]').forEach((link) => {
            const href = link.getAttribute('href');
            if (localizedPaths.has(href)) {
                link.setAttribute('href', localizedPaths.get(href));
            }
        });
    }

    function renderIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    const language = getVisitorLanguage();

    document.addEventListener('DOMContentLoaded', function () {
        showLanguageNote(language);
        localizeInternalLinks(language);
        renderIcons();
    });
})();
