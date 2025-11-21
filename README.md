# KawaiiBlog 2.0 🌸

A high-performance, lightweight personal blogging platform built with Astro. Features a "Dark Pastel Cyberpunk" aesthetic with zero bloat, powerful CLI tools, and dynamic time-based greetings.

## ✨ Features

- **⚡ Lightning Fast** - Static site generation with zero-JS by default
- **🌓 Dark/Light Mode** - Beautiful theme toggle with localStorage persistence
- **🕐 Dynamic Hero Text** - Changes based on Singapore time
- **📖 Reading Progress** - Visual scroll indicator
- **🔍 Fuzzy Search** - Client-side search with Fuse.js
- **🎨 Cyberpunk Aesthetic** - Glassmorphism, custom scrollbar, cycling H2 colors
- **📊 Series Support** - Group related posts with progress tracking
- **🎯 Featured Posts** - Highlight your best content
- **💬 Related Posts** - Smart algorithm based on category and recency
- **🛠️ Powerful CLI** - Interactive tools for post management

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **Git**
- A text editor (VS Code, Neovim, etc.)
- Basic knowledge of Markdown

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/syzodidntmakeit/kawaiiblog.git
cd kawaiiblog
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

## 📝 Creating Your First Blog Post

### Using the CLI (Recommended)

```bash
npm run cli new
```

**Example Interactive Session:**
```
? Enter post title: My First Blog Post
? Select category: tech
? Enter excerpt: This is my awesome first blog post about web development
? Add image path (optional): 
```

This creates a new folder at `src/content/posts/YYYY-MM-DD-my-first-blog-post/index.md`

### Manual Creation

1. Create folder: `src/content/posts/2025-11-21-my-post/`
2. Add `index.md`:

```markdown
---
title: "My First Post"
date: 2025-11-21
category: tech
excerpt: "A brief description"
draft: false
featured: false
---

## Your Content Here

Write your post content in Markdown...
```

## 🎯 Managing Existing Posts

### Edit Post Metadata

```bash
npm run cli edit
```

**Example:**
```
? Select a post to edit:
  ❯ 2025-11-21 - My First Blog Post
    2025-11-20 - Another Post

? What would you like to edit?
  ❯ Title
    Date
    Category
    Excerpt
    All of the above
```

### List All Posts

```bash
npm run cli list
```

Output:
```
📚 All Blog Posts (3 total)

📝 My First Blog Post
   📅 2025-11-21 | 📂 tech | 📄 draft

📝 Another Post
   📅 2025-11-20 | 📂 music | ✅ published
```

### Search Posts

```bash
npm run cli search
```

## 🗑️ Deleting a Post

Posts can be deleted manually:

```bash
# Navigate to posts directory
cd src/content/posts

# Delete the post folder
rm -rf 2025-11-21-post-to-delete/
```

Or use PowerShell (Windows):
```powershell
Remove-Item -Recurse -Force "src\content\posts\2025-11-21-post-to-delete"
```

## 📦 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at http://localhost:4321 |
| `npm run build` | Build production site to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run cli new` | Create a new blog post (interactive) |
| `npm run cli edit` | Edit existing post metadata |
| `npm run cli list` | List all posts |
| `npm run cli search` | Search posts by content |
| `npm run astro ...` | Run Astro CLI commands directly |

## 📁 Project Structure

```
kawaiiblog/
├── .astro/                 # Astro cache (gitignored)
├── cli/                    # Custom CLI tools
│   ├── commands/
│   │   ├── new.ts         # Create new post
│   │   ├── edit.ts        # Edit post metadata
│   │   ├── list.ts        # List all posts
│   │   └── search.ts      # Search posts
│   └── kawaii-blog.ts     # Main CLI entry point
├── public/                 # Static assets
│   ├── images/            # Image files
│   ├── og-image.png       # Social preview image
│   └── robots.txt         # SEO robots file
├── src/
│   ├── components/        # Reusable Astro components
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
│   │   ├── posts/         # Your blog posts (Markdown)
│   │   │   └── YYYY-MM-DD-slug/
│   │   │       └── index.md
│   │   └── config.ts      # Content schema
│   ├── layouts/
│   │   ├── BaseLayout.astro    # Base page layout
│   │   └── PostLayout.astro    # Blog post layout
│   ├── pages/
│   │   ├── index.astro         # Homepage
│   │   ├── archive.astro       # All posts
│   │   ├── about.astro         # About page
│   │   ├── 404.astro           # Error page
│   │   ├── rss.xml.js          # RSS feed
│   │   ├── search-index.json.ts # Search data
│   │   └── posts/
│   │       └── [...slug].astro # Dynamic post pages
│   ├── styles/
│   │   ├── global.css     # Global styles + theme
│   │   └── critical.css   # Critical inline CSS
│   └── env.d.ts          # TypeScript definitions
├── astro.config.mjs      # Astro configuration
├── package.json          # Dependencies & scripts
├── tsconfig.json         # TypeScript config
└── README.md            # You are here!
```

## 🎨 Customization

### Change Theme Colors

Edit `src/styles/global.css`:

```css
:root {
  --bg: #0d011f;
  --text: #e5e7eb;
  --pink: #ffc0cb;
  --blue: #a7c7e7;
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

Edit `src/pages/index.astro` (lines 23-31):

```typescript
const timeBasedTitle = 
  hour >= 5 && hour < 11 ? "Your morning text" :
  hour >= 11 && hour < 17 ? "Your afternoon text" :
  // ... customize as needed
```

### Add New Categories

Edit `src/content/config.ts`:

```typescript
category: z.enum(['tech', 'music', 'games', 'commentary', 'YOUR_NEW_CATEGORY']),
```

## 🚀 Deployment

### GitHub Pages

Already configured! Just push to `main`:

```bash
git add .
git commit -m "New blog post"
git push origin main
```

GitHub Actions will automatically build and deploy to your custom domain.

### Manual Build

```bash
npm run build
```

Output goes to `dist/` directory.

## 🔮 Future Implementations

- [ ] **Comments System** - Integrate giscus (GitHub Discussions)
- [ ] **Newsletter** - Email subscription via ConvertKit/Mailchimp
- [ ] **Bookmark System** - Save favorite posts with localStorage
- [ ] **View Counter** - Track post views
- [ ] **TOC Mobile Toggle** - Collapsible table of contents on mobile
- [ ] **Search Highlighting** - Highlight matched terms in results
- [ ] **Image Optimization** - Auto-compress and convert to WebP
- [ ] **Analytics** - Privacy-friendly analytics (Plausible/Umami)
- [ ] **Webmentions** - IndieWeb interactions

## 🐛 Troubleshooting

### Build Fails with "Go program has already exited"

This is an Astro compiler issue. Try:

```bash
rm -rf node_modules .astro
npm install
npm run build
```

### Port 4321 Already in Use

Dev server will automatically use the next available port (4322, 4323, etc.)

### Search Not Working

Rebuild the search index:

```bash
npm run build
npm run dev
```

## 📄 License

MIT License - Feel free to use this for your own blog!

## 💖 Credits

Built with [Astro](https://astro.build) and a lot of caffeine.

---

**Live at**: https://blog.kawaii-san.org

**Questions?** Open an issue or submit a PR!
