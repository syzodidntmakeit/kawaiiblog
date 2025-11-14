const fs = require('fs');
const path = require('path');
const { POSTS_DIR, listPostFolders, loadPost, stripMarkdown } = require('./lib/postUtils');

function buildSearchEntry(post) {
    return {
        id: post.meta.id,
        title: post.meta.title,
        url: `/posts/${post.folder}/`,
        date: post.meta.date,
        category: post.meta.category,
        excerpt: post.meta.excerpt,
        content: stripMarkdown(post.content),
    };
}

function generateSearchIndex() {
    const posts = listPostFolders()
        .map(loadPost)
        .filter(Boolean)
        .sort((a, b) => new Date(b.meta.date) - new Date(a.meta.date))
        .map(buildSearchEntry);

    const destination = path.join(POSTS_DIR, 'search-index.json');
    fs.writeFileSync(destination, JSON.stringify(posts, null, 2));
    console.log(`Wrote ${destination}`);
}

generateSearchIndex();
