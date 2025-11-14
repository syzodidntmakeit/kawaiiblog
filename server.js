const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = 3001;
const ROOT_DIR = __dirname;
const HOME_PAGE = path.join(ROOT_DIR, 'index.html');
const NOT_FOUND_PAGE = path.join(ROOT_DIR, '404.html');
const ASSETS_DIR = path.join(ROOT_DIR, 'assets');

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

const COMPRESSIBLE_EXTENSIONS = new Set([
    '.html',
    '.css',
    '.js',
    '.json',
    '.svg',
    '.xml',
    '.txt',
    '.webmanifest',
]);

function isPathInside(parent, filePath) {
    const normalizedParent = parent.endsWith(path.sep) ? parent : `${parent}${path.sep}`;
    return filePath === parent || filePath.startsWith(normalizedParent);
}

function getCacheControl(filePath, extname) {
    if (isPathInside(ASSETS_DIR, filePath)) {
        return 'public, max-age=604800, stale-while-revalidate=86400';
    }
    if (extname === '.html') {
        return 'public, max-age=60, stale-while-revalidate=30';
    }
    if (extname === '.json') {
        return 'public, max-age=300, stale-while-revalidate=60';
    }
    return 'public, max-age=86400';
}

function generateEtag(stats) {
    return `"${stats.size.toString(16)}-${Math.floor(stats.mtimeMs).toString(16)}"`;
}

function isFresh(req, etag, mtime) {
    const ifNoneMatch = req.headers['if-none-match'];
    if (ifNoneMatch && ifNoneMatch.split(/\s*,\s*/).includes(etag)) {
        return true;
    }

    const ifModifiedSince = req.headers['if-modified-since'];
    if (ifModifiedSince) {
        const since = new Date(ifModifiedSince);
        if (!Number.isNaN(since.getTime()) && mtime <= since) {
            return true;
        }
    }

    return false;
}

function selectCompression(req, extname, contentType) {
    const accepts = req.headers['accept-encoding'] || '';
    const compressible = COMPRESSIBLE_EXTENSIONS.has(extname) || contentType.startsWith('text/');
    if (!compressible) {
        return null;
    }

    if (accepts.includes('br')) {
        return { encoding: 'br', stream: zlib.createBrotliCompress() };
    }
    if (accepts.includes('gzip')) {
        return { encoding: 'gzip', stream: zlib.createGzip({ level: 6 }) };
    }

    return null;
}

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
    res.writeHead(404, {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-store',
    });
    const stream = fs.createReadStream(NOT_FOUND_PAGE);
    stream.on('error', () => res.end('Not found'));
    stream.pipe(res);
}

function serveFile(req, res, filePath, stats) {
    const extname = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';
    const cacheControl = getCacheControl(filePath, extname);
    const etag = generateEtag(stats);
    const lastModified = stats.mtime.toUTCString();

    const headers = {
        'Content-Type': contentType,
        'Cache-Control': cacheControl,
        'Last-Modified': lastModified,
        ETag: etag,
    };

    if (isFresh(req, etag, stats.mtime)) {
        res.writeHead(304, headers);
        res.end();
        return;
    }

    const compression = selectCompression(req, extname, contentType);
    if (compression) {
        headers['Content-Encoding'] = compression.encoding;
    }

    res.writeHead(200, headers);

    const handleStreamError = () => {
        if (!res.headersSent) {
            res.writeHead(500);
        }
        res.end('Internal server error');
    };

    const sourceStream = fs.createReadStream(filePath);
    sourceStream.on('error', handleStreamError);

    let bodyStream = sourceStream;
    if (compression) {
        compression.stream.on('error', handleStreamError);
        bodyStream = bodyStream.pipe(compression.stream);
    }

    bodyStream.pipe(res);
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
            fs.stat(indexPath, (indexErr, indexStats) => {
                if (indexErr) {
                    serveNotFound(res);
                } else {
                    serveFile(req, res, indexPath, indexStats);
                }
            });
            return;
        }

        serveFile(req, res, resolvedPath, stats);
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
