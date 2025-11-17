const fs = require('fs');
const path = require('path');
const { loadTemplate } = require('../utils/posts');
const { loadBuildCache, saveBuildCache } = require('../utils/buildCache');
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
    const cache = loadBuildCache();
    const nextCache = { posts: {} };

    posts.forEach(post => {
        const postUrl = `/posts/${post.folder}/`;
        const cached = cache.posts?.[post.folder];
        const destination = path.join(post.directory, 'index.html');
        const outputExists = fs.existsSync(destination);
        const needsRender = !cached || cached.markdownMtime !== post.markdownMtime || !outputExists;

        if (!needsRender) {
            nextCache.posts[post.folder] = cached;
            return;
        }

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

        fs.writeFileSync(destination, rendered);
        nextCache.posts[post.folder] = { markdownMtime: post.markdownMtime };
        console.log(`Rendered ${post.frontmatter.title} -> ${destination}`);
    });

    saveBuildCache(nextCache);
}

module.exports = renderPosts;
