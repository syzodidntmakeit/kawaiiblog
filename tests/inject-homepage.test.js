const test = require('node:test');
const assert = require('node:assert/strict');

const injectHomepageData = require('../scripts/tasks/injectHomepageData');

const {
    renderPostCard,
    formatDate,
    escapeHtml,
    renderFilterButtons,
    humanizeCategory,
} = injectHomepageData;

function stripWhitespace(value) {
    return value.replace(/\s+/g, ' ').trim();
}

test('renderPostCard escapes text and formats date', () => {
    const post = {
        url: '/posts/2025-10-31/',
        title: 'Hello <World>',
        excerpt: 'Dangerous <b>HTML</b>',
        date: '2025-10-31T00:00:00.000Z',
        readingMinutes: 4,
    };

    const card = stripWhitespace(renderPostCard(post));
    assert.match(card, /Hello &lt;World&gt;/);
    assert.match(card, /Dangerous &lt;b&gt;HTML&lt;\/b&gt;/);
    assert.match(card, /4 min read/);
});

test('formatDate falls back gracefully', () => {
    const formatted = formatDate('not-a-date');
    assert.equal(formatted, 'not-a-date');
});

test('escapeHtml handles quotes', () => {
    const escaped = escapeHtml('"hello" & <<>>');
    assert.equal(escaped, '&quot;hello&quot; &amp; &lt;&lt;&gt;&gt;');
});

test('renderFilterButtons derives unique categories and keeps All active', () => {
    const html = renderFilterButtons([
        { category: 'commentary' },
        { category: 'music' },
        { category: 'commentary' },
    ]);

    assert.match(html, /data-category="all"[\s\S]*?active/);
    const commentaryMatches = html.match(/data-category="commentary"/g) || [];
    assert.equal(commentaryMatches.length, 1);
    assert.match(html, />Music</);
});

test('humanizeCategory formats dashed names', () => {
    assert.equal(humanizeCategory('self-hosting'), 'Self Hosting');
    assert.equal(humanizeCategory('games'), 'Games');
});
