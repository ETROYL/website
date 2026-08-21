/* ==================================================
   INSIGHTS.JS — CLIENT-SIDE INSIGHT FILTERING
   ==================================================
   Zero-dependency category filtering for Selected Insights.
   ================================================== */

'use strict';

function initInsightFilters() {
    const filterBar = document.querySelector('[data-insight-filters]');
    const insightList = document.querySelector('[data-insight-list]');

    if (!filterBar || !insightList) return;

    const buttons = Array.from(
        filterBar.querySelectorAll('[data-insight-filter]')
    );
    const insights = Array.from(
        insightList.querySelectorAll('[data-insight-categories]')
    );

    function applyFilter(category) {
        insights.forEach((insight) => {
            const categories = insight.dataset.insightCategories
                .split(' ')
                .filter(Boolean);

            const matches = category === 'all' || categories.includes(category);
            insight.hidden = !matches;
        });

        buttons.forEach((button) => {
            const active = button.dataset.insightFilter === category;
            button.classList.toggle('is-active', active);
            button.setAttribute('aria-pressed', String(active));
        });
    }

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            applyFilter(button.dataset.insightFilter);
        });
    });

    applyFilter('all');
}

document.addEventListener('DOMContentLoaded', initInsightFilters);
