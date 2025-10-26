# **👾 KawaiiBlog**

Welcome to the repo for [kawaii-san.org](https://kawaii-san.org), my personal corner of the internet. This is where I write about tech, self-hosting, Linux, anime, music, and whatever else is rattling around my brain.  
This whole thing is basically built the Arch Way: minimal, efficient, and completely over-engineered for what it is. It's part-personal documentation, part-soapbox for rants against user-hostile tech, and fully built with a healthy disrespect for bloated, corporate software.

## **⚙️ Tech Stack & Philosophy**

This is a "hybrid" static site built with vanilla HTML, CSS, and JavaScript, but powered by a few slick Node.js scripts. No frameworks, no bullshit.

* **Content Source**: Simple Markdown files (blog.md) with front-matter.  
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) (using the CDN for live JIT compilation in dev, and a local style.css build for prod).  
* **Static Generation**: A custom Node.js script (blog-to-site/generate.js) converts Markdown to static HTML pages.  
* **Content "Database"**: A single posts/all-posts.json file is automatically updated and acts as the central source of truth for all post metadata.  
* **Dynamic Pages**: The Homepage and Archive pages fetch all-posts.json client-side to render post lists dynamically.  
* **Automation**: Helper scripts (new-post.js) to scaffold new posts, update metadata, and regenerate feeds.  
* **Offline Support**: A basic Service Worker (sw.js) for caching and offline access.  
* **Feeds**: Automatically generated rss.xml and sitemap.xml on every build.

The goal is a lightweight, fast, and fully transparent stack that I have 100% control over. Headers and footers are baked into each static HTML page during generation—no client-side fetching required.

## **🚀 How It Works: The Architecture**

The site operates in two modes:

1. **Static Pages (Posts)**: Every individual blog post (posts/DD-MM-YYYY/index.html) is a pre-rendered, static HTML file. They are generated from Markdown and have zero client-side dependencies to load content. Fast as hell.  
2. **Dynamic Pages (Lists)**: The Homepage (index.html) and Archive (assets/archive.html) are lightweight HTML shells. They use client-side JavaScript (homepage.js, archive.js) to fetch all-posts.json and render the post lists on the fly. This means the homepage is always up-to-date without needing to be rebuilt.

## **🛠️ Local Development**

To preview changes locally or run the site:

1. Navigate to the project's root directory:  
   cd /path/to/kawaiiblog

2. Start any simple web server. Python's built-in one works great:  
   python \-m http.server 8000

3. Open your browser and go to http://localhost:8000.

To build the production Tailwind CSS file (optional, as pages use the CDN by default):  
npm install \# Only needed once (installs tailwindcss)  
npm run build:css

## **✍️ Content Workflow: Adding a New Post**

This is the important part. Don't just write Markdown and push. Follow this process:

### **0\. Prep Work (Only Once)**

You need to install the Node.js dependencies for the build scripts.  
git clone \[your-github-repo-url\]  
cd kawaiiblog  
cd blog-to-site  \# \<-- Go into the script directory  
npm install      \# Installs marked, inquirer, chalk, etc.  
cd ..            \# Go back to the root

### **1\. Sync Your main Branch**

Always start by pulling the latest changes.  
git checkout main  
git pull origin main

### **2\. Create the New Post Files**

Run the interactive script from the **root directory**:  
node blog-to-site/new-post.js

Follow the prompts. It will ask for a **Title**, **Category**, and **Excerpt**. This script automatically:

* Creates the new directory (posts/DD-MM-YYYY).  
* Creates the blog.md file inside it, pre-filled with the front-matter from template.md.

### **3\. Write Your Fucking Post**

Go edit the new posts/DD-MM-YYYY/blog.md file. Write your masterpiece.

### **4\. Create Images (Optional)**

Place any images for the post in its directory (posts/DD-MM-YYYY/) or in the global assets (/assets/images/). Create your banner and thumbnail (WebP format is best) and put them in:

* **Banner**: /assets/images/banners/DD-MM-YYYY.webp (1200x630px)  
* **Thumbnail**: /assets/images/thumbnails/DD-MM-YYYY.webp (384x384px)

### **5\. Generate HTML & Update Site Files**

This is the magic step. From the **root directory**, run the generation script and point it to your new blog.md:  
node blog-to-site/generate.js posts/DD-MM-YYYY/blog.md

This single command does all the heavy lifting:

1. Reads blog.md and its front-matter.  
2. Converts the Markdown to HTML using template.html.  
3. Saves the final index.html in the post's directory.  
4. **Updates posts/all-posts.json** with the new post's metadata.  
5. **Regenerates rss.xml** with the new post.  
6. **Regenerates sitemap.xml** to include the new post.

### **6\. Test Locally**

Fire up your local server (python \-m http.server 8000\) and check:

* Does the new post show up on the homepage?  
* Does it show up on the archive page?  
* Does the post page itself (http://localhost:8000/posts/DD-MM-YYYY/) look correct? (Check those lists\!)  
* Do all the images load?

### **7\. Commit & Push That Shit**

If it all looks good, send it. Using a branch is good practice.  
\# Optional, but a good habit  
git checkout \-b new-post/your-post-slug

\# Add everything  
git add .

\# Commit with a clear message  
git commit \-m "feat: Add new post 'Your Badass Post Title'"

\# Push it  
git push origin new-post/your-post-slug

\# Then go to GitHub and merge the Pull Request.  
\# Or just push to main if you're feeling spicy:  
\# git checkout main  
\# git merge new-post/your-post-slug  
\# git push origin main

GitHub Pages will automatically pick up the changes and deploy. Because the homepage fetches all-posts.json live, it'll show up immediately once the JSON file is updated.

## **🗺️ Known Issues & Roadmap**

### **Current Features**

* ✅ Simple Node.js build scripts (generate.js, new-post.js)  
* ✅ Markdown to HTML conversion (marked)  
* ✅ Front-matter parsing (front-matter)  
* ✅ Automatic all-posts.json metadata generation  
* ✅ Automatic rss.xml and sitemap.xml generation  
* ✅ Tailwind CSS for styling  
* ✅ Header/Footer baked into static HTML (no client-side fetching)  
* ✅ Service Worker for basic offline support  
* ✅ Full SEO meta tags & Schema.org JSON-LD  
* ✅ Native lazy loading for images (loading="lazy")  
* ✅ Canonical URLs for all pages  
* ✅ Basic client-side search/filter/sort on Archive page

### **Planned Improvements**

* \[ \] **CSS:** Implement a PurgeCSS step in npm run build:css to create a minimal production style.css file.  
* \[ \] **JS:** Add a minification step (e.g., using terser) for the client-side .js files.  
* \[ \] **Images:** Implement responsive images with srcset or \<picture\> for banners to save bandwidth on mobile.  
* \[ \] **Search:** The current archive search is basic. Upgrade to a real client-side search library like [Pagefind](https://pagefind.app/) for full-text search.  
* \[ \] **Comments:** Add a comment system (e.g., [Giscus](https://giscus.app/)) to post templates.  
* \[ \] **Accessibility:** Add a "Skip to Content" link for keyboard navigation.

## **🔒 Privacy & Licensing**

* **Code**: Licensed under [GPLv3](https://www.google.com/search?q=LICENSE).  
* **Content**: Licensed under [CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/).  
* **Analytics/Tracking/Cookies**: **None.** Fuck all that. This site respects your privacy.

## **🚢 Deployment**

Hosted on **GitHub Pages** and deployed automatically on push to the main branch. The custom domain kawaii-san.org is configured via the CNAME file.