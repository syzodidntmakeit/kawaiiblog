const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const marked = require('marked');
const { z } = require('zod');
const { renderPartials } = require('./partials');

const POSTS_DIR = path.join(__dirname, '..', '..', 'posts');
const TEMPLATE_DIR = path.join(__dirname, '..', '..', 'templates');
const POST_TEMPLATE_PATH = path.join(TEMPLATE_DIR, 'post.html');
const WORDS_PER_MINUTE = 220;

const frontmatterSchema = z.object({
    id: z.string().min(1, 'id is required'),
    title: z.string().min(1, 'title is required'),
    date: z.string().min(1, 'date is required'),
    category: z.string().min(1, 'category is required'),
    excerpt: z.string().optional(),
});

function listPostFolders() {
    if (!fs.existsSync(POSTS_DIR)) {
        return [];
    }
    return fs.readdirSync(POSTS_DIR).filter(entry => {
        const fullPath = path.join(POSTS_DIR, entry);
        return fs.statSync(fullPath).isDirectory();
    });
}

function stripMarkdown(content) {
    return content
        .replace(/```[\s\S]*?```/g, '')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .replace(/[*_~`>#\-]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function calculateReadingMinutes(text) {
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

function normalizeDate(value, fallbackFolder) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed)) {
        return parsed.toISOString();
    }
    const folderDate = new Date(fallbackFolder);
    if (!Number.isNaN(folderDate)) {
        return folderDate.toISOString();
    }
    throw new Error(`Invalid date "${value}" and folder "${fallbackFolder}"`);
}

function loadTemplate() {
    const template = fs.readFileSync(POST_TEMPLATE_PATH, 'utf8');
    return renderPartials(template);
}

function decorateHeadings(html) {
    const accentClasses = [
        'text-kawaii-pink',
        'text-kawaii-blue',
        'text-kawaii-mint',
        'text-kawaii-lavender',
        'text-kawaii-coral',
        'text-kawaii-gold',
        'text-kawaii-sky',
        'text-kawaii-peach',
        'text-kawaii-lilac',
        'text-kawaii-cream',
    ];
    let index = 0;
    return html.replace(/<(h[23])([^>]*)>/g, (match, tag, attrs = '') => {
        const accent = accentClasses[index % accentClasses.length];
        index += 1;
        if (attrs.includes('class=')) {
            const updated = attrs.replace(/class="([^"]*)"/, (_, classes) => ` class="${classes} ${accent} font-semibold tracking-tight"`);
            return `<${tag}${updated}>`;
        }
        return `<${tag} class="${accent} font-semibold tracking-tight"${attrs}>`;
    });
}

function loadPosts() {
const folders = listPostFolders();

const posts = folders
    .map(folder => {
        const directory = path.join(POSTS_DIR, folder);
            const markdownPath = path.join(directory, 'blog.md');
            if (!fs.existsSync(markdownPath)) {
                return null;
            }

            const markdownStats = fs.statSync(markdownPath);
            const rawMarkdown = fs.readFileSync(markdownPath, 'utf8');
            const { data, content } = matter(rawMarkdown);
            const parsed = frontmatterSchema.safeParse(data);
            if (!parsed.success) {
                const firstError = parsed.error.errors[0];
                throw new Error(`Frontmatter error in ${markdownPath}: ${firstError.path.join('.')} ${firstError.message}`);
            }

            const plainText = stripMarkdown(content);
            const readingMinutes = calculateReadingMinutes(plainText);
            const excerpt = parsed.data.excerpt?.trim() || plainText.slice(0, 200).trim();
            const isoDate = normalizeDate(parsed.data.date, folder);
            const html = marked.parse(content);
            const decoratedHtml = decorateHeadings(html);

            const assets = fs
                .readdirSync(directory)
                .filter(file => {
                    if (['blog.md', 'index.html'].includes(file)) {
                        return false;
                    }
                    const full = path.join(directory, file);
                    return fs.statSync(full).isFile();
                });

            return {
                folder,
                directory,
                markdownPath,
                html: decoratedHtml,
                plainText,
                rawContent: content,
                frontmatter: parsed.data,
                excerpt,
                date: isoDate,
                category: parsed.data.category.toLowerCase(),
                readingMinutes,
                wordCount: plainText.split(/\s+/).filter(Boolean).length,
                assets,
                markdownMtime: Math.floor(markdownStats.mtimeMs),
            };
        })
        .filter(Boolean)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    return posts;
}

module.exports = {
    POSTS_DIR,
    loadPosts,
    stripMarkdown,
    loadTemplate,
};
