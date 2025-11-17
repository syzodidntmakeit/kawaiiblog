const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const ROOT_DIR = path.join(__dirname, '..', '..');
const CACHE_PATH = path.join(ROOT_DIR, '.image-optimization-cache.json');

async function optimizeFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const image = sharp(filePath).rotate();
    if (ext === '.png') {
        image.png({ compressionLevel: 8, quality: 80 });
    } else if (ext === '.webp') {
        image.webp({ quality: 80 });
    } else {
        image.jpeg({ quality: 80 });
    }
    const buffer = await image.toBuffer();
    fs.writeFileSync(filePath, buffer);
    console.log(`Optimized ${filePath}`);
}

function loadCache() {
    if (!fs.existsSync(CACHE_PATH)) {
        return {};
    }
    try {
        return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
    } catch (error) {
        console.warn('Unable to read image optimization cache; starting fresh.', error.message);
        return {};
    }
}

function saveCache(cache) {
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

async function processFile(filePath, cache) {
    const relativePath = path.relative(ROOT_DIR, filePath);
    const stats = fs.statSync(filePath);
    const cachedMtime = cache[relativePath];
    if (cachedMtime && Math.floor(cachedMtime) === Math.floor(stats.mtimeMs)) {
        return;
    }

    await optimizeFile(filePath);
    const updatedStats = fs.statSync(filePath);
    cache[relativePath] = updatedStats.mtimeMs;
}

async function optimizeImages(posts) {
    const cache = loadCache();
    const files = posts.flatMap(post =>
        post.assets
            .filter(asset => IMAGE_EXTENSIONS.has(path.extname(asset).toLowerCase()))
            .map(asset => path.join(post.directory, asset))
    );

    await Promise.all(files.map(file => processFile(file, cache)));
    saveCache(cache);
}

module.exports = optimizeImages;
