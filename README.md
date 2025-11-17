# KawaiiBlog

KawaiiBlog is a handcrafted static(ish) blog that keeps authoring fun: write Markdown, run one command, and ship a bundle of pre-rendered HTML, RSS/Sitemap metadata, and playful Tailwind styles. The codebase is intentionally small, but includes enough automation to feel like a modern JAMstack workflow without extra tooling.

## Features

- **Markdown-first publishing** – Each post lives in `posts/YYYY-MM-DD/blog.md` with YAML frontmatter; build scripts turn it into HTML plus JSON, RSS, and search indexes.
- **Tailwind + custom palette** – `tailwind.config.js` defines the kawaii color suite (pink/blue/mint/lilac/cream/etc.) and fonts, then `styles/tailwind.css` is compiled into `assets/css/style.css`.
- **Composable HTML** – Source pages under `src/pages/` use `{{> header}}`/`{{> footer}}` partials and are rendered into the root `/index.html`, `/404.html`, and `/pages/*.html`.
- **Asset pipeline** – `scripts/build-js.js` minifies the browser JS, `scripts/tasks/optimizeImages.js` compresses per-post images via Sharp, and `scripts/utils/posts.js` decorates headings with rotating color accents.
- **Local Node server + static deploy** – `npm start` serves the repo with a tiny Express server; production deploys simply commit the generated files (works great for GitHub Pages or any static host).

## Requirements

- Node.js 18+ (ships with npm 9+)
- macOS/Linux/WSL shell with `bash`
- Optional: `.env` file with `SITE_URL=https://your-domain.example` (defaults to `http://localhost:3001`)

## Local Setup

1. **Clone + install**
   ```bash
   git clone https://github.com/<you>/kawaiiblog.git
   cd kawaiiblog
   npm install
   ```
2. **Configure (optional)**
   - Copy `.env.example` to `.env`.
   - Set `SITE_URL=https://your-domain.example` to control RSS/Sitemap links.
3. **Preview**
   ```bash
   npm start         # dev server with compression & caching headers
   # or
   npm run preview   # npm run build + node server.js
   ```
   For a pure static preview (closer to GitHub Pages), run `npm run build` followed by `npx serve .` or any static HTTP server.

## Project Scripts

| Command | Description |
| --- | --- |
| `npm start` | Runs the local Express server on port `3001` (honors `PORT`). |
| `npm run build:css` | Uses Tailwind/PostCSS to compile `styles/tailwind.css` → `assets/css/style.css`. |
| `npm run build:pages` | Renders `src/pages/**/*.html` through the partial system into the root `index.html`, `404.html`, and `pages/*.html`. |
| `npm run build:js` | Bundles/minifies each file in `src/js/` into `assets/js/`. |
| `npm run generate` | Executes `scripts/build-content.js`: optimizes per-post images, renders Markdown to HTML, rebuilds `posts/all-posts.json`, `posts/search-index.json`, `rss.xml`, `sitemap.xml`, and `robots.txt`. |
| `npm run build` | Runs `build:pages`, `build:assets` (css+js), `generate`, and `rev-assets` (use this before deploying). |
| `npm run rev-assets` | Computes content hashes for CSS/JS bundles, writes `assets/asset-manifest.json`, and updates every HTML/`sw.js` reference with cache-busting query strings. |
| `npm run preview` | Builds the site and starts the production server so you can spot-check the hashed output locally. |
| `npm run post-create -- "Title"` | Calls `scripts/post-create-run.js`: scaffolds a dated folder in `posts/`, writes starter frontmatter, and reruns `npm run generate`. |

> Tip: if you change Markdown content or assets only, `npm run generate` is enough. If CSS/JS/pages change, run `npm run build` (which refreshes the hashed bundle references).

## Running Tests

```bash
npm test
```

- Uses Node’s built-in test runner (`node --test`).
- Suites live in `tests/*.test.js` and cover the content loader, sitemap/RSS writers, homepage prerender, and build cache helpers.
- Extend this folder with new tests whenever you add scripts—CI runs `npm test` automatically.

