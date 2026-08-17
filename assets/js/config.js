

/* ==================================================
   SHARED SITE PREFERENCES
   One preference layer for the whole ETROYL website.
   Theme and language are persisted in cookies so the
   preference survives between www and apex hostnames.
   ================================================== */

const ETROYL_CONFIG = {
    contact: {
        email: "contact@etroyl.com",
        mobile: "+32475302555",
        landline: "+32475302555",
        whatsapp: "32475302555",
        telegram: "ETROYL"
    },
    web3forms: {
        endpoint: 'https://api.web3forms.com/submit',
        accessKey: 'f6bd6c39-d3dd-4124-8ef7-c8afba732037'
    }
};

(function () {
    'use strict';

    const THEME_KEY = 'etroyl-theme';
    const LANGUAGE_KEY = 'etroyl-language';
    const LANGUAGES = ['ar', 'de', 'es', 'fr', 'it', 'nl', 'zh'];
    const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

    function setCookie(name, value) {
        document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${COOKIE_MAX_AGE}; Path=/; Domain=.etroyl.com; SameSite=Lax`;
    }

    function getCookie(name) {
        const match = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}=([^;]*)`));
        return match ? decodeURIComponent(match[1]) : null;
    }

    function getLanguageFromPath(pathname) {
        const match = pathname.match(/^\\/(ar|de|es|fr|it|nl|zh)(?:\\/|$)/);
        return match ? match[1] : 'en';
    }

    function getSavedTheme() {
        const cookieTheme = getCookie(THEME_KEY);
        if (cookieTheme === 'light' || cookieTheme === 'dark') return cookieTheme;

        const localTheme = localStorage.getItem(THEME_KEY) || localStorage.getItem('theme');
        return localTheme === 'light' || localTheme === 'dark' ? localTheme : 'dark';
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
        localStorage.setItem('theme', theme);
        setCookie(THEME_KEY, theme);
    }

    function getSavedLanguage() {
        const pathLanguage = getLanguageFromPath(window.location.pathname);
        if (pathLanguage !== 'en') {
            setCookie(LANGUAGE_KEY, pathLanguage);
            localStorage.setItem(LANGUAGE_KEY, pathLanguage);
            return pathLanguage;
        }

        const cookieLanguage = getCookie(LANGUAGE_KEY);
        if (LANGUAGES.includes(cookieLanguage)) return cookieLanguage;

        const localLanguage = localStorage.getItem(LANGUAGE_KEY);
        return LANGUAGES.includes(localLanguage) ? localLanguage : 'en';
    }

    function rememberLanguageFromLink(event) {
        const link = event.target.closest('a[href]');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href) return;

        const match = href.match(/^\\/(ar|de|es|fr|it|nl|zh)(?:\\/|$)/);
        const language = match ? match[1] : (href === '/' ? 'en' : null);
        if (!language) return;

        setCookie(LANGUAGE_KEY, language);
        localStorage.setItem(LANGUAGE_KEY, language);
    }

    applyTheme(getSavedTheme());
    const language = getSavedLanguage();

    window.ETROYL_PREFS = {
        getLanguage: () => language,
        getTheme: () => document.documentElement.getAttribute('data-theme') || 'dark',
        applyTheme
    };

    document.addEventListener('click', function (event) {
        rememberLanguageFromLink(event);

        if (!event.target.closest('#theme-toggle')) return;

        /* script.js owns the actual toggle on the main pages.
           Wait until its handler has run, then persist the result. */
        setTimeout(() => {
            const theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'light' || theme === 'dark') {
                setCookie(THEME_KEY, theme);
                localStorage.setItem(THEME_KEY, theme);
                localStorage.setItem('theme', theme);
            }
        }, 0);
    });
})();
