(function () {
    'use strict';

    const SUPPORTED_LANGUAGES = ['ar', 'de', 'es', 'fr', 'it', 'nl', 'zh'];

    function getLanguageFromPath(pathname) {
        const match = pathname.match(/^\/(ar|de|es|fr|it|nl|zh)(?:\/|$)/);
        return match ? match[1] : null;
    }

    function localizeUrl(href, language) {
        if (language === 'en' || !href) return href;

        const localizedPaths = new Map([
            ['/', `/${language}/`],
            ['/education.html', `/${language}/education.html`],
            ['/about/about.html', `/${language}/about/about.html`],
            ['/about/founder.html', `/${language}/about/founder.html`]
        ]);

        if (localizedPaths.has(href)) return localizedPaths.get(href);
        if (href === '/#contact') return `/${language}/#contact`;

        return href;
    }

    function localizeInternalLinks(language) {
        if (language === 'en') return;

        document.querySelectorAll('a[href]').forEach((link) => {
            const href = link.getAttribute('href');
            const localized = localizeUrl(href, language);
            if (localized !== href) link.setAttribute('href', localized);
        });
    }

    function showLanguageNote(language) {
        const note = document.getElementById('language-note');
        if (!note || language === 'en') return;

        note.hidden = false;
        /* Keep this notice visually close to the fixed header on every viewport. */
        note.style.marginTop = '8px';
    }

    function start() {
        const language = window.ETROYL_PREFS?.getLanguage?.() ||
            getLanguageFromPath(window.location.pathname) || 'en';

        showLanguageNote(language);
        localizeInternalLinks(language);
    }

    function loadSharedPreferences() {
        if (window.ETROYL_PREFS) {
            start();
            return;
        }

        const script = document.createElement('script');
        script.src = '/assets/js/config.js';
        script.onload = start;
        document.head.appendChild(script);
    }

    if (SUPPORTED_LANGUAGES.includes(getLanguageFromPath(window.location.pathname))) {
        loadSharedPreferences();
    } else {
        loadSharedPreferences();
    }
})();
