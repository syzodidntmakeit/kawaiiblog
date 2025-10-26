import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import fm from 'front-matter';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

// Helper to get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- MARKED CUSTOM RENDERER (Your existing config) ---
const headingColors = [
    'text-kawaii-pink',
    'text-kawaii-blue',
    'text-kawaii-mint',
    'text-kawaii-lavender',
];
let colorIndex = 0;

const renderer = {
    heading(token) {
        if (token.depth === 2) {
            const colorClass = headingColors[colorIndex];
            colorIndex = (colorIndex + 1) % headingColors.length;
            return `<h2 class="text-3xl font-bold mt-12 mb-6 ${colorClass}">${this.parser.parseInline(token.tokens)}</h2>\n`;
        }
        if (token.depth > 2) {
             return `<h${token.depth} class="text-2xl font-bold mt-8 mb-4">${this.parser.parseInline(token.tokens)}</h${token.depth}>\n`;
        }
        return false; // Let marked handle h1
    },
    paragraph(token) {
        const text = this.parser.parseInline(token.tokens);
        // Check if it's the custom image div structure
        if (text.trim().startsWith('<div class="my-8 flex justify-center">')) {
             return text; // Return as is if it's the image structure
        }
        // Otherwise, wrap in standard paragraph
        return `<p class="mb-6">${text}</p>\n`;
    },
    hr() {
        return '<hr class="my-12 border-gray-700">\n';
    },
    blockquote(quote) {
        // This seems fine, assuming blockquote content doesn't break
        if (!quote.tokens || quote.tokens.length === 0) return '';
        const parsedQuote = this.parser.parse(quote.tokens);
        const innerText = parsedQuote.replace(/^<p class="mb-6">/, '').replace(/<\/p>\n$/, '');
        return `<div class="bg-gray-800 p-6 rounded-lg my-8 border-l-4 border-kawaii-pink"><p class="text-xl italic">${innerText}</p></div>\n`;
    },
    image(token) {
        const href = token.href;
        const text = token.text;
        const isBanner = href.includes('/banners/');
        const maxWidth = isBanner ? 'max-w-3xl' : 'max-w-md';
        return `<div class="my-8 flex justify-center">
            <img src="${href}" alt="${text}" class="w-full ${maxWidth} rounded-lg shadow-lg" />
        </div>\n`;
    },
    list(token) {
        const tag = token.ordered ? 'ol' : 'ul';
        const listStyle = token.ordered ? 'list-decimal' : 'list-disc';
        const body = token.items.map(item => {
            const text = this.parser.parseInline(item.tokens);
            return `<li class="mb-1">${text}</li>`;
        }).join('\n');
        return `<${tag} class="${listStyle} list-inside mb-6 space-y-2 text-lg leading-relaxed">${body}</${tag}>\n`;
    },
};
marked.use({ renderer });

// --- HELPER FUNCTIONS ---
const calculateReadingTime = (text) => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
};

const formatDisplayDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
};

// --- NEW PUBLISHER FUNCTIONS ---

// Updates all-posts.json
const updateAllPosts = (chalk, postData) => {
    const allPostsPath = path.resolve(__dirname, '..', 'posts', 'all-posts.json');
    try {
        const allPosts = JSON.parse(fs.readFileSync(allPostsPath, 'utf8'));
        
        // Check for duplicates
        if (allPosts.posts.some(post => post.id === postData.id || post.url === postData.url)) {
            console.log(chalk.yellow('   - Post already exists in all-posts.json. Skipping.'));
            return;
        }

        allPosts.posts.unshift(postData); // Add new post to the top
        fs.writeFileSync(allPostsPath, JSON.stringify(allPosts, null, 2));
        console.log(chalk.green('   - ✅ all-posts.json updated!'));
    } catch (e) {
        console.error(chalk.red.bold(`   - ❌ FAILED to update all-posts.json: ${e.message}`));
    }
};

