const fs = require('fs');
const path = require('path');
const { buildPostSummaries } = require('./writePostsJson');
const { renderPartials } = require('../utils/partials');

const INDEX_TEMPLATE_PATH = path.join(__dirname, '..', '..', 'src', 'pages', 'index.html');
const OUTPUT_INDEX_PATH = path.join(__dirname, '..', '..', 'index.html');
const POSTS_PLACEHOLDER = '{{PRE_RENDERED_POSTS}}';
const DATA_PLACEHOLDER = '{{PRELOADED_POSTS}}';
const FILTER_PLACEHOLDER = '{{FILTER_BUTTONS}}';

function escapeHtml(value = '') {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function renderPostCard(post) {
    const excerpt = post.excerpt
        ? `\n            <p class="text-gray-400 mt-2">${escapeHtml(post.excerpt)}</p>`
        : '';

    return `
        <div>
            <a href="${post.url}" class="block p-6 bg-gray-800/50 rounded-lg border border-kawaii-pink hover:bg-gray-700/50 transition-colors">
                <h3 class="text-2xl font-bold text-kawaii-pink">${escapeHtml(post.title)}</h3>
                <p class="text-gray-400 mt-2">${formatDate(post.date)} • ${post.readingMinutes || 1} min read</p>${excerpt}
            </a>
        </div>
    `.trim();
}

function humanizeCategory(value = '') {
    return value
        .split(/[-_\s]+/)
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

function renderFilterButtons(posts) {
    const categories = [];
    posts.forEach(post => {
        const category = (post.category || '').trim();
        if (!category) {
            return;
        }
        if (!categories.includes(category)) {
            categories.push(category);
        }
    });

    const baseClass = 'filter-button px-4 py-2 border border-kawaii-pink rounded-lg transition-colors hover:bg-kawaii-pink hover:text-custom-dark active:bg-kawaii-pink active:text-custom-dark';
    const inactiveClass = `${baseClass} text-kawaii-pink bg-transparent`;
    const activeClass = `${baseClass} text-custom-dark bg-kawaii-pink`;

    const filters = [
        `<button data-category="all" class="${activeClass} active">All Posts</button>`,
        ...categories.map(category => {
            const label = humanizeCategory(category);
            return `<button data-category="${escapeHtml(category)}" class="${inactiveClass}">${escapeHtml(label)}</button>`;
        }),
    ];

    return filters.join('\n                ');
}

function injectHomepageData(posts) {
    if (!fs.existsSync(INDEX_TEMPLATE_PATH)) {
        console.warn('Homepage template missing; skipping prerender injection.');
        return;
    }

    const summaries = buildPostSummaries(posts);
    let html = renderPartials(fs.readFileSync(INDEX_TEMPLATE_PATH, 'utf8'));

    if (!html.includes(POSTS_PLACEHOLDER) || !html.includes(DATA_PLACEHOLDER)) {
        console.warn('Homepage placeholders missing in template; skipping prerender injection.');
        return;
    }

    const cardsMarkup = summaries.map(renderPostCard).join('\n');
    const fallback = '<p class="text-gray-400">No posts in this category yet.</p>';
    const renderedContent = cardsMarkup || fallback;
    const inlineJson = JSON.stringify(summaries).replace(/</g, '\\u003C');
    if (html.includes(FILTER_PLACEHOLDER)) {
        const filtersMarkup = renderFilterButtons(summaries);
        html = html.replace(FILTER_PLACEHOLDER, filtersMarkup);
    }

    html = html.replace(POSTS_PLACEHOLDER, renderedContent);
    html = html.replace(DATA_PLACEHOLDER, inlineJson);
    fs.writeFileSync(OUTPUT_INDEX_PATH, html);
    console.log('Injected homepage prerendered posts and inline JSON.');
}

module.exports = injectHomepageData;
module.exports.renderPostCard = renderPostCard;
module.exports.escapeHtml = escapeHtml;
module.exports.formatDate = formatDate;
module.exports.renderFilterButtons = renderFilterButtons;
module.exports.humanizeCategory = humanizeCategory;
