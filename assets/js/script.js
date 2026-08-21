/* ==================================================
   SCRIPT.JS — SHARED SITE BEHAVIOR
   ==================================================
   Shared browser-side behavior for ETROYL.

   The header and footer are rendered centrally here so that
   navigation changes are made once and propagated site-wide.
   No framework or external runtime dependency is introduced.
   ================================================== */

'use strict';

const htmlElement = document.documentElement;

const SUPPORTED_LANGUAGES = ['ar', 'de', 'es', 'fr', 'it', 'nl', 'zh'];
const THEME_COOKIE = 'etroyl-theme';
const LANGUAGE_COOKIE = 'etroyl-language';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/* ==================================================
   SHARED LANGUAGE DATA
   ================================================== */

const HEADER_I18N = {
    en: {
        services: 'Services',
        projects: 'Projects',
        academy: 'Academy',
        about: 'About',
        leadership: 'Leadership',
        contact: 'Contact',
        navLabel: 'Primary',
        language: 'Choose language',
        theme: 'Toggle color theme',
        home: 'ETROYL home'
    },
    fr: {
        services: 'Services',
        projects: 'Projets',
        academy: 'Académie',
        about: 'À propos',
        leadership: 'Direction',
        contact: 'Contact',
        navLabel: 'Navigation principale',
        language: 'Choisir la langue',
        theme: 'Changer le thème de couleur',
        home: 'Accueil ETROYL'
    },
    es: {
        services: 'Servicios',
        projects: 'Proyectos',
        academy: 'Academia',
        about: 'Nosotros',
        leadership: 'Liderazgo',
        contact: 'Contacto',
        navLabel: 'Navegación principal',
        language: 'Elegir idioma',
        theme: 'Cambiar el tema de color',
        home: 'Inicio de ETROYL'
    },
    de: {
        services: 'Leistungen',
        projects: 'Projekte',
        academy: 'Akademie',
        about: 'Über uns',
        leadership: 'Führung',
        contact: 'Kontakt',
        navLabel: 'Hauptnavigation',
        language: 'Sprache auswählen',
        theme: 'Farbmodus wechseln',
        home: 'ETROYL Startseite'
    },
    nl: {
        services: 'Diensten',
        projects: 'Projecten',
        academy: 'Academie',
        about: 'Over ons',
        leadership: 'Directie',
        contact: 'Contact',
        navLabel: 'Hoofdnavigatie',
        language: 'Taal kiezen',
        theme: 'Kleurthema wijzigen',
        home: 'ETROYL home'
    },
    it: {
        services: 'Servizi',
        projects: 'Progetti',
        academy: 'Accademia',
        about: 'Chi siamo',
        leadership: 'Leadership',
        contact: 'Contatti',
        navLabel: 'Navigazione principale',
        language: 'Scegli lingua',
        theme: 'Cambia tema colore',
        home: 'Home ETROYL'
    },
    ar: {
        services: 'الخدمات',
        projects: 'المشاريع',
        academy: 'الأكاديمية',
        about: 'عن ETROYL',
        leadership: 'القيادة',
        contact: 'اتصل بنا',
        navLabel: 'التنقل الرئيسي',
        language: 'اختيار اللغة',
        theme: 'تبديل نمط الألوان',
        home: 'الصفحة الرئيسية لـ ETROYL'
    },
    zh: {
        services: '服务',
        projects: '项目',
        academy: '学院',
        about: '关于我们',
        leadership: '领导团队',
        contact: '联系',
        navLabel: '主导航',
        language: '选择语言',
        theme: '切换颜色主题',
        home: 'ETROYL 首页'
    }
};

const LANGUAGE_FLAGS = {
    ar: 'sa.svg',
    de: 'de.svg',
    en: 'us.svg',
    es: 'es.svg',
    fr: 'fr.svg',
    it: 'it.svg',
    nl: 'nl.svg',
    zh: 'cn.svg'
};

/* ==================================================
   COOKIE & LANGUAGE HELPERS
   ================================================== */

