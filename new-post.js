const fs = require('fs');
const path = require('path');

const title = process.argv.slice(2).join(' ').trim();

if (!title) {
    console.error('Please provide a title for your post.');
    process.exit(1);
}

const date = new Date();
const day = String(date.getDate()).padStart(2, '0');
const month = String(date.getMonth() + 1).padStart(2, '0');
const year = date.getFullYear();

const dateString = `${year}-${month}-${day}`;
const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
const postDir = path.join('posts', dateString);

if (!fs.existsSync(postDir)) {
    fs.mkdirSync(postDir, { recursive: true });
}

const postFile = path.join(postDir, 'blog.md');
const markdownTemplate = `---
id: '${slug}'
title: "${title}"
date: '${dateString}'
category: 'uncategorized'
excerpt: "A short summary of your post."
---

Your content here.
`;

fs.writeFileSync(postFile, markdownTemplate);
console.log(`Created ${postFile}`);
