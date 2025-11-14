const fs = require('fs');
const path = require('path');
const marked = require('marked');
const { ROOT_DIR, listPostFolders, loadPost } = require('./lib/postUtils');

const TEMPLATE_PATH = path.join(ROOT_DIR, 'templates', 'post.html');
const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
const SITE_URL = process.env.SITE_URL || 'http://localhost:3001';

function escapeHtml(value = '') {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date)) {
        return dateString;
    }
    return date.toISOString().split('T')[0];
}

function applyTemplate(replacements) {
    return Object.entries(replacements).reduce((acc, [token, value]) => {
        return acc.split(token).join(value);
    }, template);
}

function renderPost(folder) {
    const post = loadPost(folder);
    if (!post) {
        return;
    }

    const htmlContent = marked.parse(post.content);
    const postUrl = `/posts/${folder}/`;
    const replacements = {
        '{{POST_TITLE}}': escapeHtml(post.meta.title),
        '{{POST_EXCERPT}}': escapeHtml(post.meta.excerpt || ''),
        '{{POST_DATE}}': escapeHtml(formatDate(post.meta.date)),
        '{{POST_CATEGORY}}': escapeHtml(post.meta.category),
        '{{POST_CONTENT}}': htmlContent,
        '{{POST_URL}}': `${SITE_URL}${postUrl}`,
    };

    const rendered = applyTemplate(replacements);
    const destination = path.join(post.directory, 'index.html');
    fs.writeFileSync(destination, rendered);
    console.log(`Rendered ${post.meta.title} -> ${destination}`);
}

function renderAllPosts() {
    const folders = listPostFolders().sort();
    folders.forEach(renderPost);
}

renderAllPosts();
