# KawaiiBlog 2.0 🌸

A high-performance, lightweight personal blogging platform built with Astro. Features a "Dark Pastel Cyberpunk" aesthetic with zero bloat, powerful CLI tools, advanced RSS feeds, and automated content management.

**Live at**: [blog.kawaiisan.org](https://blog.kawaiisan.org)

---

## ✨ Features

### 🎨 **Design & UX**

- **Dark Pastel Cyberpunk Theme** - Unique glassmorphism aesthetic with cycling H2 colors
- **Dark/Light Mode Toggle** - Seamless theme switching with localStorage persistence
- **Reading Progress Bar** - Visual scroll indicator on blog posts
- **Responsive Design** - Mobile-first, works beautifully on all devices
- **Custom Scrollbar** - Styled scrollbars matching the cyberpunk theme

### ⚡ **Performance**

- **Lightning Fast** - Static site generation with zero-JS by default
- **Instant Navigation** - Global link prefetching for zero-latency clicks
- **Self-Hosted Fonts** - Privacy-friendly `@fontsource` implementation (Nunito & VT323)
- **Image Optimization** - Automatic WebP conversion and lazy loading
- **Optimized Builds** - Production builds under 3 seconds
- **SEO Optimized** - JSON-LD schema, sitemaps, and robots.txt

### 📝 **Content Management**

- **Powerful CLI Tools** - Interactive commands for post creation, editing, and management
- **Content Validation** - Automated health checks for broken links and missing metadata
- **Export & Backup** - One-command zip export of all content
- **Blog Statistics** - Comprehensive analytics about your content

### 🔍 **Discovery**

- **Fuzzy Search** - Client-side search powered by Fuse.js
- **Category Organization** - tech, music, games, commentary
- **Series Support** - Group related posts with progress tracking
- **Featured Posts** - Highlight your best content
- **Related Posts** - Smart recommendations based on category and recency

### 📡 **RSS Feeds**

- **Main Feed** - All published posts
- **Category Feeds** - Separate feeds for each category
- **Featured Feed** - Curated best posts
- **Full-Text Feed** - Complete content in RSS (not just excerpts)

### � **Dynamic Elements**

- **Time-Based Greetings** - Hero text changes based on Singapore time
- **Auto Table of Contents** - Generated from post headings (Collapsible on Mobile)
- **Reading Time** - Estimated read time displayed on post cards
- **Share Buttons** - Twitter, Reddit, LinkedIn, Facebook
- **Code Copy** - One-click copy button for code blocks
- **Back to Top** - Smooth scroll navigation

---

## 📋 Prerequisites

- **Node.js** v18 or higher
- **npm** (comes with Node.js)
- **Git**
- A text editor (VS Code, Neovim, etc.)
- Basic knowledge of Markdown

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/syzodidntmakeit/kawaiiblog2.0.git
cd kawaiiblog2.0
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Visit **http://localhost:4321** to see your blog!

---

## 📝 Content Management

### Creating Posts

#### Using CLI (Recommended)

```bash
npm run cli new
```

**Interactive prompts:**

```
? Enter post title: My First Blog Post
? Select category: tech
? Enter excerpt: This is my awesome first blog post about web development
? Add cover image path (optional):
```

Creates: `src/content/posts/YYYY-MM-DD-my-first-blog-post/index.md`

#### Manual Creation

1. Create folder: `src/content/posts/2025-11-23-my-post/`
2. Add `index.md` with frontmatter:

```markdown
---
title: "My First Post"
date: 2025-11-23
category: tech
excerpt: "A brief description that appears in post cards"
draft: false
featured: false
cover: ./cover-image.webp # Optional
coverAlt: "Image description" # Optional
series: # Optional
  name: "Getting Started Series"
  order: 1
---

## Your Content Here

Write your post content in Markdown...
```

### Editing Posts

```bash
npm run cli edit
```

**Features:**

- Fuzzy search to find posts quickly
- Edit title, date, category, excerpt
- Automatically renames folders when title/date changes

### Listing Posts

```bash
npm run cli list
```

Shows all posts with status, category, and dates.

### Searching Posts

```bash
npm run cli search [query]
```

Fuzzy search through post titles and content.

### Deleting Posts

```bash
npm run cli delete
```

Interactive deletion with confirmation.

---

## 📊 Blog Analytics

### View Statistics

```bash
npm run cli stats
```

**Output includes:**

```
� KawaiiBlog Statistics

General
  Total Posts: 7
  Published:   7
  Drafts:      0

Content
  Total Words: 24,148
  Avg Length:  3,450 words
  Total Read:  124 mins
  Avg Read:    18 mins

Categories
  tech            2
  commentary      2
  games           2
  music           1

Most Active Months
  2025-10         6 posts
  2025-11         1 posts

Series
  Getting Started    3 parts
```

### Validate Content

```bash
npm run cli validate
```

**Checks for:**

- Missing required frontmatter fields
- Broken image links (relative and absolute paths)
- Missing `index.md` files
- Invalid content structure

### Export Content

```bash
npm run cli export
```

Creates timestamped zip archive in `exports/` containing:

- All posts from `src/content/`
- Images from `public/images/`

---

## 📡 RSS Feeds

All feeds available at:

### Main Feed
```
https://blog.kawaiisan.org/rss.xml
```

### Category-Specific Feeds
```
https://blog.kawaiisan.org/rss/tech.xml
https://blog.kawaiisan.org/rss/music.xml
https://blog.kawaiisan.org/rss/games.xml
https://blog.kawaiisan.org/rss/commentary.xml
```

### Featured Posts Feed
```
https://blog.kawaiisan.org/rss/featured.xml
```

### Full-Text Feed
Includes complete post content (not just excerpts):
```
https://blog.kawaiisan.org/rss/full.xml
```

---

## 🧹 Code Quality

### Linting

Check for TypeScript and code quality issues:

```bash
npm run lint
```

### Formatting

Auto-format code with Prettier:

```bash
npm run format
```

**Configuration:**

- ESLint for TypeScript/JavaScript
- Prettier for code formatting
- Astro ESLint plugin for `.astro` files

---

## 📦 Available Commands

| Command                      | Description                                       |
| ---------------------------- | ------------------------------------------------- |
| **Development**              |
| `npm run dev`                | Start development server at http://localhost:4321 |
| `npm run build`              | Build production site to `dist/`                  |
| `npm run preview`            | Preview production build locally                  |
| **Content Management**       |
| `npm run cli new`            | Create a new blog post (interactive)              |
| `npm run cli edit`           | Edit existing post metadata                       |
| `npm run cli list`           | List all posts with status                        |
| `npm run cli search [query]` | Search posts by content                           |
| `npm run cli delete`         | Delete an existing blog post                      |
| **Analytics & Maintenance**  |
| `npm run cli stats`          | Show comprehensive blog statistics                |
| `npm run cli validate`       | Validate content health and integrity             |
| `npm run cli export`         | Export blog content to zip archive                |
| **Code Quality**             |
| `npm run lint`               | Check code for linting errors                     |
| `npm run format`             | Auto-format code with Prettier                    |
| `npm run format:check`       | Check code formatting (CI)                        |
| **Direct Astro**             |
| `npm run astro ...`          | Run Astro CLI commands directly                   |

---

## 📁 Project Structure

```
kawaiiblog/
├── .astro/                    # Astro cache (gitignored)
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Pages deployment
├── cli/                       # Custom CLI tools
│   ├── commands/
│   │   ├── new.ts            # Create new post
│   │   ├── edit.ts           # Edit post metadata
│   │   ├── list.ts           # List all posts
│   │   ├── search.ts         # Search posts
│   │   ├── delete.ts         # Delete posts
│   │   ├── stats.ts          # Blog statistics
│   │   ├── validate.ts       # Content validation
│   │   └── export.ts         # Export to zip
│   └── kawaii-blog.ts        # Main CLI entry point
├── public/                    # Static assets
│   ├── images/               # Image files
│   ├── og-image.png          # Social preview image
│   ├── robots.txt            # SEO robots file
│   └── favicon.svg           # Site favicon
├── src/
│   ├── components/           # Reusable Astro components
│   │   ├── Navigation.astro
│   │   ├── PostCard.astro
│   │   ├── SearchBar.astro
│   │   ├── ShareButtons.astro
│   │   ├── ReadingProgress.astro
│   │   ├── BackToTop.astro
│   │   ├── ThemeToggle.astro
│   │   ├── CodeCopyButton.astro
│   │   ├── RelatedPosts.astro
│   │   ├── SeriesNav.astro
│   │   ├── Pagination.astro
│   │   └── TableOfContents.astro
│   ├── content/
│   │   ├── posts/            # Your blog posts (Markdown)
│   │   │   └── YYYY-MM-DD-slug/
│   │   │       ├── index.md
│   │   │       └── cover.webp  # Optional images
│   │   └── config.ts         # Content collection schema
│   ├── layouts/
│   │   ├── BaseLayout.astro  # Base page layout
│   │   └── PostLayout.astro  # Blog post layout
│   ├── pages/
│   │   ├── index.astro       # Homepage
│   │   ├── archive.astro     # All posts page
│   │   ├── about.astro       # About page
│   │   ├── 404.astro         # Error page
│   │   ├── rss.xml.js        # Main RSS feed
│   │   ├── rss/
│   │   │   ├── [category].xml.js  # Category feeds
│   │   │   ├── featured.xml.js    # Featured feed
│   │   │   └── full.xml.js        # Full-text feed
│   │   ├── search-index.json.ts   # Search index
│   │   └── posts/
│   │       └── [...slug].astro    # Dynamic post pages
│   ├── styles/
│   │   ├── global.css        # Global styles + theme
│   │   └── critical.css      # Critical inline CSS
│   └── env.d.ts             # TypeScript definitions
├── astro.config.mjs         # Astro configuration
├── package.json             # Dependencies & scripts
├── tsconfig.json            # TypeScript config
├── .eslintrc.cjs            # ESLint configuration
├── .prettierrc              # Prettier configuration
└── README.md                # You are here!
```

---

## 🎨 Customization

### Change Theme Colors

Edit `src/styles/global.css`:

```css
:root {
  --bg: #0d011f;
  --text: #e5e7eb;
  --pink: #ffc0cb;
  --blue: #a7c7e7;
  --purple: #d8b4fe;
  --yellow: #fef08a;
  /* ... more colors */
}

/* Light mode */
[data-theme="light"] {
  --bg: #fef3f2;
  --text: #1f2937;
  /* ... */
}
```

### Modify Time-Based Greetings

Edit `src/pages/index.astro`:

```typescript
const hour = now.getHours();
const timeBasedTitle =
  hour >= 5 && hour < 11
    ? "Good morning, you early riser! ☀️"
    : hour >= 11 && hour < 17
      ? "Good afternoon! ⛅"
      : hour >= 17 && hour < 21
        ? "Good evening! 🌆"
        : "Burning the midnight oil? 🌙";
```

### Add New Categories

1. Edit `src/content/config.ts`:

```typescript
category: z.enum(['tech', 'music', 'games', 'commentary', 'YOUR_NEW_CATEGORY']),
```

2. Add category feed in `src/pages/rss/[category].xml.js`:

```javascript
export function getStaticPaths() {
  return [
    { params: { category: "tech" } },
    { params: { category: "music" } },
    { params: { category: "games" } },
    { params: { category: "commentary" } },
    { params: { category: "YOUR_NEW_CATEGORY" } }, // Add this
  ];
}
```

### Customize Reading Time

Edit calculation in `cli/commands/stats.ts`:

```typescript
// Change reading speed (default: 200 words per minute)
totalReadTime += Math.ceil(words / 250); // 250 wpm for faster reading
```

---

## 🚀 Deployment

### GitHub Pages (Configured)

Already set up! Just push to `main`:

```bash
git add .
git commit -m "New blog post"
git push origin main
```

GitHub Actions automatically builds and deploys to:

- **GitHub Pages**: `https://username.github.io/kawaiiblog2.0/`
- **Custom Domain**: `https://blog.kawaiisan.org` (if configured in repo settings)

### Manual Build

```bash
npm run build
```

Output goes to `dist/` directory. Deploy to any static hosting service:

- Netlify
- Vercel
- Cloudflare Pages
- AWS S3 + CloudFront

---

## 🔮 Roadmap

### Completed ✨

- [x] **Image Optimization** - Auto WebP conversion and lazy loading
- [x] **Advanced RSS Feeds** - Category, featured, and full-text feeds
- [x] **CLI Statistics** - Comprehensive blog analytics
- [x] **Content Validation** - Automated health checks
- [x] **Export Tool** - Backup blog content to zip
- [x] **TOC Mobile Toggle** - Collapsible table of contents on mobile
- [x] **Reading Time Display** - Show estimated reading time on post cards
- [x] **CI/CD Quality Checks** - Auto linting and formatting in GitHub Actions

### Planned 🚧

- [ ] **Bookmark System** - Save favorite posts with localStorage
- [ ] **View Counter** - Track post views with privacy-friendly analytics
- [ ] **Search Highlighting** - Highlight matched terms in search results
- [ ] **Analytics** - Plausible or Umami integration
- [ ] **Dark Mode for Images** - Auto-invert images in dark mode

---

## 🐛 Troubleshooting

### Build Fails with "Go program has already exited"

Astro compiler cache issue. Solution:

```bash
rm -rf node_modules .astro dist
npm install
npm run build
```

### Port 4321 Already in Use

Dev server automatically uses next available port (4322, 4323, etc.)

### Search Not Working

Rebuild the search index:

```bash
npm run build
npm run dev
```

### Images Not Optimizing

Ensure `sharp` is installed:

```bash
npm install sharp
```

### ESLint Errors After Update

Clear ESLint cache:

```bash
npx eslint --cache-clean
npm run lint
```

---

## 🛠️ Tech Stack

- **[Astro](https://astro.build)** - Static site generator
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Fuse.js](https://fusejs.io/)** - Fuzzy search
- **[Gray Matter](https://github.com/jonschlinkert/gray-matter)** - Frontmatter parsing
- **[Inquirer](https://github.com/SBoudrias/Inquirer.js)** - Interactive CLI prompts
- **[Chalk](https://github.com/chalk/chalk)** - Terminal styling
- **[Ora](https://github.com/sindresorhus/ora)** - Terminal spinners
- **[Commander](https://github.com/tj/commander.js)** - CLI framework
- **[Sharp](https://sharp.pixelplumbing.com/)** - Image optimization
- **[Archiver](https://www.archiverjs.com/)** - Zip creation
- **[Markdown-it](https://github.com/markdown-it/markdown-it)** - Markdown to HTML
- **[ESLint](https://eslint.org/)** & **[Prettier](https://prettier.io/)** - Code quality

---

## 📄 License

MIT License - Feel free to use this for your own blog!

---

## 💖 Credits

Built with **[Astro](https://astro.build)** and a lot of caffeine ☕

**Author**: [syzodidntmakeit](https://github.com/syzodidntmakeit)

**Live Demo**: [blog.kawaiisan.org](https://blog.kawaiisan.org)

---

## 🤝 Contributing

Found a bug or have a feature request?

- **Issues**: [Open an issue](https://github.com/syzodidntmakeit/kawaiiblog2.0/issues)
- **Pull Requests**: Contributions welcome!

---

**Questions?** Open an issue or reach out!

Made with 🌸 by the kawaii community