function setSiteCookie(name, value) {
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${COOKIE_MAX_AGE}; Path=/; Domain=.etroyl.com; SameSite=Lax`;
}

function getSiteCookie(name) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

function getCurrentPageLanguage() {
    const match = window.location.pathname.match(/^\/(ar|de|es|fr|it|nl|zh)(?:\/|$)/);
    return match ? match[1] : 'en';
}

function getCurrentLanguageFromPath(pathname) {
    const match = pathname.match(/^\/(ar|de|es|fr|it|nl|zh)(?:\/|$)/);
    return match ? match[1] : 'en';
}

function saveLanguage(language) {
    if (!SUPPORTED_LANGUAGES.includes(language) && language !== 'en') return;

    setSiteCookie(LANGUAGE_COOKIE, language);

    try {
        localStorage.setItem(LANGUAGE_COOKIE, language);
    } catch {
        // Cookie remains the persistent fallback.
    }
}

function getSavedLanguage() {
    try {
        const localLanguage = localStorage.getItem(LANGUAGE_COOKIE);
        if (SUPPORTED_LANGUAGES.includes(localLanguage) || localLanguage === 'en') {
            return localLanguage;
        }
    } catch {
        // Fall through to cookie.
    }

    const cookieLanguage = getSiteCookie(LANGUAGE_COOKIE);
    if (SUPPORTED_LANGUAGES.includes(cookieLanguage) || cookieLanguage === 'en') {
        return cookieLanguage;
    }

    return 'en';
}

/* ==================================================
   INTERNAL LINK LOCALIZATION
   ================================================== */

function localizeInternalLinks(language) {
    if (language === 'en') return;

    const localizedPaths = new Map([
        ['/', `/${language}/`],
        ['/education.html', `/${language}/education.html`],
        ['/about/about.html', `/${language}/about/about.html`],
        ['/about/founder.html', `/${language}/about/founder.html`]
    ]);

    document.querySelectorAll('a[href]').forEach((link) => {
        if (link.closest('.lang-switcher')) return;

        const rawHref = link.getAttribute('href');
        if (
            !rawHref ||
            rawHref.startsWith('#') ||
            rawHref.startsWith('mailto:') ||
            rawHref.startsWith('tel:')
        ) {
            return;
        }

        let url;
        try {
            url = new URL(rawHref, window.location.href);
        } catch {
            return;
        }

        const isSameOrigin = url.origin === window.location.origin;
        const isETROYLDomain =
            url.hostname === 'etroyl.com' ||
            url.hostname === 'www.etroyl.com';

        if (!isSameOrigin && !isETROYLDomain) return;

        const localized = localizedPaths.get(url.pathname);
        if (!localized) return;

        link.setAttribute('href', `${localized}${url.search}${url.hash}`);
    });
}

/* ==================================================
   SHARED HEADER
   ==================================================
   One header for the entire site.

   The existing static <header class="site-header"> markup on
   legacy pages is replaced at runtime by this component. This
   lets us migrate the site safely without changing every page
   by hand in one operation.

   Navigation rules:
     - Homepage: Services / Projects / Academy / About / Contact
     - About page: Services / Projects / Academy / Leadership / Contact
     - Founder page: Services / Projects / Academy / About / Contact
     - Other pages: Services / Projects / Academy / About / Contact

   The About <-> Leadership relationship therefore remains contextual
   without adding an extra navigation item.
   ================================================== */

function getHeaderContext() {
    let path = window.location.pathname.replace(/\/+$/, '') || '/';
    const hash = window.location.hash;

    const languagePrefix = path.match(/^\/(ar|de|es|fr|it|nl|zh)(?=\/|$)/);

    if (languagePrefix) {
        path = path.slice(languagePrefix[0].length) || '/';
    }

    if (path === '/about/about.html') return 'about';
    if (path === '/about/founder.html') return 'founder';
    if (path.endsWith('/education.html')) return 'academy';

    if (path === '/' || path === '/index.html') {
        if (hash === '#services') return 'services';
        if (hash === '#projects') return 'projects';
        if (hash === '#contact') return 'contact';
        return 'home';
    }

    return 'other';
}

function getHeaderRootDirectory(language) {
    return language === 'en' ? '/' : `/${language}/`;
}

function buildHeaderLanguageMenu(language, rootDir, currentContext) {
    const currentPath = window.location.pathname;
    const currentFile = currentPath.split('/').pop() || 'index.html';

    let pagePath = '';

    if (currentContext === 'about') pagePath = 'about/about.html';
    else if (currentContext === 'founder') pagePath = 'about/founder.html';
    else if (currentContext === 'academy') pagePath = 'education.html';
    else if (currentContext === 'home') pagePath = '';
    else if (currentFile && currentFile !== 'index.html') pagePath = currentFile;

    const items = Object.keys({ ar: true, de: true, en: true, es: true, fr: true, it: true, nl: true, zh: true })
        .map((code) => {
            const targetRoot = getHeaderRootDirectory(code);
            const targetPath = pagePath ? `${targetRoot}${pagePath}` : targetRoot;
            const current = code === language ? ' aria-current="true"' : '';
            const fullNames = {
                ar: 'العربية',
                de: 'Deutsch',
                en: 'English',
                es: 'Español',
                fr: 'Français',
                it: 'Italiano',
                nl: 'Nederlands',
                zh: '简体中文'
            };

            return `
                        <li>
                            <a href="${targetPath}" title="${fullNames[code]}" aria-label="${fullNames[code]}"${current}>
                                <img src="/assets/img/flags/${LANGUAGE_FLAGS[code]}" alt="" class="lang-flag" aria-hidden="true">
                                <span class="lang-code">${code.toUpperCase()}</span>
                            </a>
                        </li>`;
        })
        .join('');

    return items;
}

function getHeaderNavigation(language, context) {
    const t = HEADER_I18N[language] || HEADER_I18N.en;
    const rootDir = getHeaderRootDirectory(language);
    const home = rootDir;

    const servicesHref = `${home}index.html#services`;
    const projectsHref = `${home}index.html#projects`;
    const contactHref = `${home}index.html#contact`;

    const items = [
        { key: 'services', label: t.services, href: servicesHref },
        { key: 'projects', label: t.projects, href: projectsHref },
        { key: 'academy', label: t.academy, href: `${rootDir}education.html` },
    ];

    if (context === 'about') {
        items.push({ key: 'leadership', label: t.leadership, href: `${rootDir}about/founder.html` });
    } else {
        items.push({ key: 'about', label: t.about, href: `${rootDir}about/about.html` });
    }

    items.push({ key: 'contact', label: t.contact, href: contactHref });

    return items;
}

