# 👾 KawaiiBlog

Welcome to the repository for kawaii-san.org, my personal corner of the internet. This is where I write about tech, self-hosting, Linux, anime, and anything else that's taking up space in my brain. The whole thing is built the Arch Way: minimal, efficient, and completely over-engineered for what it is.

This is a place for deep dives, rants about user-hostile tech, and thoughts on whatever else I'm passionate about. It's part-personal documentation, part-soapbox, and fully built with a healthy dose of spite for intrusive, bloated software.

## ⚙️ Tech Stack & Philosophy

This blog is a static site built with vanilla HTML, CSS, and JavaScript. There are no frameworks, no build tools, and no bullshit. It's powered by a simple local Node.js script to automate post creation and keep things consistent.

- **Content Source**: Markdown files (blog.md) for posts
- **Styling**: Tailwind CSS via CDN with JIT compilation
- **Automation**: A single `generate.js` script for converting Markdown to HTML
- **Database**: A `posts/all-posts.json` file acts as a simple, centralized "database" for all post metadata
- **Offline Support**: Service Worker for basic caching and offline functionality
- **SEO**: Properly structured meta tags, Schema.org JSON-LD, canonical URLs, and optimized images

The goal is a lightweight, fast, and fully transparent stack that I have complete control over.

## 🚀 How It Works

The architecture is dead simple:

- **Homepage** (`index.html`) fetches `all-posts.json` and renders the most recent 20 posts
- **Archive** (`archive.html`) fetches the same JSON file to render all posts with client-side search and filtering
- **Individual posts** are pre-rendered HTML files (`index.html`) sitting in their respective date-named folders
- **Service Worker** caches critical assets for offline access
- **RSS Feed** (`rss.xml`) provides full-content syndication
- **Sitemap** (`sitemap.xml`) helps search engines discover all pages

## 🛠️ Local Development

To preview changes locally without waiting for a GitHub Pages rebuild, run a simple web server from the root of the repository.

1. Navigate to the project directory:
```bash
cd /path/to/kawaiiblog
```

2. Start Python's built-in HTTP server:
```bash
python -m http.server
```

3. Open your browser and go to `http://localhost:8000`. Your changes will appear instantly on refresh.

## ✍️ Content Workflow: Adding a New Post

Follow this Git workflow to add new content safely and efficiently.

### 0. Get your repo and install dependencies
```bash
git clone [your-github-repo-url]
cd kawaiiblog
cd blog-to-site
npm install
cd ..
```
(You only ever have to do this `npm install` part once)

### 1. Sync main
Make sure your local main branch is up-to-date:
```bash
git checkout main
git pull origin main
```

### 2. Create a New Post
Run the interactive post creator:
```bash
node blog-to-site/new-post.js
```

This will prompt you for:
- Post title
- Category (tech, commentary, anime, music, games, cars, lifting, other)
- 1-2 line excerpt

It automatically:
- Creates a date-named directory (DD-MM-YYYY)
- Generates a `blog.md` file with frontmatter
- Reminds you to create banner and thumbnail images

### 3. Write Your Post
Edit the generated `blog.md` file with your content.

### 4. Create Images
Before generating, create these images:
- **Banner**: `/assets/images/banners/DD-MM-YYYY.png` or `.webp` (1200x630px)
- **Thumbnail**: `/assets/images/thumbnails/DD-MM-YYYY.webp` (384x384px)

**Tip**: Use WebP format for smaller file sizes. Convert with:
```bash
# Install ImageMagick or use online tools like squoosh.app
convert input.png -quality 80 output.webp
```

### 5. Generate HTML
```bash
node blog-to-site/generate.js posts/DD-MM-YYYY/blog.md
```

This one command automatically:
- Converts Markdown to HTML
- Updates `all-posts.json`
- Updates `rss.xml`
- Updates `sitemap.xml`
- Applies proper meta tags and Schema.org markup

### 6. Test Locally
Run the local server and verify:
- Post appears on homepage
- Post appears in archive
- Individual post page works
- Images load correctly
- RSS feed validates

### 7. Create a Branch
```bash
git checkout -b new-post-YYYY-MM-DD
```

### 8. Commit Changes
```bash
git add .
git commit -m "feat: Add post 'Your Awesome Post Title'"
```

### 9. Merge and Push
```bash
git checkout main
git merge new-post-YYYY-MM-DD
git push origin main
```

GitHub Pages will automatically rebuild and deploy your changes.

## 🐛 Known Issues & Roadmap

### Current Optimizations
- ✅ Tailwind JIT configuration
- ✅ Lazy loading images
- ✅ Service Worker for offline support
- ✅ Proper SEO meta tags
- ✅ Schema.org structured data
- ✅ Enhanced RSS feed with full content
- ✅ Canonical URLs

### Planned Improvements
- [ ] Minify JavaScript files
- [ ] Image Optimization
- [ ] Implement Pagefind for client-side search
- [ ] Add GoatCounter or Plausible analytics
- [ ] Newsletter system (Buttondown integration)
- [ ] Comment system (Giscus with GitHub Discussions)
- [ ] Convert remaining PNG images to WebP
- [ ] Implement proper 404 error logging
- [ ] RSS Feed enhancement
- [ ] Comment Section
- [ ] Skip to Content button to posts

## 🔒 Privacy & Licensing

- **Code**: Licensed under [GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html)
- **Content**: Licensed under [CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/)
- **Analytics**: None (for now)
- **Tracking**: None
- **Cookies**: None

This site respects your privacy. No data collection, no tracking, no bullshit.

## 🚢 Deployment

The site is hosted on **GitHub Pages** and automatically deploys on push to `main`. The deployment process:

1. Push to `main` branch
2. GitHub Actions builds the site
3. Static files are served from the `gh-pages` branch
4. DNS via `kawaii-san.org` (configured in CNAME)

## 🛠️ Tech Details

### Dependencies
- **Node.js**: For build scripts
- **marked**: Markdown to HTML conversion
- **front-matter**: Parse YAML frontmatter
- **fast-xml-parser**: RSS/Sitemap generation
- **chalk**: Pretty terminal output
- **inquirer**: Interactive CLI prompts

### Browser Support
- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- Progressive enhancement for older browsers
- Service Worker only in supporting browsers

### File Structure
```
kawaiiblog/
├── assets/
│   ├── images/
│   │   ├── banners/      # Post banner images (1200x630)
│   │   └── thumbnails/   # Post thumbnails (384x384)
│   ├── js/
│   │   ├── script.js     # Global scripts
│   │   ├── homepage.js   # Homepage logic
│   │   ├── archive.js    # Archive page logic
│   │   ├── site-config.js # Site configuration
│   │   └── sw.js         # Service Worker
│   ├── style.css         # Custom styles
│   ├── about.html        # About page
│   └── archive.html      # Archive page
├── blog-to-site/
│   ├── generate.js       # Build script
│   ├── new-post.js       # Post creator
│   ├── template.html     # Post template
│   └── template.md       # Markdown template
├── includes/
│   ├── header.html       # Shared header
│   └── footer.html       # Shared footer
├── posts/
│   ├── DD-MM-YYYY/       # Post directories
│   │   ├── blog.md       # Source markdown
│   │   └── index.html    # Generated HTML
│   └── all-posts.json    # Post metadata
├── index.html            # Homepage
├── rss.xml               # RSS feed
├── sitemap.xml           # Sitemap
└── robots.txt            # Robots directives
```

---

*Built with a healthy disrespect for proprietary bullshit and bloated frameworks.*
