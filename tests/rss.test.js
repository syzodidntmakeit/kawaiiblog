const test = require('node:test');
const assert = require('node:assert/strict');

const { buildRssXml } = require('../scripts/tasks/writeRss');

test('buildRssXml serializes posts into RSS items', () => {
    const rss = buildRssXml([
        {
            folder: '2025-10-31',
            date: '2025-10-31T00:00:00.000Z',
            category: 'tech',
            html: '<p>Hello world</p>',
            frontmatter: { title: 'Hello' },
        },
    ], 'https://kawaii-san.org');

    assert.match(rss, /<title><!\[CDATA\[Hello\]\]><\/title>/);
    assert.match(rss, /https:\/\/kawaii-san\.org\/posts\/2025-10-31\//);
    assert.match(rss, /<description><!\[CDATA\[/);
});
