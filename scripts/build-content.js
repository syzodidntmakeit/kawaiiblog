const { loadPosts } = require('./utils/posts');
const optimizeImages = require('./tasks/optimizeImages');
const renderPosts = require('./tasks/renderPosts');
const { writePostsJson } = require('./tasks/writePostsJson');
const writeSearchIndex = require('./tasks/writeSearchIndex');
const writeRss = require('./tasks/writeRss');
const writeSiteMetadata = require('./tasks/writeSiteMetadata');
const injectHomepageData = require('./tasks/injectHomepageData');

async function buildContent() {
    const posts = loadPosts();
    await optimizeImages(posts);
    renderPosts(posts);
    writePostsJson(posts);
    injectHomepageData(posts);
    writeSearchIndex(posts);
    writeRss(posts);
    writeSiteMetadata(posts);
}

buildContent().catch(error => {
    console.error(error);
    process.exit(1);
});