## Writing a Blog Post

1. **Create a post folder**
   ```bash
   npm run post-create -- "Why Arch Is Cute"
   ```
   This creates `posts/YYYY-MM-DD/` with `blog.md` and placeholder metadata.

2. **Edit `blog.md`**
   ```markdown
   ---
   id: 'arch-cute'
   title: "Why Arch Is Cute"
   date: '2025-01-12'
   category: 'tech'
   excerpt: "Playful rant about tiling window managers."
   ---
   Content goes here in Markdown…
   ```
   - `category` should align with the homepage filter buttons (e.g. `tech`, `commentary`, etc.).
   - Only ASCII is required, but Markdown supports code fences, links, etc.

3. **Add media**
   Place `.png/.jpg/.jpeg/.webp` files in the same folder. Reference them relatively (`![alt](./screenshot.png)`). The build will run Sharp to compress them in-place.

4. **Regenerate**
   ```bash
   npm run generate
   ```
   You now have:
   - `posts/<folder>/index.html` (ready-to-serve post)
   - Updated `posts/all-posts.json` (homepage/archive feed)
   - Updated `posts/search-index.json` (full-text search)
   - Updated `rss.xml`, `sitemap.xml`, `robots.txt`

## How the Build Works

1. **Page rendering** (`npm run build:pages`)
   - `scripts/build-pages.js` copies `src/pages/**/*.html`.
   - Before writing, it passes each file through `scripts/utils/partials.js`, replacing `{{> header}}`/`{{> footer}}` with the actual partial HTML in `src/partials/`.
   - Output mirrors the repo root (e.g. `src/pages/pages/uses.html` → `pages/uses.html`).

2. **CSS** (`npm run build:css`)
   - Tailwind scans `content` globs in `tailwind.config.js` for class usage (HTML, Markdown output, JS templates).
   - Colors (like `kawaii-lilac`, `kawaii-cream`, etc.) are declared under `theme.extend.colors`.
   - PostCSS + autoprefixer write the final file to `assets/css/style.css`.

3. **JavaScript** (`npm run build:js`)
   - `scripts/build-js.js` minifies each `src/js/*.js` (homepage filters, search, archive, etc.) and writes to `assets/js/`.
   - The HTML pages reference these built files under `/assets/js/*.js`.

4. **Content pipeline** (`npm run generate`)
   - `scripts/utils/posts.js` walks all dated folders inside `posts/`.
   - Markdown is parsed with `gray-matter` + `marked`; headings get colored accents via `decorateHeadings`.
   - `scripts/tasks/renderPosts.js` wraps the post HTML using `templates/post.html`.
   - `scripts/tasks/writePostsJson.js` and `writeSearchIndex.js` serialize metadata to the JSON files used by the UI.
   - `scripts/tasks/writeRss.js` and `writeSiteMetadata.js` emit the feed + sitemap/robots using `SITE_URL`.
   - `scripts/tasks/optimizeImages.js` compresses local images with Sharp (lossless for PNG, quality-controlled for JPEG/WebP).

5. **Asset revision** (`npm run rev-assets`)
   - `scripts/tasks/revisionAssets.js` hashes `assets/css/style.css` and every JS bundle.
   - It writes `assets/asset-manifest.json` for reference and rewrites every HTML page plus `sw.js` so URLs become `/assets/css/style.css?v=<hash>`.
   - Browsers can now cache assets for a long time without risking stale content, because any change updates the query string.

6. **Deployment**
   - Everything needed for hosting lives in the repo: commit `index.html`, `404.html`, `pages/`, `assets/`, `posts/`, `rss.xml`, `sitemap.xml`, `robots.txt`.
   - On GitHub Pages, the repo root is served as static files (no Node needed).

## Directory Tour

