const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

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

async function optimizeImages(posts) {
    const files = posts.flatMap(post =>
        post.assets
            .filter(asset => IMAGE_EXTENSIONS.has(path.extname(asset).toLowerCase()))
            .map(asset => path.join(post.directory, asset))
    );

    await Promise.all(files.map(optimizeFile));
}

module.exports = optimizeImages;
