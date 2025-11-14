const fs = require('fs');
const path = require('path');

const PARTIALS_DIR = path.join(__dirname, '..', '..', 'src', 'partials');

function renderPartials(content) {
    const includePattern = /{{>\s*([\w/-]+)\s*}}/g;
    return content.replace(includePattern, (_, name) => {
        const partialPath = path.join(PARTIALS_DIR, `${name}.html`);
        if (!fs.existsSync(partialPath)) {
            throw new Error(`Partial "${name}" not found at ${partialPath}`);
        }
        const partialContent = fs.readFileSync(partialPath, 'utf8');
        return renderPartials(partialContent);
    });
}

module.exports = {
    renderPartials,
    PARTIALS_DIR,
};
