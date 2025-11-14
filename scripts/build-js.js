const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const SRC_DIR = path.join(__dirname, '..', 'src', 'js');
const DEST_DIR = path.join(__dirname, '..', 'assets', 'js');

async function build() {
    fs.mkdirSync(DEST_DIR, { recursive: true });
    const files = fs.readdirSync(SRC_DIR).filter(file => file.endsWith('.js'));

    await Promise.all(
        files.map(async file => {
            const sourcePath = path.join(SRC_DIR, file);
            const destPath = path.join(DEST_DIR, file);
            const source = fs.readFileSync(sourcePath, 'utf8');
            const result = await minify(source, {
                ecma: 2020,
                compress: true,
                mangle: true,
            });

            if (result.error) {
                throw result.error;
            }

            fs.writeFileSync(destPath, result.code, 'utf8');
            console.log(`Minified ${file}`);
        })
    );
}

build().catch(error => {
    console.error('Failed to build JS:', error);
    process.exit(1);
});
