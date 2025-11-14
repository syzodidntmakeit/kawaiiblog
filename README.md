# KawaiiBlog

A personal blog website built from scratch to be lightweight, stylish, and easy to manage. This project focuses on a simple content creation workflow and local hosting capabilities.

## About the Website

KawaiiBlog is designed for personal blogging with a minimalist approach. It features:

*   **Lightweight & Stylish:** Built with a focus on performance and a clean, modern aesthetic using Tailwind CSS.
*   **Simple Content Workflow:** Blog posts are written in Markdown with YAML frontmatter for metadata.
*   **Local Hosting:** A custom Node.js server allows for easy local development and deployment.
*   **Dynamic Content Generation:** Scripts automatically generate `all-posts.json` (for homepage/archive) and `rss.xml` from your Markdown posts.

## User Guide: How to Use KawaiiBlog

### 1. Getting Started (Local Development)

1.  **Clone & install**
    ```bash
    git clone [repository-url]
    cd kawaiiblog
    npm install
    ```
2.  **Set environment variables (optional but recommended)**
    ```bash
    cp .env.example .env
    ```
    Set `SITE_URL` to the canonical URL you plan to deploy to (e.g., `https://kawaii-san.org`). When `.env` is missing the site falls back to `http://localhost:3001`.
3.  **Start the dev server**
    ```bash
    npm start
    ```
    Open `http://localhost:3001` to browse the site locally.

### 2. Creating a New Blog Post

1.  **Generate the post scaffolding**
    ```bash
    npm run post-create -- "Your Awesome Post Title"
    ```
    This script:
    - Creates a new folder inside `posts/` using the current date as `YYYY-MM-DD`
    - Adds `blog.md` with prefilled frontmatter (`id`, `title`, `date`, `category`, `excerpt`)
    - Runs `npm run generate` so the new Markdown immediately becomes `posts/<date>/index.html`, `posts/all-posts.json`, `posts/search-index.json`, and updates `rss.xml`, `sitemap.xml`, `robots.txt`

2.  **Write your content**

    Open the generated `posts/YYYY-MM-DD/blog.md` and replace the placeholder content. Keep the YAML block at the top and make sure `category` matches one of your filters (`tech`, `commentary`, etc.). Example frontmatter:
    ```markdown
    ---
    id: 'your-post-slug'
    title: "Your Awesome Post Title"
    date: 'YYYY-MM-DD'
    category: 'tech'
    excerpt: "A short, engaging summary of your blog post content."
    ---
    ```

3.  **Add images (optional)**

    Drop `.png`, `.jpg`, `.jpeg`, or `.webp` files into the same `posts/YYYY-MM-DD/` folder as your Markdown and reference them relatively:
    ```markdown
    ![Desk setup](./desk-setup.jpg)
    ```
    The build automatically compresses those images in place using Sharp, so you get smaller payloads without changing your Markdown links.

4.  **Regenerate after edits**

    Anytime you change `blog.md`, rerun:
    ```bash
    npm run generate
    ```
    That rebuilds every post’s HTML plus the JSON feed, RSS, search index, sitemap, and robots file.

### 3. Building Assets & Deploying

Before pushing to production (or whenever you tweak CSS/JS), run the full build:

```bash
npm run build
```

This executes:
- `npm run build:pages` – assembles `src/pages/**/*.html` with the shared header/footer partials into the deployable `/index.html`, `/404.html`, and `/pages/**/*.html`.
- `npm run build:css` – runs Tailwind+PostCSS from `styles/tailwind.css` into `assets/css/style.css`.
- `npm run build:js` – minifies everything under `src/js/` into `assets/js/`.
- `npm run generate` – optimizes any images that live next to your Markdown posts, renders each `blog.md` to HTML, and refreshes `posts/all-posts.json`, `posts/search-index.json`, `rss.xml`, `sitemap.xml`, and `robots.txt`.

Commit the resulting artifacts (`index.html`, `404.html`, `pages/**/*.html`, `assets/css`, `assets/js`, `posts/*.json`, `rss.xml`, `sitemap.xml`, `robots.txt`) so GitHub Pages can serve them without running Node.

