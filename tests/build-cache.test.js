const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

test('loadBuildCache returns defaults when no file exists', () => {
    const tempPath = path.join(os.tmpdir(), `build-cache-${process.hrtime.bigint()}.json`);
    process.env.BUILD_CACHE_PATH = tempPath;
    const modulePath = require.resolve('../scripts/utils/buildCache');
    delete require.cache[modulePath];
    const buildCache = require('../scripts/utils/buildCache');

    const cache = buildCache.loadBuildCache();
    assert.deepEqual(cache.posts, {});
    delete process.env.BUILD_CACHE_PATH;
    delete require.cache[modulePath];
});

test('saveBuildCache writes data that loadBuildCache can read', () => {
    const tempPath = path.join(os.tmpdir(), `build-cache-${process.hrtime.bigint()}.json`);
    process.env.BUILD_CACHE_PATH = tempPath;
    const modulePath = require.resolve('../scripts/utils/buildCache');
    delete require.cache[modulePath];
    const buildCache = require('../scripts/utils/buildCache');

    const payload = { posts: { '2025-01-01': { markdownMtime: 123 } } };
    buildCache.saveBuildCache(payload);
    const cached = buildCache.loadBuildCache();
    assert.deepEqual(cached, payload);

    fs.unlinkSync(tempPath);
    delete process.env.BUILD_CACHE_PATH;
    delete require.cache[modulePath];
});
