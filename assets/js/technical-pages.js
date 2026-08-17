/* ==================================================
   TECHNICAL-PAGES.JS — TECHNICAL PAGE BEHAVIOR ONLY
   Shared theme/language behavior lives in script.js.
   ================================================== */

(function () {
    'use strict';

    function initTechnicalLanguageNote() {
        const note = document.getElementById('language-note');
        if (!note) return;

        const savedLanguage = window.ETROYL_SITE?.getSavedLanguage?.() || 'en';

        // Technical pages are English-only. Show the notice only when
        // the visitor has explicitly selected a non-English language.
        note.hidden = savedLanguage === 'en';
    }

    initTechnicalLanguageNote();
})();
