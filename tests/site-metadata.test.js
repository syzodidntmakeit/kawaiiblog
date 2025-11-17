const test = require('node:test');
const assert = require('node:assert/strict');

const {
    buildUrlEntry,
    buildSitemapXml,
    buildRobotsTxt,
} = require('../scripts/tasks/writeSiteMetadata');

test('buildUrlEntry formats expected fields', () => {
    const entry = buildUrlEntry('https://example.com', '2025-01-01', 0.8);
    assert.match(entry, /<loc>https:\/\/example\.com<\/loc>/);
    assert.match(entry, /<lastmod>2025-01-01<\/lastmod>/);
    assert.match(entry, /<priority>0\.8<\/priority>/);
});

test('buildSitemapXml includes static and post urls', () => {
    const xml = buildSitemapXml(
        [
            { folder: '2025-10-31', date: '2025-10-31T00:00:00.000Z' },
            { folder: '2025-10-19', date: '2025-10-19T00:00:00.000Z' },
        ],
        {
            siteUrl: 'https://kawaii-san.org',
            staticPages: [{ path: '/', priority: 1 }],
        }
    );

    assert.match(xml, /https:\/\/kawaii-san\.org\/posts\/2025-10-31\//);
    assert.match(xml, /https:\/\/kawaii-san\.org\/posts\/2025-10-19\//);
    assert.match(xml, /https:\/\/kawaii-san\.org<\/loc>/);
});

test('buildRobotsTxt points to generated sitemap', () => {
    const robots = buildRobotsTxt('https://kawaii-san.org');
    assert.match(robots, /Sitemap: https:\/\/kawaii-san\.org\/sitemap\.xml/);
});
