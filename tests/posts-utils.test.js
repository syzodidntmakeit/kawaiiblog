const test = require('node:test');
const assert = require('node:assert/strict');

const { loadPosts } = require('../scripts/utils/posts');

test('loadPosts returns posts sorted by descending date', () => {
    const posts = loadPosts();
    assert.ok(posts.length > 0, 'expected at least one post');

    for (let index = 1; index < posts.length; index += 1) {
        const prev = new Date(posts[index - 1].date);
        const curr = new Date(posts[index].date);
        assert.ok(prev.getTime() >= curr.getTime(), 'posts should be sorted newest first');
    }
});

test('loadPosts normalizes categories and exposes markdown mtime', () => {
    const posts = loadPosts();
    posts.forEach(post => {
        assert.strictEqual(
            post.category,
            post.category.toLowerCase(),
            `Expected category "${post.category}" to be lowercase`
        );
        assert.strictEqual(typeof post.markdownMtime, 'number', 'markdownMtime should be recorded');
    });
});
