# 👾 KawaiiBlog

Repo for [blog.kawaii-san.org](https://blog.kawaii-san.org) — a no-framework, over-engineered static blog about tech, self-hosting, anime, music, and whatever else I'm yelling about this week. Everything lives in git, gets generated locally, and ships to GitHub Pages with a custom domain.

## ⚡ Project at a glance

- Markdown-first workflow: every post starts as `posts/DD-MM-YYYY/blog.md` with YAML front matter.
- `blog-to-site/generate.js` turns Markdown into static HTML, updates `posts/all-posts.json`, and rewrites both `rss.xml` and `sitemap.xml` so feeds stay synced.
- Homepage (`index.html`) and archive (`assets/archive.html`) fetch `posts/all-posts.json` client-side for live lists; individual posts are 100% static HTML.
- Styling relies on Tailwind via CDN for dev convenience plus a compiled `assets/css/style.css` generated from `source/css/input.css`.
- `assets/js/sw.js` handles lightweight offline caching; `assets/js/script.js`, `homepage.js`, and `archive.js` wire up UI, filtering, and sharing.
- Deploys to GitHub Pages straight from `main`, with the `CNAME` pinning `blog.kawaii-san.org`.

## 🗂️ Repository layout

```
.
├── assets/
│   ├── about.html · archive.html · contact.html
│   ├── css/style.css              # Tailwind build output
│   ├── js/
│   │   ├── homepage.js            # Renders latest 20 posts on landing page
│   │   ├── archive.js             # Search + sort UI for the archive view
│   │   ├── script.js              # Nav, share, and back-to-top helpers
│   │   ├── site-config.js         # Centralized metadata + helper funcs
│   │   └── sw.js                  # Service worker cache list
│   └── images/, favicon/, etc.
├── blog-to-site/
│   ├── new-post.js                # Interactive post scaffolder
│   ├── generate.js                # Markdown → HTML + JSON + feeds
│   ├── template.html/.md          # Layout + front-matter stencil
│   └── package*.json              # marked, inquirer, fast-xml-parser, etc.
├── posts/
│   ├── DD-MM-YYYY/                # blog.md source + generated index.html
│   └── all-posts.json             # Single source of truth for listings
├── source/css/input.css           # Tailwind entrypoint
├── index.html · 404.html · rss.xml · sitemap.xml
├── package.json                   # Tailwind build script
├── tailwind.config.js             # Purge paths + custom palette
└── LICENSE                        # AGPL-3.0 for code
```

## 🧰 Requirements

- Node.js 18+ (for ESM modules and the latest Tailwind CLI).
- npm (or pnpm/yarn if you tweak the scripts).
- A simple static file server for previewing (Python 3’s `http.server` is fine).
- Image editor if you care about banners (`assets/images/banners/*.webp`, 1200×630) and thumbnails (`assets/images/thumbnails/*.webp`, 384×384).

## 📦 Install & build

```bash
# Root dependencies (Tailwind CLI)
npm install

# Builder dependencies (run once)
cd blog-to-site
npm install
cd ..
```

Build or refresh the compiled stylesheet anytime Tailwind classes change:

```bash
npm run build:css
# Generates ./assets/css/style.css from ./source/css/input.css
```

> Tip: Tailwind also loads via CDN inside the HTML templates, so rebuilding `style.css` is primarily for production/Pages and for any custom CSS you keep outside of the CDN script.

## 📝 Daily workflow (new post → deploy)

1. **Sync main**  
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Scaffold the post** (from repo root or run `npm run new` inside `blog-to-site`):  
   ```bash
   node blog-to-site/new-post.js
   ```  
   Answer the title, category (`tech`, `commentary`, `anime`, `music`, `games`, `cars`, `lifting`, `other`), and excerpt prompts. This creates `posts/DD-MM-YYYY/blog.md` from `template.md`.
3. **Write** inside the newly created `blog.md`. Keep the YAML front matter intact; the generator expects `id`, `title`, `date`, `category`, and `excerpt`.
4. **Add media** (optional but recommended):  
   - Banner → `assets/images/banners/DD-MM-YYYY.webp` (1200×630).  
   - Thumbnail → `assets/images/thumbnails/DD-MM-YYYY.webp` (384×384).  
   - Extra figures can live alongside the post folder.
5. **Generate HTML + metadata**  
   ```bash
   node blog-to-site/generate.js posts/DD-MM-YYYY/blog.md
   ```  
   This command:
   - Produces `posts/DD-MM-YYYY/index.html` using `template.html`.
   - Rewrites `posts/all-posts.json` (latest post is unshifted to the top).
   - Updates `rss.xml` and `sitemap.xml` via `fast-xml-parser`.
6. **CSS (if needed)** — run `npm run build:css` after touching classes or `tailwind.config.js`.
7. **Preview locally**  
   ```bash
   python -m http.server 8000
   # open http://localhost:8000
   ```  
   Smoke test the homepage, archive filters/search, and the new `/posts/DD-MM-YYYY/` page. The homepage only renders the latest 20 posts, so make sure your new one shows up there.
8. **Commit & push**  
   ```bash
   git checkout -b new-post/my-slug   # optional but polite
   git add .
   git commit -m "feat: add <post title>"
   git push origin new-post/my-slug
   ```  
   Merge or push straight to `main`; GitHub Pages auto-publishes and respects the `CNAME`.

## 🧠 Runtime details

- `posts/all-posts.json` is the single data file both `homepage.js` (shows the latest 20 posts + category filters) and `archive.js` (full list with search + newest/oldest toggle) read via `fetch`.
- `assets/js/script.js` handles nav toggles, share buttons (Web Share API + clipboard fallback), and the “back to top” control.
- `assets/js/site-config.js` centralizes metadata used by the front end (site name, author info, meta description helpers) and exposes helper functions other scripts can call.
- `assets/js/sw.js` is registered in every HTML shell and caches the core routes (home, archive, about, contact, CSS, JS bundle, and `posts/all-posts.json`) for basic offline resilience.
- `blog-to-site/template.html` bakes in Schema.org JSON-LD, Open Graph tags, service-worker registration, and the global header/footer. The Markdown renderer in `generate.js` customizes headings, lists, blockquotes, and image wrappers so the posts inherit the site’s Tailwind styles.

## 🚢 Deployment

- Hosting: GitHub Pages (static).  
- Branch: `main` → Pages.  
- Domain: `blog.kawaii-san.org` via `CNAME`.  
- Because list pages fetch JSON at runtime, adding a post only requires the generator to touch the post folder + JSON + feeds; there’s no global rebuild step beyond committing those files.

## 🧭 Roadmap / nice-to-haves

- [ ] CSS: add a purge/minify step so `assets/css/style.css` only ships used utilities.
- [ ] JS: bundle/minify `assets/js/*.js` (esbuild/terser) before deploy.
- [ ] Images: generate responsive `<picture>`/`srcset` variants for banners and thumbnails.
- [ ] Search: upgrade archive search to full-text (Pagefind/Lunr/etc.).
- [ ] Comments: experiment with Giscus or a lightweight alternative inside `template.html`.
- [ ] Accessibility: add “skip to content”, audit contrast, and ensure focus states everywhere.

## 🔒 Privacy & licensing

- **Code**: [AGPL-3.0](LICENSE) — share alike, even when running it as a service.  
- **Blog content**: [CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/).  
- **Telemetry**: none. No analytics, no trackers, no cookies beyond what your browser needs to exist.  
- **Feeds**: `/rss.xml` and `/sitemap.xml` stay in the repo so you can diff every change.

Go build, rant, repeat. 💀