### 4. File Structure Overview

Here's a brief overview of the key directories and files:

*   `assets/`: Build output for CSS/JS and static images.
    *   `assets/css/style.css`: Compiled Tailwind stylesheet.
    *   `assets/js/`: Minified browser scripts (built from `src/js/`).
    *   `assets/images/`: Optimized images (site-wide plus per-post assets).
*   `index.html`: Homepage served at `/` (generated from `src/pages/index.html`).
*   `404.html`: Custom not-found page (generated from `src/pages/404.html`).
*   `pages/`: Compiled HTML pages (archive, about, contact, uses, search). Edit the source versions under `src/pages/pages/`.
*   `posts/`: This directory stores all your blog posts.
    *   `posts/YYYY-MM-DD/`: Each subdirectory represents a single blog post, named by its creation date (ISO format).
        *   `blog.md`: The Markdown file containing the post's content and YAML frontmatter.
        *   `index.html`: The generated static HTML created from `blog.md` and the template.
    *   `posts/all-posts.json`: Metadata for all posts, used by the homepage/archive filters.
    *   `posts/search-index.json`: Full-text index consumed by the search page.
*   `styles/tailwind.css`: Tailwind entry point (source) used by the build pipeline.
*   `src/js/`: Source JavaScript (human friendly, pre-minified).
*   `src/pages/`: All authored HTML pages, organized just like the final output.
*   `src/partials/`: Shared header/footer partials you can embed with `{{> header}}` and `{{> footer}}`.
*   `templates/`: Contains HTML templates used by the server for dynamic content (e.g., `post.html`).
*   `server.js`: The custom Node.js server that serves the website.
*   `scripts/`: Node helpers and build orchestration.
    *   `scripts/build-pages.js`: Copies `src/pages` + partials into the deployable HTML files.
    *   `scripts/build-content.js`: Loads every Markdown post once, optimizes local images, renders HTML, and writes JSON/RSS/sitemap/search data.
    *   `scripts/new-post.js`: CLI that creates a new dated post folder with starter frontmatter.
    *   `scripts/post-create-run.js`: Wrapper that runs `new-post` and immediately regenerates the site.
    *   `scripts/build-js.js`: Minifies JavaScript from `src/js/` into `assets/js/`.
    *   `scripts/tasks/*`: Granular build steps (render posts, build feeds, compress images, etc.).
*   `package.json`: Project metadata and scripts.
*   `rss.xml`: The RSS feed generated from your posts.
*   `sitemap.xml` & `robots.txt`: Generated files to help search engines discover your pages/posts.

### 6. Testing & Optimization Checklist

Use this quick list before publishing a new batch of posts or styling changes:

1. **Build everything locally**
    ```bash
    npm run build
    ```
    Verify `assets/css/style.css`, `assets/js/*.js`, `posts/*.json`, `rss.xml`, `sitemap.xml`, and `robots.txt` are updated.
2. **Spot-check pages**
    ```bash
    npm start
    ```
    Browse `http://localhost:3001` (home, archive, search, a few posts) to ensure nav state, reading times, and newly uploaded images render correctly.
3. **Validate generated data**
    - Open `posts/all-posts.json` and `posts/search-index.json` to ensure the latest post metadata is present (correct category, excerpt, readingMinutes).
    - Confirm `rss.xml` links point to the proper `SITE_URL`.
4. **Run Lighthouse / performance tests**
    - In Chrome dev tools, run Lighthouse against the local build (desktop + mobile). Pay attention to bundle size, unused JS/CSS, and accessibility hints.
5. **Optional: test a static export**
    ```bash
    npx serve .
    ```
    Serve the folder as static files to mimic GitHub Pages and validate service worker caching plus routing.

## Licensing

This project is open-sourced under the MIT License (see `LICENSE`). Update the copyright line with your preferred name or handle if needed.

## Optimization Notes

*   **Minification:** For production, consider minifying CSS and JavaScript assets to reduce file sizes.
*   **Static Site Generation (SSG):** For better performance and scalability, converting the entire site to static HTML files (using tools like Eleventy, Next.js, or Astro) is highly recommended. This eliminates the need for a Node.js server for serving content.
