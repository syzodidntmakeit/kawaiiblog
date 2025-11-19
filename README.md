# KawaiiBlog

KawaiiBlog is a static-first publishing stack: write Markdown, run one build, and get a deployable directory with prerendered posts, hashed assets, an RSS feed, and sitemap/robots metadata. The tooling is small enough to understand in an afternoon but covers the full authoring workflow end to end.

## Table of Contents
- [Quick Start](#quick-start)
- [Requirements](#requirements)
- [Everyday Workflow](#everyday-workflow)
- [Available Commands](#available-commands)
- [How the Code Works](#how-the-code-works)
- [Writing Posts](#writing-posts)
- [Project Layout](#project-layout)
- [Configuration](#configuration)
- [Testing & QA](#testing--qa)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Quick Start
1. **Clone & install**
   ```bash
   git clone https://github.com/<you>/kawaiiblog.git
   cd kawaiiblog
   npm install
   ```
2. **Configure (optional)**
   - Copy `.env.example` → `.env`.
   - Set `SITE_URL=https://your-domain.example` so RSS/sitemap links point to production rather than `http://localhost:3001`.
3. **Preview the site**
   ```bash
   npm start        # local server with gzip/Brotli + caching headers
   # or
   npm run preview  # npm run build + start the production server
   ```

## Requirements
- Node.js 18+ (ships with npm 9+)
- macOS/Linux/WSL terminal with `bash`
- Optional native deps for [Sharp](https://sharp.pixelplumbing.com/) (already bundled for most platforms)

## Everyday Workflow
1. **Write** – `npm run post-create -- "My Title"` scaffolds `posts/YYYY-MM-DD/` with starter frontmatter and reruns `npm run generate`.
2. **Edit Markdown** – open `posts/<date>/blog.md`, update `excerpt`, `category`, and body text. Drop supporting images in the same folder.
3. **Preview** – `npm start` (serves the repo) or `npm run preview` (full build first). The homepage filters and cards are prerendered so you see exactly what ships.
4. **Publish** – `npm run build`, sanity check the generated HTML/posts/rss/sitemap, then commit/push. Deploy by serving the repo root through any static host (GitHub Pages, Netlify, Cloudflare Pages, S3, etc.).

## Available Commands
| Command | Description |
| --- | --- |
| `npm start` | Runs `server.js`, a tiny Express server with compression + caching headers (defaults to port `3001`, honors `PORT`). |
| `npm run preview` | Builds everything, then starts the server so you verify the hashed output exactly as it will deploy. |
| `npm run new-post` | Calls `scripts/new-post.js`; same as `post-create` but without rerunning the build (used by CI/scripts). |
| `npm run post-create -- "Title"` | Scaffolds `posts/YYYY-MM-DD/` with starter `blog.md`, runs `npm run generate`, and prints the new folder path. |
| `npm run build:pages` | Renders `src/pages/**/*.html` with partials into `index.html`, `404.html`, and `pages/*.html`. |
| `npm run build:css` | Tailwind/PostCSS pipeline: `styles/tailwind.css` → `assets/css/style.css` (minified). |
| `npm run build:js` | Bundles/minifies every file in `src/js/` into `assets/js/*.js`. |
| `npm run build:assets` | Convenience script for `build:css` + `build:js`. |
| `npm run generate` | Content build: optimizes per-post media with Sharp, renders Markdown → HTML, writes `posts/all-posts.json`, `posts/search-index.json`, prerenders homepage cards + filters, and emits `rss.xml`, `sitemap.xml`, and `robots.txt`. |
| `npm run rev-assets` | Hashes `assets/css/style.css` + JS bundles, writes `assets/asset-manifest.json`, and rewrites every HTML/`sw.js` reference with cache-busting `?v=<hash>`. |
| `npm run build` | Full production build: `build:pages` → `build:assets` → `generate` → `rev-assets`. Run before every deploy. |
| `npm test` | Executes `node --test` suites under `tests/` (covers post loading, RSS/sitemap builders, homepage injection, etc.). |

> Tip: If you only edited Markdown or post assets, `npm run generate` is enough. CSS/JS/template changes need the full `npm run build` so cache-busted URLs stay in sync.

## How the Code Works
### Source vs Generated Files
- **Source** – `src/pages/**/*.html` (with `{{> navigation}}` partials), `src/js/`, `styles/tailwind.css`, and the Markdown posts under `posts/YYYY-MM-DD/blog.md`.
- **Generated** – `index.html`, `pages/*.html`, `posts/<date>/index.html`, `assets/css/style.css`, `assets/js/*.js`, `posts/all-posts.json`, `posts/search-index.json`, `rss.xml`, `sitemap.xml`, `robots.txt`, and hashed asset references in every HTML file.

### Content Build Pipeline (`npm run generate`)
1. `loadPosts()` (in `scripts/utils/posts.js`) parses each `blog.md`, normalizes dates/categories/excerpts, and decorates Markdown headings with Tailwind accent classes.
2. `optimizeImages()` compresses any images sitting next to the Markdown using Sharp.
3. `renderPosts()` applies `templates/post.html` to every post folder and writes `index.html` beside the Markdown.
4. `writePostsJson()` + `writeSearchIndex()` emit `posts/all-posts.json` (homepage/archive feed) and `posts/search-index.json` (full-text search data).
5. `injectHomepageData()` prerenders the homepage cards **and** now derives the filter buttons directly from `all-posts.json`, so any new category automatically appears in the UI.
6. `writeRss()` and `writeSiteMetadata()` regenerate `rss.xml`, `sitemap.xml`, and `robots.txt` using `SITE_URL`.

### Assets & Cache Busting
- `npm run build:css` – Tailwind + PostCSS compile the custom palette/typography into `assets/css/style.css`.
- `npm run build:js` – Each `src/js/*.js` file becomes an individual minified bundle in `assets/js/` (no bundler magic, just terser).
- `npm run rev-assets` – Hashes CSS/JS, writes `/assets/asset-manifest.json`, and rewrites every HTML (plus the service worker) so `<link rel="stylesheet" href="/assets/css/style.css?v=<hash>" />` always points to the latest build.

### Client-Side Behavior
Minimal JS powers:
- Homepage filters + lazy loading (`src/js/homepage.js`). Uses the preloaded JSON injected into the HTML; falls back to fetching `/posts/all-posts.json` when needed.
- Archive sorting (`src/js/archive.js`), search UI (`src/js/search.js`), and shared nav/back-to-top helpers (`src/js/script.js`).
- `sw.js` registers a service worker to precache the shell and prefer network-first for JSON feeds so returning visitors see fresh posts.

## Writing Posts
1. **Scaffold**
   ```bash
    npm run post-create -- "Why Arch Rules"
   ```
   The command prints the folder path (e.g., `posts/2025-02-14/`).
2. **Fill in frontmatter**
   ```yaml
   ---
   id: arch-rules
   title: Why Arch Rules
   date: 2025-02-14
   category: tech         # lowercase; filters are generated from these values
   excerpt: "Playful rant about tiling window managers."
   ---
   ```
3. **Write Markdown** – Standard CommonMark with fenced code blocks, images (`![alt](./diagram.png)`), quotes, etc.
4. **Add assets** – Drop screenshots/audio/etc. in the same folder; they ship as-is after Sharp optimizes images.
5. **Regenerate** – `npm run generate` to refresh HTML, JSON feeds, RSS, and sitemap entries.

The homepage, archive, search, RSS, and sitemap automatically pick up the new post—no manual editing of buttons or metadata required.

## Project Layout
```
.
├── assets/                # Generated CSS/JS + favicons
│   ├── css/style.css
│   └── js/{homepage,archive,search,script}.js
├── posts/
│   ├── YYYY-MM-DD/        # One folder per post (blog.md + generated index.html + media)
│   ├── all-posts.json     # Homepage/archive feed consumed by JS and prerender step
│   └── search-index.json  # Search data fetched by /pages/search.html
├── src/
│   ├── js/                # Human-readable JS before minification
│   ├── pages/             # Source HTML with partials/templating placeholders
│   └── partials/          # Shared header/footer HTML chunks
├── templates/post.html    # Post layout consumed by renderPosts()
├── scripts/               # Build + helper scripts (content pipeline, asset revision, etc.)
├── styles/tailwind.css    # Tailwind entry file (imports fonts + utilities)
├── tailwind.config.js     # Palette, fonts, and content globs
├── server.js              # Local Express server with compression + caching
└── package.json
```

## Configuration
- `.env` (optional) – set `SITE_URL` to your production domain before running `npm run build` so RSS/sitemap/robots reference the right host.
- `tailwind.config.js` – tweak colors or fonts; all HTML (including rendered Markdown headings) uses the custom palette.
- `styles/tailwind.css` – import new fonts or add base styles/utilities.
- `sw.js` – adjust caching strategy if asset paths change.

## Testing & QA
- `npm test` runs Node’s built-in test runner across `tests/*.test.js` (post loader, RSS, sitemap, homepage injection, and cache behavior).
- `npm run build` is the best pre-deploy check: it ensures Tailwind/Terser succeed, Sharp has the needed native binaries, homepage placeholders are filled, and metadata files are rewritten.

## Deployment
1. `npm run build`
2. Preview locally via `npm run preview` or `npx serve .`
3. Commit everything (generated HTML/JSON/XML/asset-manifest included):
   ```bash
   git add .
   git commit -m "Publish new post"
   git push origin main
   ```
4. Point your static host (GitHub Pages, Cloudflare Pages, Netlify, Fly.io static, etc.) at the repo root. No runtime Node server is required—the generated files are static.

## Future Planning
1. **Template-aware rebuilds** – `scripts/tasks/renderPosts.js` currently caches renders solely on the Markdown mtime, so editing `templates/post.html` or any partial requires manually deleting `.build-cache.json`. Capturing the template/partial hash (or the files’ mtimes) in the cache would make `npm run generate` automatically re-render every post whenever shared layout changes.
2. **Improve nav accessibility** – `src/partials/navigation.html` toggles the hamburger menu visually, but the button never updates `aria-expanded`/`aria-controls`, and the hidden menu isn’t announced to screen readers. Adding those attributes plus focus-trap/escape handlers in `src/js/script.js` would make the new navigation UX friendlier for keyboard and assistive tech users.

## Troubleshooting
- **RSS/Sitemap show `http://localhost`** – Set `SITE_URL` in `.env`, rerun `npm run build`, and commit the regenerated files.
- **Filters look wrong** – Run `npm run generate`; the filter buttons are derived from `posts/all-posts.json`, so stale builds usually mean the content pipeline wasn’t executed after editing posts.
- **Tailwind class not applied** – Make sure the source file path is included in `tailwind.config.js -> content` globs, then rerun `npm run build:css` (or the full build).
- **Sharp errors on build** – Delete `node_modules` and reinstall, or install the platform-specific libvips dependencies noted in the Sharp docs.
- **Search page empty** – Ensure `posts/search-index.json` exists (rerun `npm run generate`) and that your host serves JSON with correct MIME type.

---

MIT Licensed. Blog content you place under `posts/` remains your own—update the footer/licensing copy if you need different terms for prose.
