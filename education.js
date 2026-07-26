/* ==================================================
   EDUCATION.JS — RESOURCE LIBRARY
   ==================================================
   PURPOSE: Renders the Education page's video/image/document
   library from a plain JavaScript array — no backend, no
   database, no build step. This is the "manifest-driven content"
   pattern: content lives as data, and one render function turns
   that data into markup, instead of hand-writing repetitive HTML
   for every single resource.

   ============================================================
   HOW TO ADD NEW CONTENT (this is the actual "upload" workflow
   for this phase of the site):

     1. Put the real file in the matching folder:
          videos    -> /assets/education/videos/
          images    -> /assets/education/images/
          documents -> /assets/education/documents/

     2. Add one object to the `educationManifest` array below,
        following the shape of the examples (commented out).

     3. Save. Refresh the page. Done — no server restart, no
        database migration, no deploy step beyond publishing
        the updated files.

   WHY THIS INSTEAD OF A LIVE "CHOOSE FILE" UPLOAD BUTTON:
   This site has no backend server or database (by design — see
   the zero-dependency philosophy in the README). A browser-only
   upload button has nowhere to actually send files: nothing
   would persist past a page refresh, and no other visitor would
   ever see what was "uploaded." Building that button would look
   functional while silently doing nothing — worse than not
   having it. A real multi-user upload feature is a legitimate
   Phase 3+ addition once a backend exists; this manifest system
   is intentionally structured so migrating to that later means
   swapping WHERE this array's data comes from (a database query
   instead of a hardcoded array), not rewriting the render logic.
   ============================================================ */

'use strict';

/**
 * @typedef {Object} EducationResource
 * @property {'video'|'image'|'document'} type
 * @property {string} title
 * @property {string} description
 * @property {string} src - Path to the actual file.
 * @property {string} [poster] - Optional poster image, video only.
 * @property {string} [fileLabel] - Short badge text, document only (e.g. "PDF").
 */

/** @type {EducationResource[]} */
const educationManifest = [
    // Example entries — delete these once real content is added.
    // Uncomment and adapt the shape below for each new resource:
    //
    // {
    //     type: 'video',
    //     title: 'Intro to FPGA Pipeline Design',
    //     description: 'A walkthrough of a basic HDL pipeline stage.',
    //     src: '/assets/education/videos/fpga-pipeline-intro.mp4',
    //     poster: '/assets/education/images/fpga-pipeline-poster.jpg'
    // },
    // {
    //     type: 'image',
    //     title: 'VCU Encoder Block Diagram',
    //     description: 'Signal path for the six-camera video pipeline.',
    //     src: '/assets/education/images/vcu-block-diagram.png'
    // },
    // {
    //     type: 'document',
    //     title: 'GStreamer Pipeline Reference',
    //     description: 'PDF reference for common pipeline elements.',
    //     src: '/assets/education/documents/gstreamer-reference.pdf',
    //     fileLabel: 'PDF'
    // },
];

/**
 * Builds a single resource card as a real DOM node.
 * WHY BUILD NODES INSTEAD OF STRING-CONCATENATING HTML:
 * Using document.createElement + textContent (rather than
 * innerHTML with template strings) means a resource title
 * containing something like "<script>" is inserted as literal
 * text, never parsed as markup. This matters the moment
 * manifest content stops being hand-written by you and starts
 * coming from any less-trusted source down the line.
 * @param {EducationResource} item
 * @returns {HTMLElement}
 */
function createResourceCard(item) {
    const card = document.createElement('article');
    card.className = 'resource-card';
    card.dataset.type = item.type;
    card.setAttribute('role', 'listitem');

    const media = document.createElement('div');
    media.className = 'resource-card__media';

    if (item.type === 'video') {
        const video = document.createElement('video');
        video.controls = true;
        video.preload = 'metadata'; // Loads only enough to show
                                     // duration/dimensions, not the
                                     // whole file, until the user
                                     // actually presses play.
        if (item.poster) video.poster = item.poster;
        const source = document.createElement('source');
        source.src = item.src;
        video.appendChild(source);
        media.appendChild(video);
    } else if (item.type === 'image') {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.title;
        img.loading = 'lazy'; // Off-screen cards don't download
                                // their image until the user
                                // scrolls near them.
        media.appendChild(img);
    } else if (item.type === 'document') {
        const badge = document.createElement('span');
        badge.className = 'resource-card__doc-badge';
        badge.textContent = item.fileLabel || 'DOC';
        media.appendChild(badge);
    }

    const body = document.createElement('div');
    body.className = 'resource-card__body';

    const title = document.createElement('h3');
    title.className = 'resource-card__title';
    title.textContent = item.title;

    const description = document.createElement('p');
    description.className = 'resource-card__description';
    description.textContent = item.description;

    const link = document.createElement('a');
    link.className = 'resource-card__link';
    link.href = item.src;
    link.textContent = item.type === 'document' ? 'View document' : 'Open full size';
    link.target = '_blank';
    link.rel = 'noopener'; // Prevents the newly opened tab from
                            // getting a JS reference back to this
                            // page (window.opener) — a standard
                            // security hardening step for any
                            // target="_blank" link.

    body.append(title, description, link);
    card.append(media, body);

    return card;
}

/**
 * Renders the grid, optionally filtered by resource type.
 * @param {'all'|'video'|'image'|'document'} filter
 */
function renderGrid(filter) {
    const grid = document.getElementById('education-grid');
    const emptyState = document.getElementById('education-empty');
    if (!grid || !emptyState) return;

    grid.innerHTML = ''; // Clear before re-render — simplest
                          // correct approach at this data size;
                          // a diffing strategy would only be
                          // worth the complexity at a much
                          // larger, frequently-updating library.

    const items = filter === 'all'
        ? educationManifest
        : educationManifest.filter((item) => item.type === filter);

    items.forEach((item) => grid.appendChild(createResourceCard(item)));

    const isEmpty = items.length === 0;
    emptyState.hidden = !isEmpty;
    grid.hidden = isEmpty;
}

/**
 * Wires up the filter button group. Uses event delegation (one
 * listener on the shared parent, rather than one per button) —
 * fewer listeners to manage, and it automatically covers any
 * filter buttons added later without extra wiring.
 */
function initFilters() {
    const filterBar = document.querySelector('.filter-bar');
    if (!filterBar) return;

    const buttons = Array.from(filterBar.querySelectorAll('.filter-btn'));

    filterBar.addEventListener('click', (event) => {
        const button = event.target.closest('.filter-btn');
        if (!button) return;

        buttons.forEach((btn) => btn.setAttribute('aria-pressed', 'false'));
        button.setAttribute('aria-pressed', 'true');

        renderGrid(button.dataset.filter);
    });

    // Establish initial pressed state to match the "All" button
    // that is marked is-active in the HTML — kept in sync here
    // via aria-pressed as the single source of truth (see the
    // note in education.css about why aria-pressed, not a class,
    // drives the active look).
    buttons.forEach((btn) => {
        btn.setAttribute('aria-pressed', String(btn.classList.contains('is-active')));
    });
}

function init() {
    renderGrid('all');
    initFilters();
}

init();
