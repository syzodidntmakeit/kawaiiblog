const fs = require('fs');
const path = require('path');
const { renderPartials } = require('./utils/partials');

const SRC_DIR = path.join(__dirname, '..', 'src', 'pages');
const DEST_ROOT = path.join(__dirname, '..');

function listHtmlFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    return entries.flatMap(entry => {
        const resolved = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            return listHtmlFiles(resolved);
        }
        if (entry.isFile() && entry.name.endsWith('.html')) {
            return [resolved];
        }
        return [];
    });
}

function buildPages() {
    const files = listHtmlFiles(SRC_DIR);
    files.forEach(file => {
        const relative = path.relative(SRC_DIR, file);
        const destination = path.join(DEST_ROOT, relative);
        const html = fs.readFileSync(file, 'utf8');
        const rendered = renderPartials(html);

        fs.mkdirSync(path.dirname(destination), { recursive: true });
        fs.writeFileSync(destination, rendered);
        console.log(`Built ${destination}`);
    });
}

buildPages();
