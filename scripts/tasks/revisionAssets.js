const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT_DIR = path.join(__dirname, '..', '..');
const ASSET_MANIFEST_PATH = path.join(ROOT_DIR, 'assets', 'asset-manifest.json');

const ASSETS = [
    { original: '/assets/css/style.css', file: path.join(ROOT_DIR, 'assets', 'css', 'style.css') },
    { original: '/assets/js/script.js', file: path.join(ROOT_DIR, 'assets', 'js', 'script.js') },
    { original: '/assets/js/homepage.js', file: path.join(ROOT_DIR, 'assets', 'js', 'homepage.js') },
    { original: '/assets/js/archive.js', file: path.join(ROOT_DIR, 'assets', 'js', 'archive.js') },
    { original: '/assets/js/search.js', file: path.join(ROOT_DIR, 'assets', 'js', 'search.js') },
];

const ROOT_HTML_FILES = ['index.html', '404.html'];
const HTML_DIRECTORIES = [path.join(ROOT_DIR, 'pages'), path.join(ROOT_DIR, 'posts')];
const EXTRA_FILES = [path.join(ROOT_DIR, 'sw.js')];

function ensureFileExists(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Required asset missing: ${filePath}`);
    }
}

function hashFile(filePath) {
    ensureFileExists(filePath);
    const contents = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha256').update(contents).digest('hex');
    return hash.slice(0, 12);
}

function escapeForRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function collectHtmlFiles(dir) {
    if (!fs.existsSync(dir)) {
        return [];
    }
    const result = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    entries.forEach(entry => {
        const resolved = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            result.push(...collectHtmlFiles(resolved));
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
            result.push(resolved);
        }
    });
    return result;
}

function buildManifest() {
    const manifest = {};
    ASSETS.forEach(asset => {
        const hash = hashFile(asset.file);
        manifest[asset.original] = `${asset.original}?v=${hash}`;
    });
    return manifest;
}

function rewriteFile(filePath, manifest) {
    if (!fs.existsSync(filePath)) {
        return;
    }
    let contents = fs.readFileSync(filePath, 'utf8');
    let updated = contents;

    Object.entries(manifest).forEach(([original, versioned]) => {
        const pattern = new RegExp(`${escapeForRegex(original)}(?:\\?v=[A-Za-z0-9]+)?`, 'g');
        updated = updated.replace(pattern, versioned);
    });

    if (updated !== contents) {
        fs.writeFileSync(filePath, updated);
        console.log(`Updated asset references in ${path.relative(ROOT_DIR, filePath)}`);
    }
}

function main() {
    const manifest = buildManifest();

    const htmlFiles = ROOT_HTML_FILES.map(name => path.join(ROOT_DIR, name)).filter(file => fs.existsSync(file));
    HTML_DIRECTORIES.forEach(dir => {
        collectHtmlFiles(dir).forEach(file => htmlFiles.push(file));
    });

    [...htmlFiles, ...EXTRA_FILES].forEach(file => rewriteFile(file, manifest));

    fs.writeFileSync(ASSET_MANIFEST_PATH, JSON.stringify(manifest, null, 2));
    console.log(`Wrote ${path.relative(ROOT_DIR, ASSET_MANIFEST_PATH)}`);
}

try {
    main();
} catch (error) {
    console.error('Failed to revision assets:', error.message);
    process.exit(1);
}
