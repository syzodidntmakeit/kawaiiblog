const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ROOT_DIR = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT_DIR, 'posts');
const FALLBACK_CATEGORY = 'uncategorized';

const markdownLinkRegex = /\[(.*?)\]\(.*?\)/g;

function listPostFolders() {
    if (!fs.existsSync(POSTS_DIR)) {
        return [];
    }

    return fs.readdirSync(POSTS_DIR).filter(entry => {
        const fullPath = path.join(POSTS_DIR, entry);
        return fs.statSync(fullPath).isDirectory();
    });
}

function normalizeDate(dateValue, folderName) {
    if (dateValue) {
        const parsed = new Date(dateValue);
        if (!Number.isNaN(parsed)) {
            return parsed.toISOString();
        }
    }

    const folderDate = new Date(folderName);
    if (!Number.isNaN(folderDate)) {
        return folderDate.toISOString();
    }

    return new Date().toISOString();
}

function stripMarkdown(content) {
    return content
        .replace(/```[\s\S]*?```/g, '')
        .replace(markdownLinkRegex, '$1')
        .replace(/[*_~`>#\-]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function buildExcerpt(explicitExcerpt, content) {
    if (explicitExcerpt && explicitExcerpt.trim()) {
        return explicitExcerpt.trim();
    }

    return stripMarkdown(content).slice(0, 200).trim();
}

function loadPost(folderName) {
    const directory = path.join(POSTS_DIR, folderName);
    const markdownPath = path.join(directory, 'blog.md');

    if (!fs.existsSync(markdownPath)) {
        return null;
    }

    const raw = fs.readFileSync(markdownPath, 'utf8');
    const { data, content } = matter(raw);
    const normalizedDate = normalizeDate(data.date, folderName);

    return {
        folder: folderName,
        directory,
        markdownPath,
        content,
        meta: {
            id: data.id || folderName,
            title: data.title || 'Untitled',
            date: normalizedDate,
            category: (data.category || FALLBACK_CATEGORY).toLowerCase(),
            excerpt: buildExcerpt(data.excerpt, content),
        },
    };
}

module.exports = {
    ROOT_DIR,
    POSTS_DIR,
    listPostFolders,
    loadPost,
    normalizeDate,
    stripMarkdown,
};
