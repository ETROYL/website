/* ==================================================
   CONFIG.JS — SITE CONFIGURATION ONLY
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
        endpoint: "https://api.web3forms.com/submit",
        accessKey: "f6bd6c39-d3dd-4124-8ef7-c8afba732037"
    }
};

/* Selected Insights navigation — kept here because config.js is already
   loaded before script.js on every multilingual homepage. This gives
   the currently deployed generated homepages a safe forward path while
   the static template/build sources are regenerated. */
(function initSelectedInsightsLinks() {
    const routes = {
        item1_title: '/insights/fpga-video-pipelines/',
        item2_title: '/insights/near-field-gpr-modeling/',
        item3_title: '/insights/embedded-linux-real-time/'
    };

    function updateLinks() {
        const section = document.querySelector('.insights');
        if (!section) return;

        const items = section.querySelectorAll('.insight-item');
        if (items[0]) items[0].querySelector('h3 a')?.setAttribute('href', routes.item2_title);
        if (items[1]) items[1].querySelector('h3 a')?.setAttribute('href', routes.item1_title);
        if (items[2]) items[2].querySelector('h3 a')?.setAttribute('href', routes.item3_title);

        section.querySelector('.btn.btn-outline')?.setAttribute('href', '/insights/');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateLinks, { once: true });
    } else {
        updateLinks();
    }
})();