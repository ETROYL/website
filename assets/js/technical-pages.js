/* ==================================================
   TECHNICAL-PAGES.JS — TECHNICAL PAGE BEHAVIOR ONLY
   Shared theme/language behavior lives in script.js.
   ================================================== */

(function () {
    'use strict';

    function initTechnicalLanguageNote() {
        const note = document.getElementById('language-note');
        if (!note) return;

        const language = window.ETROYL_SITE?.getLanguage?.() || 'en';
        if (language === 'en') return;

        note.hidden = false;
    }

    initTechnicalLanguageNote();
})();