function getHeaderActiveKey(context) {
    if (context === 'home') return null;
    if (context === 'other') return null;
    return context;
}

class SiteHeader extends HTMLElement {
    connectedCallback() {
        const language = getCurrentPageLanguage();
        const direction = document.documentElement.getAttribute('dir') || 'ltr';
        const t = HEADER_I18N[language] || HEADER_I18N.en;
        const context = getHeaderContext();
        const navigation = getHeaderNavigation(language, context);
        const activeKey = getHeaderActiveKey(context);
        const rootDir = getHeaderRootDirectory(language);

        this.classList.add('site-header');
        this.setAttribute('dir', direction);

        this.innerHTML = `
            <div class="container">
                <a href="${rootDir}" class="logo" aria-label="${t.home}">
                    <img
                        src="/assets/img/logo-mono.webp"
                        alt="ETROYL"
                        width="978"
                        height="978"
                        class="logo-mark"
                    >
                </a>

                <div class="header-actions">
                    <div class="lang-switcher">
                        <button
                            type="button"
                            class="lang-switcher__toggle"
                            aria-haspopup="true"
                            aria-expanded="false"
                            aria-label="${t.language}"
                        >
                            <i data-lucide="languages" aria-hidden="true"></i>
                            <span class="lang-switcher__current">
                                <img
                                    src="/assets/img/flags/${LANGUAGE_FLAGS[language]}"
                                    alt=""
                                    class="lang-flag"
                                    aria-hidden="true"
                                >
                                ${language.toUpperCase()}
                            </span>
                        </button>

                        <ul class="lang-switcher__menu" hidden>
                            ${buildHeaderLanguageMenu(language, rootDir, context)}
                        </ul>
                    </div>

                    <button
                        id="theme-toggle"
                        class="theme-btn"
                        aria-label="${t.theme}"
                    >
                        <i data-lucide="sun-moon" aria-hidden="true"></i>
                    </button>
                </div>

                <nav class="main-nav" aria-label="${t.navLabel}">
                    <ul>
                        ${navigation.map((item) => {
                            const active = item.key === activeKey ? ' aria-current="page"' : '';
                            return `
                        <li>
                            <a href="${item.href}"${active}>${item.label}</a>
                        </li>`;
                        }).join('')}
                    </ul>
                </nav>
            </div>`;
    }
}

