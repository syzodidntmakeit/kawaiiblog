const fs = require('fs');
const path = require('path');
const { loadTemplate } = require('../utils/posts');
const { SITE_URL } = require('../../lib/config');

const POST_HTML = loadTemplate();

function escapeHtml(value = '') {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderPosts(posts) {
    posts.forEach(post => {
        const postUrl = `/posts/${post.folder}/`;
        const replacements = {
            '{{POST_TITLE}}': escapeHtml(post.frontmatter.title),
            '{{POST_EXCERPT}}': escapeHtml(post.excerpt),
            '{{POST_DATE}}': escapeHtml(post.date.split('T')[0]),
            '{{POST_CATEGORY}}': escapeHtml(post.category),
            '{{POST_CONTENT}}': post.html,
            '{{POST_URL}}': `${SITE_URL}${postUrl}`,
            '{{POST_READING_TIME}}': `${post.readingMinutes} min read`,
        };

        const rendered = Object.entries(replacements).reduce((acc, [token, value]) => {
            return acc.split(token).join(value);
        }, POST_HTML);

        const destination = path.join(post.directory, 'index.html');
        fs.writeFileSync(destination, rendered);
        console.log(`Rendered ${post.frontmatter.title} -> ${destination}`);
    });
}

module.exports = renderPosts;
