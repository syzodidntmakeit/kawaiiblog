const fs = require('fs');
const path = require('path');
const { SITE_URL } = require('../../lib/config');

const ROOT_DIR = path.join(__dirname, '..', '..');

const STATIC_PAGES = [
    { path: '/', priority: 1 },
    { path: '/pages/archive.html', priority: 0.8 },
    { path: '/pages/search.html', priority: 0.8 },
    { path: '/pages/about.html', priority: 0.6 },
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

function writeSitemap(posts) {
    const staticEntries = STATIC_PAGES.map(page =>
        buildUrlEntry(`${SITE_URL}${page.path === '/' ? '' : page.path}`, new Date().toISOString(), page.priority)
    ).join('\n');

    const postEntries = posts
        .map(post => buildUrlEntry(`${SITE_URL}/posts/${post.folder}/`, post.date, 0.7))
        .join('\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${postEntries}
</urlset>`;

    const destination = path.join(ROOT_DIR, 'sitemap.xml');
    fs.writeFileSync(destination, sitemap);
    console.log(`Wrote ${destination}`);
}

function writeRobots() {
    const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
    const destination = path.join(ROOT_DIR, 'robots.txt');
    fs.writeFileSync(destination, robots);
    console.log(`Wrote ${destination}`);
}

function writeSiteMetadata(posts) {
    writeSitemap(posts);
    writeRobots();
}

module.exports = writeSiteMetadata;
