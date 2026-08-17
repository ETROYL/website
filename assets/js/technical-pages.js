(function () {
    'use strict';

    const SUPPORTED_LANGUAGES = ['ar', 'de', 'es', 'fr', 'it', 'nl', 'zh'];
    const LANGUAGE_KEY = 'etroyl-language';

    function getLanguageFromPath(pathname) {
        const match = pathname.match(/^\/(ar|de|es|fr|it|nl|zh)(?:\/|$)/);
        return match ? match[1] : null;
    }

    function getLanguageFromReferrer() {
        try {
            if (!document.referrer) return null;

            const url = new URL(document.referrer);
            if (url.origin !== window.location.origin) return null;

            return getLanguageFromPath(url.pathname);
        } catch {
            return null;
        }
    }

    function getVisitorLanguage() {
        const fromReferrer = getLanguageFromReferrer();

        if (fromReferrer) {
            localStorage.setItem(LANGUAGE_KEY, fromReferrer);
            return fromReferrer;
        }

        const saved = localStorage.getItem(LANGUAGE_KEY);
        return SUPPORTED_LANGUAGES.includes(saved) ? saved : 'en';
    }

    function showLanguageNote(language) {
        const note = document.getElementById('language-note');

        if (note && language !== 'en') {
            note.hidden = false;
        }
    }

    function localizeUrl(href, language) {
        if (language === 'en' || !href) return href;

        const localizedPaths = new Map([
            ['/', `/${language}/`],
            ['/education.html', `/${language}/education.html`],
            ['/about/about.html', `/${language}/about/about.html`],
            ['/about/founder.html', `/${language}/about/founder.html`]
        ]);

        if (localizedPaths.has(href)) {
            return localizedPaths.get(href);
        }

        if (href === '/#contact') {
            return `/${language}/#contact`;
        }

        return href;
    }

    function localizeInternalLinks(language) {
        if (language === 'en') return;

        document.querySelectorAll('a[href]').forEach((link) => {
            const href = link.getAttribute('href');
            const localized = localizeUrl(href, language);

            if (localized !== href) {
                link.setAttribute('href', localized);
            }
        });
    }

    function restoreThemeIcon() {
        const button = document.getElementById('theme-toggle');
        if (!button) return;

        // Keep the exact Lucide sun-moon component used by the main header.
        button.innerHTML = '<i data-lucide="sun-moon" aria-hidden="true"></i>';

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    const language = getVisitorLanguage();

    document.addEventListener('DOMContentLoaded', function () {
        showLanguageNote(language);
        localizeInternalLinks(language);
        restoreThemeIcon();

        const themeButton = document.getElementById('theme-toggle');
        if (themeButton) {
            themeButton.addEventListener('click', function () {
                // theme.js runs first and changes the icon; restore the shared
                // sun-moon component afterwards so technical pages match main.
                restoreThemeIcon();
            });
        }
    });
})();
