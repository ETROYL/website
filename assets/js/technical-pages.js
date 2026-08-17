/* ==================================================
   TECHNICAL-PAGES.JS — TECHNICAL PAGE BEHAVIOR ONLY
   Shared theme/language behavior lives in script.js.
   ================================================== */

(function () {
    'use strict';

    function initTechnicalLanguageNote() {
        const note = document.getElementById('language-note');
        if (!note) return;

        const currentPageLanguage = window.ETROYL_SITE?.getCurrentPageLanguage?.() || 'en';
        const savedLanguage = window.ETROYL_SITE?.getSavedLanguage?.() || 'en';

        // The notice is for visitors whose selected site language is
        // not English while viewing an English-only technical page.
        note.hidden = currentPageLanguage === 'en' && savedLanguage === 'en';
    }

    initTechnicalLanguageNote();
})();
