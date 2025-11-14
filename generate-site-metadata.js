const fs = require('fs');
const path = require('path');
const { ROOT_DIR, listPostFolders, loadPost } = require('./lib/postUtils');
const { SITE_URL } = require('./lib/config');

const STATIC_PAGES = [
    { path: '/', priority: 1.0 },
    { path: '/pages/archive.html', priority: 0.8 },
    { path: '/pages/about.html', priority: 0.6 },
    { path: '/pages/contact.html', priority: 0.6 },
    { path: '/pages/uses.html', priority: 0.6 },
    { path: '/pages/search.html', priority: 0.7 },
];

function buildUrlEntry(loc, lastMod, priority = 0.5) {
    return `
    <url>
        <loc>${loc}</loc>
        ${lastMod ? `<lastmod>${lastMod}</lastmod>` : ''}
        <priority>${priority}</priority>
    </url>`;
}

function generateSitemap() {
    const postEntries = listPostFolders()
        .map(loadPost)
        .filter(Boolean)
        .map(post =>
            buildUrlEntry(
                `${SITE_URL}/posts/${post.folder}/`,
                new Date(post.meta.date).toISOString(),
                0.7
            )
        )
        .join('\n');

    const staticEntries = STATIC_PAGES.map(page =>
        buildUrlEntry(`${SITE_URL}${page.path === '/' ? '' : page.path}`, new Date().toISOString(), page.priority)
    ).join('\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${postEntries}
</urlset>`;

    const target = path.join(ROOT_DIR, 'sitemap.xml');
    fs.writeFileSync(target, sitemap);
    console.log(`Wrote ${target}`);
}

function generateRobots() {
    const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
    const target = path.join(ROOT_DIR, 'robots.txt');
    fs.writeFileSync(target, robots);
    console.log(`Wrote ${target}`);
}

generateSitemap();
generateRobots();
