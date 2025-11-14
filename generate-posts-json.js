const fs = require('fs');
const path = require('path');
const { POSTS_DIR, listPostFolders, loadPost } = require('./lib/postUtils');

function toPostSummary(post) {
    return {
        id: post.meta.id,
        title: post.meta.title,
        url: `/posts/${post.folder}/`,
        date: post.meta.date,
        category: post.meta.category,
        excerpt: post.meta.excerpt,
    };
}

function generatePostsJson() {
    const posts = listPostFolders()
        .map(loadPost)
        .filter(Boolean)
        .sort((a, b) => new Date(b.meta.date) - new Date(a.meta.date))
        .map(toPostSummary);

    const destination = path.join(POSTS_DIR, 'all-posts.json');
    fs.writeFileSync(destination, JSON.stringify(posts, null, 2));
    console.log(`Wrote ${destination}`);
}

generatePostsJson();
