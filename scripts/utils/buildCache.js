const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..', '..');
const CACHE_PATH = process.env.BUILD_CACHE_PATH
    ? path.resolve(process.env.BUILD_CACHE_PATH)
    : path.join(ROOT_DIR, '.build-cache.json');

function createDefaultCache() {
    return { posts: {} };
}

function loadBuildCache() {
    if (!fs.existsSync(CACHE_PATH)) {
        return createDefaultCache();
    }

    try {
        const contents = fs.readFileSync(CACHE_PATH, 'utf8');
        const parsed = JSON.parse(contents);
        if (parsed && typeof parsed === 'object' && parsed.posts) {
            return parsed;
        }
    } catch (error) {
        console.warn('Unable to parse build cache; starting fresh.', error.message);
    }

    return createDefaultCache();
}

function saveBuildCache(cache) {
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

module.exports = {
    loadBuildCache,
    saveBuildCache,
    createDefaultCache,
    CACHE_PATH,
};
