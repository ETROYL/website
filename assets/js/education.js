/* ==================================================
   EDUCATION.JS — ETROYL ACADEMY RESOURCE LIBRARY
   ==================================================
   PURPOSE: Renders the Academy resource library from a plain
   JavaScript manifest — no backend, no database, no build step.

   Each resource belongs to one primary engineering topic and
   also carries a resource type. Topic drives browsing; type is
   displayed as metadata on the resource card.

   HOW TO ADD NEW CONTENT:

     1. Add the resource file to the repository.
     2. Add one object to the educationManifest array.
     3. Choose one primary topic from the supported values below.
     4. Refresh the page after deployment.

   Supported topics:
     - fpga
     - embedded
     - signal-processing
     - radar-gpr
     - electromagnetics
     - methodology
   ================================================== */

'use strict';

/**
 * @typedef {Object} AcademyResource
 * @property {'video'|'image'|'document'} type
 * @property {'fpga'|'embedded'|'signal-processing'|'radar-gpr'|'electromagnetics'|'methodology'} topic
 * @property {string} title
 * @property {string} description
 * @property {string} src
 * @property {string} [poster]
 * @property {string} [fileLabel]
 */

const topicLabels = {
    fpga: 'FPGA & Digital Design',
    embedded: 'Embedded Systems',
    'signal-processing': 'Signal Processing',
    'radar-gpr': 'Radar & GPR',
    electromagnetics: 'Electromagnetic Modeling',
    methodology: 'Engineering Methodology',
};

const typeLabels = {
    video: 'Video',
    image: 'Image',
    document: 'Document',
};

/** @type {AcademyResource[]} */
const educationManifest = [
    // Example entry — uncomment and adapt when real content is added.
    // {
    //     type: 'video',
    //     topic: 'fpga',
    //     title: 'Intro to FPGA Pipeline Design',
    //     description: 'A walkthrough of a basic HDL pipeline stage.',
    //     src: 'fpga-pipeline-intro.mp4',
    //     poster: 'fpga-pipeline-poster.jpg'
    // },
];

function createMetadata(item) {
    const metadata = document.createElement('p');
    metadata.className = 'resource-card__metadata';

    const type = document.createElement('span');
    type.className = 'resource-card__tag';
    type.textContent = typeLabels[item.type] || item.type;

    const separator = document.createElement('span');
    separator.className = 'resource-card__separator';
    separator.textContent = '·';
    separator.setAttribute('aria-hidden', 'true');

    const topic = document.createElement('span');
    topic.className = 'resource-card__tag';
    topic.textContent = topicLabels[item.topic] || item.topic;

    metadata.append(type, separator, topic);
    return metadata;
}

function createResourceCard(item) {
    const card = document.createElement('article');
    card.className = 'resource-card';
    card.dataset.type = item.type;
    card.dataset.topic = item.topic;
    card.setAttribute('role', 'listitem');

    const media = document.createElement('div');
    media.className = 'resource-card__media';

    if (item.type === 'video') {
        const video = document.createElement('video');
        video.controls = true;
        video.preload = 'metadata';

        if (item.poster) video.poster = item.poster;

        const source = document.createElement('source');
        source.src = item.src;
        video.appendChild(source);
        media.appendChild(video);
    } else if (item.type === 'image') {
        const image = document.createElement('img');
        image.src = item.src;
        image.alt = item.title;
        image.loading = 'lazy';
        media.appendChild(image);
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
    link.rel = 'noopener';

    body.append(createMetadata(item), title, description, link);
    card.append(media, body);

    return card;
}

function renderGrid(filter) {
    const grid = document.getElementById('education-grid');
    const emptyState = document.getElementById('education-empty');

    if (!grid || !emptyState) return;

    grid.innerHTML = '';

    const items = filter === 'all'
        ? educationManifest
        : educationManifest.filter((item) => item.topic === filter);

    items.forEach((item) => grid.appendChild(createResourceCard(item)));

    const isEmpty = items.length === 0;
    emptyState.hidden = !isEmpty;
    grid.hidden = isEmpty;
}

function initFilters() {
    const filterBar = document.querySelector('.filter-bar');
    if (!filterBar) return;

    const buttons = Array.from(filterBar.querySelectorAll('.filter-btn'));

    filterBar.addEventListener('click', (event) => {
        const button = event.target.closest('.filter-btn');
        if (!button) return;

        buttons.forEach((btn) => {
            btn.classList.remove('is-active');
            btn.setAttribute('aria-pressed', 'false');
        });

        button.classList.add('is-active');
        button.setAttribute('aria-pressed', 'true');

        renderGrid(button.dataset.filter);
    });

    buttons.forEach((button) => {
        button.setAttribute(
            'aria-pressed',
            String(button.classList.contains('is-active'))
        );
    });
}

function init() {
    renderGrid('all');
    initFilters();
}

init();
