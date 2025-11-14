const fs = require('fs');
const path = require('path');
const { POSTS_DIR } = require('../utils/posts');

function writePostsJson(posts) {
    const summaries = posts.map(post => ({
        id: post.frontmatter.id,
        title: post.frontmatter.title,
        url: `/posts/${post.folder}/`,
        date: post.date,
        category: post.category,
        excerpt: post.excerpt,
        readingMinutes: post.readingMinutes,
    }));

    const destination = path.join(POSTS_DIR, 'all-posts.json');
    fs.writeFileSync(destination, JSON.stringify(summaries, null, 2));
    console.log(`Wrote ${destination}`);
}

module.exports = writePostsJson;