if (!customElements.get('site-header')) {
    customElements.define('site-header', SiteHeader);
}

function renderSharedHeader() {
    document.querySelectorAll('header.site-header').forEach((existingHeader) => {
        if (existingHeader.tagName.toLowerCase() === 'site-header') return;

        const sharedHeader = document.createElement('site-header');
        existingHeader.replaceWith(sharedHeader);
    });

    document.querySelectorAll('#site-header').forEach((locator) => {
        if (locator.tagName.toLowerCase() === 'site-header') return;

        const sharedHeader = document.createElement('site-header');
        locator.replaceWith(sharedHeader);
    });
}

/* ==================================================
   SHARED FOOTER
   ================================================== */

const FOOTER_I18N = {
    en: { company:'Company', about:'About', leadership:'Leadership', careers:'Careers', resources:'Resources', education:'Education', blog:'Blog', documentation:'Documentation', connect:'Connect', contact:'Contact', rights:'All rights reserved.' },
    fr: { company:'Société', about:'À propos', leadership:'Direction', careers:'Carrières', resources:'Ressources', education:'Formation', blog:'Blog', documentation:'Documentation', connect:'Nous suivre', contact:'Contact', rights:'Tous droits réservés.' },
    es: { company:'Empresa', about:'Nosotros', leadership:'Liderazgo', careers:'Empleo', resources:'Recursos', education:'Formación', blog:'Blog', documentation:'Documentación', connect:'Conectar', contact:'Contacto', rights:'Todos los derechos reservados.' },
    de: { company:'Unternehmen', about:'Über uns', leadership:'Führungsteam', careers:'Karriere', resources:'Ressourcen', education:'Wissen', blog:'Blog', documentation:'Dokumentation', connect:'Netzwerk', contact:'Kontakt', rights:'Alle Rechte vorbehalten.' },
    nl: { company:'Bedrijf', about:'Over ons', leadership:'Directie', careers:'Carrière', resources:'Bronmateriaal', education:'Kennis', blog:'Blog', documentation:'Documentatie', connect:'Volg ons', contact:'Contact', rights:'Alle rechten voorbehouden.' },
    it: { company:'Azienda', about:'Chi siamo', leadership:'Leadership', careers:'Lavora con noi', resources:'Risorse', education:'Formazione', blog:'Blog', documentation:'Documentazione', connect:'Contatti sociali', contact:'Contatti', rights:'Tutti i diritti riservati.' },
    ar: { company:'الشركة', about:'عن ETROYL', leadership:'القيادة', careers:'الوظائف', resources:'الموارد', education:'التعليم', blog:'المدونة', documentation:'التوثيق', connect:'تواصل معنا', contact:'اتصل بنا', rights:'جميع الحقوق محفوظة.' },
    zh: { company:'公司', about:'关于 ETROYL', leadership:'领导团队', careers:'职业机会', resources:'资源', education:'教育', blog:'博客', documentation:'技术文档', connect:'联系我们', contact:'联系', rights:'版权所有。' }
};

