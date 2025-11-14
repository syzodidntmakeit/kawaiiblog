const fs = require('fs');
const path = require('path');
const { SITE_URL } = require('../../lib/config');

const RSS_PATH = path.join(__dirname, '..', '..', 'rss.xml');

function writeRss(posts) {
    const items = posts
        .map(post => {
            const postUrl = `${SITE_URL}/posts/${post.folder}/`;
            return `
<item>
<title><![CDATA[${post.frontmatter.title}]]></title>
<link>${postUrl}</link>
<guid>${postUrl}</guid>
<pubDate>${new Date(post.date).toUTCString()}</pubDate>
<category><![CDATA[${post.category}]]></category>
<description><![CDATA[${post.html}]]></description>
</item>`;
        })
        .join('\n');

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

module.exports = writeRss;