// Updates rss.xml
const updateRssFeed = (chalk, metadata, postUrl, htmlContent, bannerUrl) => {
    const rssPath = path.resolve(__dirname, '..', 'rss.xml');
    const siteUrl = 'https://kawaii-san.org';
    try {
        const parser = new XMLParser({ ignoreAttributes: false, preserveOrder: true });
        const builder = new XMLBuilder({ format: true, ignoreAttributes: false, preserveOrder: true, suppressEmptyNode: true });
        
        const rssXml = fs.readFileSync(rssPath, 'utf8');
        let rssObj = parser.parse(rssXml);

        const channel = rssObj.find(item => item.rss).rss[0].channel;
        
        // Find ALL <item> elements
        const items = channel.filter(child => child.item); // This gets an array of {item: [...]}, {item: [...]}, ...

        // Check for duplicates by looking inside each item
        const fullUrl = `${siteUrl}${postUrl}`;
        if (items.some(itemObj => {
            const itemChildren = itemObj.item; // Get children array like [ {title:[]}, {link:[]}, ... ]
            if (!itemChildren) return false;
            const linkObj = itemChildren.find(child => child.link); // Find the {link: [...]} object
            return linkObj && linkObj.link[0]['#text'] === fullUrl;
        })) {
            console.log(chalk.yellow('   - Post already exists in rss.xml. Skipping.'));
            return;
        }
        
        // Create new item
        const newItem = {
            item: [
                { title: [{ '#text': metadata.title }] },
                { link: [{ '#text': fullUrl }] },
                { guid: [{ '#text': fullUrl, '@_isPermaLink': 'true' }] },
                { pubDate: [{ '#text': new Date(metadata.date).toUTCString() }] },
                { category: [{ '#text': metadata.category }] },
                { 'content:encoded': [{ '#text': `<![CDATA[${htmlContent}]]>` }] },
                { description: [{ '#text': `<![CDATA[${metadata.excerpt}]]>` }] },
                { 'media:content': [{ '@_url': `${siteUrl}${bannerUrl}`, '@_medium': 'image' }] }
            ]
        };

        // Add new item to the top (after title, link, desc, etc.)
        // Find the index of the first existing <item>
        const firstItemIndex = channel.findIndex(child => child.item);
        
        if (firstItemIndex !== -1) {
            // If items exist, insert before the first one
            channel.splice(firstItemIndex, 0, newItem);
        } else {
            // No items exist yet, add it after the 'lastBuildDate' or similar tag
            const lastBuildIndex = channel.findIndex(child => child.lastBuildDate);
            channel.splice(lastBuildIndex + 1, 0, newItem);
        }

        // Update Last Build Date
        const lastBuildDate = channel.find(item => item.lastBuildDate);
        if(lastBuildDate) {
            lastBuildDate.lastBuildDate[0]['#text'] = new Date().toUTCString();
        }

        const newRssXml = builder.build(rssObj);
        fs.writeFileSync(rssPath, '<?xml version="1.0" encoding="UTF-8" ?>\n' + newRssXml);
        console.log(chalk.green('   - ✅ rss.xml updated!'));
    } catch (e) {
        console.error(chalk.red.bold(`   - ❌ FAILED to update rss.xml: ${e.message}`), e);
    }
};

// Updates sitemap.xml
const updateSitemap = (chalk, metadata, postUrl) => {
    const sitemapPath = path.resolve(__dirname, '..', 'sitemap.xml');
    const siteUrl = 'https://kawaii-san.org';
    try {
        const parser = new XMLParser({ ignoreAttributes: false, preserveOrder: true });
        const builder = new XMLBuilder({ format: true, ignoreAttributes: false, preserveOrder: true });

        const sitemapXml = fs.readFileSync(sitemapPath, 'utf8');
        let sitemapObj = parser.parse(sitemapXml);

        const urlset = sitemapObj.find(item => item.urlset).urlset; // This is correct, urlset is [ {url:[...]}, {url:[...]} ]

        // Check for duplicates
        const fullUrl = `${siteUrl}${postUrl}`;
        if (urlset.some(item => {
            const urlChildren = item.url; // Get children array like [ {loc:[]}, {lastmod:[]} ]
            if (!urlChildren) return false;
            const locObj = urlChildren.find(u => u.loc); // Find the {loc: [...]} object
            return locObj && locObj.loc[0]['#text'] === fullUrl;
        })) {
            console.log(chalk.yellow('   - Post already exists in sitemap.xml. Skipping.'));
            return;
        }

        const newUrlEntry = {
            url: [
                { loc: [{ '#text': fullUrl }] },
                { lastmod: [{ '#text': metadata.date }] },
                { priority: [{ '#text': '0.8' }] }
            ]
        };

        // Add new URL right after the main page URLs (e.g., after archive.html)
        // Let's make this safer by just inserting at index 1 (after the root url)
        urlset.splice(1, 0, newUrlEntry); 

        const newSitemapXml = builder.build(sitemapObj);
        fs.writeFileSync(sitemapPath, '<?xml version="1.0" encoding="UTF-8"?>\n' + newSitemapXml);
        console.log(chalk.green('   - ✅ sitemap.xml updated!'));
    } catch (e) {
        console.error(chalk.red.bold(`   - ❌ FAILED to update sitemap.xml: ${e.message}`), e);
    }
};

