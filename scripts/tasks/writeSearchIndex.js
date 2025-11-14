const fs = require('fs');
const path = require('path');
const { POSTS_DIR } = require('../utils/posts');

function writeSearchIndex(posts) {
    const index = posts.map(post => ({
        id: post.frontmatter.id,
        title: post.frontmatter.title,
        url: `/posts/${post.folder}/`,
        date: post.date,
        category: post.category,
        excerpt: post.excerpt,
        content: post.plainText,
    }));

    const destination = path.join(POSTS_DIR, 'search-index.json');
    fs.writeFileSync(destination, JSON.stringify(index, null, 2));
    console.log(`Wrote ${destination}`);
}

module.exports = writeSearchIndex;
