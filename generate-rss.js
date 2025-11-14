const fs = require('fs');
const path = require('path');
const marked = require('marked');
const { ROOT_DIR, listPostFolders, loadPost } = require('./lib/postUtils');

const SITE_URL = process.env.SITE_URL || 'http://localhost:3001';
const RSS_PATH = path.join(ROOT_DIR, 'rss.xml');

function buildItem({ folder, meta, content }) {
    const postUrl = `${SITE_URL}/posts/${folder}/`;
    const description = marked.parse(content);
    const pubDate = new Date(meta.date).toUTCString();

    return `
<item>
<title><![CDATA[${meta.title}]]></title>
<link>${postUrl}</link>
<guid>${postUrl}</guid>
<pubDate>${pubDate}</pubDate>
<category><![CDATA[${meta.category}]]></category>
<description><![CDATA[${description}]]></description>
</item>`;
}

function generateRss() {
    const posts = listPostFolders()
        .map(loadPost)
        .filter(Boolean)
        .sort((a, b) => new Date(b.meta.date) - new Date(a.meta.date));

    const items = posts.map(buildItem).join('\n');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>KawaiiBlog</title>
<link>${SITE_URL}</link>
<description>A simple and lightweight blogging website.</description>
${items}
</channel>
</rss>
`;

    fs.writeFileSync(RSS_PATH, rss);
    console.log(`Wrote ${RSS_PATH}`);
}

generateRss();