// --- CORE LOGIC ---
const runGenerator = async (markdownPath) => {
    console.log(chalk.blue(`🚀 Starting generation for: ${markdownPath}`));

    // Reset counters
    colorIndex = 0;

    const mdFilePath = path.resolve(markdownPath);
    const templatePath = path.join(__dirname, 'template.html'); // It should be in the same dir

    if (!fs.existsSync(mdFilePath)) {
        console.error(chalk.red.bold(`❌ Error: Markdown file not found at ${mdFilePath}`));
        process.exit(1);
    }
    if (!fs.existsSync(templatePath)) {
        console.error(chalk.red.bold(`❌ Error: template.html not found at ${templatePath}`));
        process.exit(1);
    }

    const markdownContent = fs.readFileSync(mdFilePath, 'utf8');
    let template = fs.readFileSync(templatePath, 'utf8');
    const { attributes: metadata, body } = fm(markdownContent);

    // Validate frontmatter
    const requiredFields = ['id', 'title', 'date', 'category', 'excerpt'];
    const missingFields = requiredFields.filter(field => !metadata[field]);
    if (missingFields.length > 0) {
        console.error(chalk.red.bold('❌ Error: Markdown file is missing required frontmatter:'), chalk.yellow(missingFields.join(', ')));
        process.exit(1);
    }
    
    // --- Generate HTML ---
    const htmlContent = marked.parse(body);
    const readingTime = calculateReadingTime(body);
    const displayDate = formatDisplayDate(metadata.date);
    
    const dateForPath = metadata.date;
    const [year, month, day] = dateForPath.split('-');
    const postDirName = `${day}-${month}-${year}`; // '21-10-2025'
    
    const postUrl = `/posts/${postDirName}/`;
    const bannerUrl = `/assets/images/banners/${postDirName}.webp`;
    const thumbnailUrl = `/assets/images/thumbnails/${postDirName}.webp`;

    const replacements = {
        '[POST_TITLE]': metadata.title,
        '[YYYY-MM-DD]': metadata.date,
        '[POST_DATE_FORMATTED]': displayDate,
        '[CATEGORY]': metadata.category,
        '[EXCERPT]': metadata.excerpt,
        '[READING_TIME]': readingTime,
        '[CONVERTED_HTML_CONTENT]': htmlContent,
        '[POST_URL]': postUrl,
        '[BANNER_URL]': bannerUrl,
    };

    for (const [placeholder, value] of Object.entries(replacements)) {
        const regex = new RegExp(placeholder.replace(/\[/g, '\\[').replace(/\]/g, '\\]'), 'g');
        template = template.replace(regex, value);
    }

    const outputPath = path.join(path.dirname(mdFilePath), 'index.html');
    fs.writeFileSync(outputPath, template);

    console.log(chalk.green.bold('\n✅ HTML file generated!'));
    console.log(chalk.cyan(`   - ${path.relative(process.cwd(), outputPath)}`));

    // --- NEW: Run publisher tasks ---
    console.log(chalk.blue.bold('\n🚀 Running publisher tasks...'));

    const postData = {
        id: metadata.id,
        date: displayDate, // "Oct 21, 2025"
        title: metadata.title,
        excerpt: metadata.excerpt,
        category: metadata.category,
        url: postUrl,
        thumbnailUrl: thumbnailUrl,
        bannerUrl: bannerUrl,
        readingTime: readingTime,
    };
    
    // Run updates
    updateAllPosts(chalk, postData);
    updateRssFeed(chalk, metadata, postUrl, htmlContent, bannerUrl);
    updateSitemap(chalk, metadata, postUrl);
    
    console.log(chalk.green.bold('\n✅ All done. Your post is published.'));
    console.log(chalk.yellow.bold('Now just test locally, then commit and push these files:'));
    console.log(chalk.magenta(`   - ${path.relative(process.cwd(), outputPath)}`));
    console.log(chalk.magenta(`   - ${path.relative(process.cwd(), mdFilePath)}`));
    console.log(chalk.magenta('   - posts/all-posts.json'));
    console.log(chalk.magenta('   - rss.xml'));
    console.log(chalk.magenta('   - sitemap.xml'));
    console.log(chalk.magenta('   - (and your new images in /assets/...)'));
};

// --- SCRIPT EXECUTION ---
// This part gets the file path from the command line
const inputFile = process.argv[2]; 
if (!inputFile) {
    console.error(chalk.red.bold('❌ Error: Please provide the path to a Markdown file.'));
    console.log(chalk.cyan('   Usage: node blog-to-site/generate.js posts/21-10-2025/blog.md'));
    process.exit(1);
}

// We need to resolve the path relative to the CWD, not __dirname
const inputPath = path.resolve(process.cwd(), inputFile);

runGenerator(inputPath).catch((err) => {
    console.error(chalk.red('An unexpected error occurred:', err));
    process.exit(1);
});
