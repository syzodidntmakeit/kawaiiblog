const fs = require('fs');
const path = require('path');
const { buildPostSummaries } = require('./writePostsJson');

const INDEX_PATH = path.join(__dirname, '..', '..', 'index.html');
const POSTS_PLACEHOLDER = '{{PRE_RENDERED_POSTS}}';
const DATA_PLACEHOLDER = '{{PRELOADED_POSTS}}';

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

function injectHomepageData(posts) {
    if (!fs.existsSync(INDEX_PATH)) {
        return;
    }

    const summaries = buildPostSummaries(posts);
    let html = fs.readFileSync(INDEX_PATH, 'utf8');

    if (!html.includes(POSTS_PLACEHOLDER) || !html.includes(DATA_PLACEHOLDER)) {
        console.warn('Homepage placeholders missing; skipping prerender injection.');
        return;
    }

    const cardsMarkup = summaries.map(renderPostCard).join('\n');
    const fallback = '<p class="text-gray-400">No posts in this category yet.</p>';
    const renderedContent = cardsMarkup || fallback;
    const inlineJson = JSON.stringify(summaries).replace(/</g, '\\u003C');

    html = html.replace(POSTS_PLACEHOLDER, renderedContent);
    html = html.replace(DATA_PLACEHOLDER, inlineJson);
    fs.writeFileSync(INDEX_PATH, html);
    console.log('Injected homepage prerendered posts and inline JSON.');
}

module.exports = injectHomepageData;
