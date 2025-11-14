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

## Quick Start

```bash
git clone https://github.com/<you>/kawaiiblog.git
cd kawaiiblog
npm install
cp .env.example .env   # optional – set SITE_URL
npm start              # serves http://localhost:3001
```

`npm start` runs `node server.js`, which serves everything from the repo root, including the generated `posts/*.json` files. For a purely static preview (closer to GitHub Pages), run `npx serve .` after `npm run build`.

## Project Scripts

| Command | Description |
| --- | --- |
| `npm start` | Runs the local Express server on port `3001` (honors `PORT`). |
| `npm run build:css` | Uses Tailwind/PostCSS to compile `styles/tailwind.css` → `assets/css/style.css`. |
| `npm run build:pages` | Renders `src/pages/**/*.html` through the partial system into the root `index.html`, `404.html`, and `pages/*.html`. |
| `npm run build:js` | Bundles/minifies each file in `src/js/` into `assets/js/`. |
| `npm run generate` | Executes `scripts/build-content.js`: optimizes per-post images, renders Markdown to HTML, rebuilds `posts/all-posts.json`, `posts/search-index.json`, `rss.xml`, `sitemap.xml`, and `robots.txt`. |
| `npm run build` | Convenience script that runs `build:css`, `build:pages`, `build:js`, and `generate` (use this before deploying). |
| `npm run post-create -- "Title"` | Calls `scripts/post-create-run.js`: scaffolds a dated folder in `posts/`, writes starter frontmatter, and reruns `npm run generate`. |

> Tip: if you change Markdown content or assets only, `npm run generate` is enough. If you tweak CSS/JS/pages, re-run `npm run build`.

## Writing Posts

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
   - Output mirrors the repo root (e.g. `src/pages/pages/about.html` → `pages/about.html`).

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

5. **Deployment**
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
