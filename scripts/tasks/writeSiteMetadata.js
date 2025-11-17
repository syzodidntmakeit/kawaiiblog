const fs = require('fs');
const path = require('path');
const { SITE_URL } = require('../../lib/config');

const ROOT_DIR = path.join(__dirname, '..', '..');

const STATIC_PAGES = [
    { path: '/', priority: 1 },
    { path: '/pages/archive.html', priority: 0.8 },
    { path: '/pages/search.html', priority: 0.8 },
    { path: '/pages/contact.html', priority: 0.6 },
    { path: '/pages/uses.html', priority: 0.6 },
];

function buildUrlEntry(loc, lastmod, priority) {
    return `
    <url>
        <loc>${loc}</loc>
        ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
        <priority>${priority.toFixed(1)}</priority>
    </url>`;
}

function buildSitemapXml(posts, options = {}) {
    const siteUrl = options.siteUrl || SITE_URL;
    const staticPages = options.staticPages || STATIC_PAGES;
    const now = new Date().toISOString();

    const staticEntries = staticPages
        .map(page => buildUrlEntry(`${siteUrl}${page.path === '/' ? '' : page.path}`, now, page.priority))
        .join('\n');

    const postEntries = posts
        .map(post => buildUrlEntry(`${siteUrl}/posts/${post.folder}/`, post.date, 0.7))
        .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${postEntries}
</urlset>`;
}

function writeSitemap(posts) {
    const sitemap = buildSitemapXml(posts);
    const destination = path.join(ROOT_DIR, 'sitemap.xml');
    fs.writeFileSync(destination, sitemap);
    console.log(`Wrote ${destination}`);
}

function buildRobotsTxt(siteUrl = SITE_URL) {
    return `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
}

function writeRobots(siteUrl = SITE_URL) {
    const robots = buildRobotsTxt(siteUrl);
    const destination = path.join(ROOT_DIR, 'robots.txt');
    fs.writeFileSync(destination, robots);
    console.log(`Wrote ${destination}`);
}

function writeSiteMetadata(posts) {
    writeSitemap(posts);
    writeRobots();
}

module.exports = {
    writeSiteMetadata,
    writeSitemap,
    writeRobots,
    buildUrlEntry,
    buildSitemapXml,
    buildRobotsTxt,
    STATIC_PAGES,
};