class SiteFooter extends HTMLElement {
    connectedCallback() {
        const lang = document.documentElement.getAttribute('lang') || 'en';
        const rootDir = lang === 'en' ? '/' : `/${lang}/`;
        const direction = document.documentElement.getAttribute('dir') || 'ltr';
        const t = FOOTER_I18N[lang] || FOOTER_I18N.en;

        this.setAttribute('dir', direction);

        this.innerHTML = `
            <div class="container footer-grid">
                <div class="footer-brand">
                    <img src="/assets/img/logo-mono.webp" alt="ETROYL" width="978" height="978" class="footer-logo">
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
                        <li><a href="mailto:${ETROYL_CONFIG.contact.email}">${t.contact}</a></li>
                        <li>
                            <a href="tel:${ETROYL_CONFIG.contact.mobile}" dir="ltr">
                                ${ETROYL_CONFIG.contact.mobile}
                            </a>
                        </li>
                        <li class="footer-social">
                            <a href="https://www.linkedin.com/in/etroyl-labs-8990bb425/" target="_blank" rel="noopener noreferrer" aria-label="ETROYL on LinkedIn" title="LinkedIn"><img src="/assets/img/social/linkedin.svg" alt=""></a>
                            <a href="https://www.youtube.com/@ETROYL-Labs" target="_blank" rel="noopener noreferrer" aria-label="ETROYL Labs on YouTube" title="YouTube"><img src="/assets/img/social/youtube.svg" alt=""></a>
                            <a href="https://github.com/ETROYL" target="_blank" rel="noopener noreferrer" aria-label="ETROYL on GitHub" title="GitHub"><img src="/assets/img/social/github.svg" alt=""></a>
                            <a href="https://x.com/ETROYL" target="_blank" rel="noopener noreferrer" aria-label="ETROYL on X" title="X"><img src="/assets/img/social/x.svg" alt=""></a>
                        </li>
                    </ul>
                </nav>
            </div>`;
    }
}

if (!customElements.get('site-footer')) {
    customElements.define('site-footer', SiteFooter);
}

/* ==================================================
   LANGUAGE SWITCHER
   ================================================== */

function initLanguageMemory() {
    const wrapper = document.querySelector('.lang-switcher');
    if (!wrapper) return;

    wrapper.querySelectorAll('.lang-switcher__menu a[href]').forEach((link) => {
        link.addEventListener('click', () => {
            try {
                const url = new URL(link.getAttribute('href'), window.location.href);
                saveLanguage(getCurrentLanguageFromPath(url.pathname));
            } catch {
                // Normal navigation remains intact.
            }
        });
    });
}

function initLangSwitcher() {
    const wrapper = document.querySelector('.lang-switcher');
    if (!wrapper) return;

    const toggle = wrapper.querySelector('.lang-switcher__toggle');
    const menu = wrapper.querySelector('.lang-switcher__menu');

    if (!toggle || !menu) return;

    const closeMenu = () => {
        menu.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
    };

    const openMenu = () => {
        menu.hidden = false;
        toggle.setAttribute('aria-expanded', 'true');
    };

    toggle.addEventListener('click', (event) => {
        event.stopPropagation();

        if (toggle.getAttribute('aria-expanded') === 'true') {
            closeMenu();
        } else {
            openMenu();
        }
    });

    document.addEventListener('click', (event) => {
        if (!wrapper.contains(event.target)) closeMenu();
    });

    wrapper.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
            toggle.focus();
        }
    });
}

/* ==================================================
   THEME
   ================================================== */

function setTheme(theme) {
    const normalized = theme === 'light' ? 'light' : 'dark';

    htmlElement.setAttribute('data-theme', normalized);
    localStorage.setItem('theme', normalized);
    setSiteCookie(THEME_COOKIE, normalized);
}

function getSavedTheme() {
    const cookieTheme = getSiteCookie(THEME_COOKIE);
    if (cookieTheme === 'light' || cookieTheme === 'dark') return cookieTheme;

    const localTheme = localStorage.getItem('theme');
    return localTheme === 'light' || localTheme === 'dark' ? localTheme : 'dark';
}