```
.
├── assets/                # Build output (css, js, images, favicons)
│   ├── css/style.css
│   └── js/*.js
├── posts/
│   ├── YYYY-MM-DD/        # One folder per post (blog.md + assets + generated index.html)
│   ├── all-posts.json     # Homepage/archive feed
│   └── search-index.json  # Search data
├── src/
│   ├── js/                # Human-friendly JS before minification
│   ├── pages/             # Source HTML (mirrors output)
│   └── partials/          # Shared header/footer
├── scripts/               # Node build helpers
│   ├── build-content.js
│   ├── build-js.js
│   ├── build-pages.js
│   ├── new-post.js
│   └── tasks/*.js
├── styles/tailwind.css    # Tailwind entry file
├── tailwind.config.js
├── server.js              # Local dev server
└── package.json

## Code Walkthrough

- **server.js** – Thin HTTP server that serves everything in the repo with sane cache headers, ETags, and optional Brotli/gzip compression. Perfect for local previews or deploying to a simple VPS.
- **scripts/build-content.js** – Main orchestrator. Loads posts, optimizes their media, renders HTML via `templates/post.html`, writes JSON/search/RSS/sitemap artifacts, and injects prerendered cards into `index.html`.
- **scripts/tasks/** – Decomposed helpers: `renderPosts` handles incremental post rendering with `.build-cache.json`, `writePostsJson`/`writeSearchIndex` handle homepage/search data, `writeRss`/`writeSiteMetadata` emit syndication metadata, `optimizeImages` uses Sharp, and `revisionAssets` adds cache-busting query strings.
- **src/js/** – Browser behavior for the homepage filters, archive sorting, search UI, and shared nav/back-to-top logic. Each file is bundled/minified into `assets/js/*.js` via `scripts/build-js.js`.
- **sw.js** – Service worker that precaches the shell and uses a network-first strategy for the JSON feeds so repeated visits get fresh posts but still work offline.
- **tests/** – Node test suites verifying core generators (posts loader, sitemap/RSS builders, homepage prerender, build cache state). Add new tests alongside any new scripts.
```

## Configuration Notes

- **Environment** – `.env` only needs `SITE_URL`. When absent, `http://localhost:3001` is used for RSS/sitemaps.
- **Colors** – Update `tailwind.config.js -> theme.extend.colors` to tweak the palette; the classes are available everywhere (including Markdown headings thanks to `decorateHeadings`).
- **Fonts** – `styles/tailwind.css` imports Google Fonts. Edit the `@import` line or Tailwind `fontFamily` config to change typography.
- **Categories/Filters** – The homepage filter buttons (`index.html:34-64`) are hard-coded. If you add categories, update both the buttons and any copy referencing them.
- **Service Worker** – `sw.js` is registered on each page for caching; adjust it if you change asset locations.

## Deployment Workflow

1. Run `npm run build`.
2. Verify the site locally (`npm start` or `npx serve .`).
3. Commit the repo (include generated files). Example:
   ```bash
   git add .
   git commit -m "Publish new post"
   git push origin main
   ```
4. Configure your host (GitHub Pages / Cloudflare Pages / Netlify) to serve the repo root.

## Troubleshooting

- **Missing styles/classes** – Ensure the file containing the class is referenced inside `tailwind.config.js -> content`. Add extra globs if you create new folders.
- **RSS/Sitemap uses `http://localhost`** – Set `SITE_URL` in `.env` before running `npm run build`. Regenerate `rss.xml` and `sitemap.xml`.
- **Large images** – Drop them into the post folder before running `npm run generate` so the Sharp optimizer can resize/compress. Already-generated posts will keep whatever binaries exist, so delete/re-add the original if needed.
- **Search returns nothing** – The search page (`pages/search.html`) fetches `/posts/search-index.json`; ensure `npm run generate` was run and the JSON file is committed/deployed.

## License

MIT – see [`LICENSE`](LICENSE). Content you write in `posts/` remains yours; update the footer text if you want to change licensing for blog content.
