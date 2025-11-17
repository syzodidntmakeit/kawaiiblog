const fs = require('fs');
const path = require('path');
const { SITE_URL } = require('../../lib/config');

const RSS_PATH = path.join(__dirname, '..', '..', 'rss.xml');

function buildRssXml(posts, siteUrl = SITE_URL) {
    const items = posts
        .map(post => {
            const postUrl = `${siteUrl}/posts/${post.folder}/`;
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

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>KawaiiBlog</title>
<link>${siteUrl}</link>
<description>A simple and lightweight blogging website.</description>
${items}
</channel>
</rss>
`;
}

function writeRss(posts) {
    const rss = buildRssXml(posts);
    fs.writeFileSync(RSS_PATH, rss);
    console.log(`Wrote ${RSS_PATH}`);
}

module.exports = {
    writeRss,
    buildRssXml,
};