function initTheme() {
    setTheme(getSavedTheme());

    const toggleButton = document.getElementById('theme-toggle');
    if (!toggleButton) return;

    toggleButton.addEventListener('click', () => {
        const current = htmlElement.getAttribute('data-theme');
        setTheme(current === 'light' ? 'dark' : 'light');
    });
}

/* ==================================================
   ICONS & COMMON PAGE HELPERS
   ================================================== */

function renderIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function setCurrentYear() {
    document.querySelectorAll('#current-year').forEach((element) => {
        element.textContent = new Date().getFullYear();
    });
}

/* ==================================================
   CONTACT FORM
   ================================================== */

function initContactFormToggle() {
    const toggle = document.getElementById('contact-form-toggle');
    const form = document.getElementById('contact-form');

    if (!toggle || !form) return;

    toggle.addEventListener('click', () => {
        const isOpen = !form.hidden;

        form.hidden = isOpen;
        toggle.setAttribute('aria-expanded', String(!isOpen));
        toggle.classList.toggle('is-active', !isOpen);

        if (!isOpen) {
            form.querySelector('input, textarea, button')?.focus();
        }
    });
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const submitButton = form.querySelector('button[type="submit"]');
    const successMessage = form.querySelector('.form-success');
    const errorMessage = form.querySelector('.form-error-global');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const fields = [
            'contact-name',
            'contact-email',
            'contact-subject',
            'contact-message'
        ].map((id) => document.getElementById(id));

        let firstInvalidField = null;

        fields.forEach((field) => {
            if (!field) return;

            field.removeAttribute('aria-invalid');
            field.parentElement.querySelector('.form-error')?.remove();

            const emailValid =
                field.id !== 'contact-email' ||
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());

            if (!field.checkValidity() || !emailValid) {
                field.setAttribute('aria-invalid', 'true');

                const error = document.createElement('span');
                error.className = 'form-error';
                error.setAttribute('role', 'alert');
                error.textContent = field.dataset.validation || '';

                field.parentElement.appendChild(error);

                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            }
        });

        if (firstInvalidField) {
            firstInvalidField.focus();
            return;
        }

        if (successMessage) successMessage.hidden = true;
        if (errorMessage) errorMessage.hidden = true;

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = submitButton.dataset.status || '';
        }

        const formData = new FormData(form);
        formData.append('access_key', ETROYL_CONFIG.web3forms.accessKey);

        try {
            const response = await fetch(
                ETROYL_CONFIG.web3forms.endpoint,
                {
                    method: 'POST',
                    body: formData
                }
            );

            const result = await response.json();

            if (!result.success) {
                throw new Error('Web3Forms submission failed.');
            }

            form.reset();

            if (successMessage) {
                successMessage.hidden = false;
            }

            form.querySelectorAll('.form-error').forEach((error) => error.remove());
            fields.forEach((field) => field?.removeAttribute('aria-invalid'));
        } catch (error) {
            console.error('Contact form submission failed:', error);

            if (errorMessage) {
                errorMessage.hidden = false;
            }
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = submitButton.dataset.submit || '';
            }
        }
    });
}

/* ==================================================
   INITIALIZATION
   ================================================== */

function init() {
    const currentLanguage = getCurrentPageLanguage();
    const savedLanguage = getSavedLanguage() || currentLanguage || 'en';

    // The language selector is the only place that changes the saved preference.
    localizeInternalLinks(savedLanguage);

    // Replace legacy duplicated headers with the shared header component.
    renderSharedHeader();

    initLanguageMemory();
    initTheme();
    setCurrentYear();
    initLangSwitcher();
    renderIcons();
    initContactFormToggle();
    initContactForm();

    window.ETROYL_SITE = {
        getLanguage: getSavedLanguage,
        getCurrentPageLanguage: () => currentLanguage,
        getSavedLanguage,
        getTheme: getSavedTheme,
        setTheme,
        saveLanguage
    };
}

init();
