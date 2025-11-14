const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const ROOT_DIR = __dirname;
const HOME_PAGE = path.join(ROOT_DIR, 'index.html');
const NOT_FOUND_PAGE = path.join(ROOT_DIR, '404.html');

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.xml': 'application/xml',
    '.txt': 'text/plain',
    '.webmanifest': 'application/manifest+json',
};

const STATIC_PREFIXES = {
    '/assets/': path.join(ROOT_DIR, 'assets'),
    '/pages/': path.join(ROOT_DIR, 'pages'),
    '/posts/': path.join(ROOT_DIR, 'posts'),
};

const ROOT_FILES = {
    '/rss.xml': path.join(ROOT_DIR, 'rss.xml'),
    '/sw.js': path.join(ROOT_DIR, 'sw.js'),
    '/sitemap.xml': path.join(ROOT_DIR, 'sitemap.xml'),
    '/robots.txt': path.join(ROOT_DIR, 'robots.txt'),
};

function resolvePath(pathname) {
    if (pathname === '/') {
        return HOME_PAGE;
    }

    if (ROOT_FILES[pathname]) {
        return ROOT_FILES[pathname];
    }

    for (const [prefix, directory] of Object.entries(STATIC_PREFIXES)) {
        if (pathname.startsWith(prefix)) {
            const relativePath = pathname.slice(prefix.length);
            const normalized = path.normalize(relativePath);
            const fullPath = path.join(directory, normalized);

            if (!fullPath.startsWith(directory)) {
                return null;
            }

            return fullPath;
        }
    }

    return null;
}

function serveNotFound(res) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    const stream = fs.createReadStream(NOT_FOUND_PAGE);
    stream.on('error', () => res.end('Not found'));
    stream.pipe(res);
}

function serveFile(res, filePath) {
    const extname = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                serveNotFound(res);
            } else {
                res.writeHead(500);
                res.end('Internal server error');
            }
            return;
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    });
}

const server = http.createServer((req, res) => {
    const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = decodeURIComponent(requestUrl.pathname);
    console.log('Request URL:', pathname);

    const resolvedPath = resolvePath(pathname);

    if (!resolvedPath) {
        serveNotFound(res);
        return;
    }

    fs.stat(resolvedPath, (err, stats) => {
        if (err) {
            serveNotFound(res);
            return;
        }

        if (stats.isDirectory()) {
            const indexPath = path.join(resolvedPath, 'index.html');
            fs.access(indexPath, fs.constants.F_OK, accessErr => {
                if (accessErr) {
                    serveNotFound(res);
                } else {
                    serveFile(res, indexPath);
                }
            });
            return;
        }

        serveFile(res, resolvedPath);
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
