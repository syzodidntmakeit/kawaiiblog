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

3.  **Regenerate after edits**

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
- `npm run build:css` (Tailwind/PostCSS → `assets/css/style.css`)
- `npm run build:js` (Terser minification → `assets/js/*.js`)
- `npm run generate` (renders posts + JSON feeds + SEO artifacts)

Commit the resulting artifacts (`assets/css`, `assets/js`, `posts/*.json`, `rss.xml`, `sitemap.xml`, `robots.txt`) so GitHub Pages can serve them without running Node.

### 4. File Structure Overview

Here's a brief overview of the key directories and files:

*   `assets/`: Build output for CSS/JS and static images.
    *   `assets/css/style.css`: Compiled Tailwind stylesheet.
    *   `assets/js/`: Minified browser scripts (built from `src/js/`).
    *   `assets/images/`: Image files.
*   `index.html`: Homepage served at `/`.
*   `404.html`: Custom not-found page used locally and by GitHub Pages.
*   `pages/`: Contains the rest of the HTML pages of the website (e.g., `about.html`, `archive.html`, `contact.html`, `uses.html`, `search.html`).
*   `posts/`: This directory stores all your blog posts.
    *   `posts/YYYY-MM-DD/`: Each subdirectory represents a single blog post, named by its creation date (ISO format).
        *   `blog.md`: The Markdown file containing the post's content and YAML frontmatter.
        *   `index.html`: The generated static HTML created from `blog.md` and the template.
    *   `posts/all-posts.json`: Metadata for all posts, used by the homepage/archive filters.
    *   `posts/search-index.json`: Full-text index consumed by the search page.
*   `styles/tailwind.css`: Tailwind entry point (source) used by the build pipeline.
*   `src/js/`: Source JavaScript (human friendly, pre-minified).
*   `templates/`: Contains HTML templates used by the server for dynamic content (e.g., `post.html` for rendering individual blog posts dynamically if `index.html` is not found).
*   `server.js`: The custom Node.js server that serves the website.
*   `render-posts.js`: Script that converts each `blog.md` into an `index.html` using the shared template.
*   `generate-posts-json.js`: Script to generate `posts/all-posts.json`.
*   `generate-rss.js`: Script to generate `rss.xml`.
*   `generate-search-index.js`: Script to build the search index JSON file.
*   `generate-site-metadata.js`: Script to create `sitemap.xml` and `robots.txt`.
*   `new-post.js`: Script used by `post-create` to create new post files.
*   `post-create-run.js`: Wrapper script for `new-post.js` and `npm run generate`.
*   `package.json`: Project metadata and scripts.
*   `rss.xml`: The RSS feed generated from your posts.
*   `sitemap.xml` & `robots.txt`: Generated files to help search engines discover your pages/posts.

## Optimization Notes

*   **Minification:** For production, consider minifying CSS and JavaScript assets to reduce file sizes.
*   **Static Site Generation (SSG):** For better performance and scalability, converting the entire site to static HTML files (using tools like Eleventy, Next.js, or Astro) is highly recommended. This eliminates the need for a Node.js server for serving content.
