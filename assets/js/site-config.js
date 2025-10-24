// Site-wide configuration
const SITE_CONFIG = {
  // Site Identity
  siteName: "KawaiiBlog",
  siteTitle: "blog.kawaii-san.org",
  domain: "https://kawaii-san.org",
  
  // Author
  author: {
    name: "Isaiah",
    email: "syzodidntmakealongemail@proton.me",
    github: "https://github.com/syzodidntmakeit",
    linkedin: "https://www.linkedin.com/in/isaiah-s-o-raja-rajendra-verma",
    twitter: "https://twitter.com/syzodidntmakeit",
    instagram: "https://instagram.com/isaiah.rawr"
  },
  
  // SEO
  defaultDescription: "A personal blog about tech, lifting, self-hosting, anime, and whatever else is occupying my brain space. Built the Arch Way.",
  
  // Reading time calculation
  wordsPerMinute: 200,
  
  // Paths
  paths: {
    postsData: "/posts/all-posts.json", // <-- UPDATED
    header: "/includes/header.html",
    footer: "/includes/footer.html",
    homepageJS: "/assets/js/homepage.js", // <-- NEW
    archiveJS: "/assets/js/archive.js"     // <-- NEW
  },

  // Image paths (organized by category for future use)
  images: {
    defaultOG: "https://kawaii-san.org/assets/images/og-default.png",
    favicon: "https://kawaii-san.org/assets/favicon/favicon-32x32.png"
  },

  // Meta description generator
  generateMetaDescription: (excerpt, fallback = null) => {
    if (!excerpt) return fallback || SITE_CONFIG.defaultDescription;
    
    // Truncate to ~155-160 characters (Google's display limit)
    const maxLength = 160;
    if (excerpt.length <= maxLength) return excerpt;
    
    // Truncate and add ellipsis, cutting at word boundary
    const truncated = excerpt.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return truncated.substring(0, lastSpace) + '...';
  },

  // Open Graph image selector (returns best available image)
  selectOGImage: (postThumbnail = null) => {
    if (postThumbnail) return postThumbnail;
    return SITE_CONFIG.images.defaultOG;
  },

  // Structured data generator (JSON-LD)
  generateBlogPostSchema: (post) => {
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "image": SITE_CONFIG.selectOGImage(post.bannerUrl), // <-- Use banner for schema
      "datePublished": post.date,
      "dateModified": post.date,
      "description": SITE_CONFIG.generateMetaDescription(post.excerpt),
      "author": {
        "@type": "Person",
        "name": SITE_CONFIG.author.name,
        "url": `${SITE_CONFIG.domain}/about/`
      },
      "publisher": {
        "@type": "Organization",
        "name": SITE_CONFIG.siteName,
        "logo": {
          "@type": "ImageObject",
          "url": SITE_CONFIG.images.favicon
        }
      }
    };
  }
};

// Tailwind configuration
const TAILWIND_CONFIG = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "kawaii-pink": "var(--kawaii-pink)",
        "kawaii-blue": "var(--kawaii-blue)",
        "kawaii-mint": "var(--kawaii-mint)",
        "kawaii-lavender": "var(--kawaii-lavender)",
        "kawaii-silver": "var(--kawaii-silver)"
      }
    }
  }
};

// Apply Tailwind config if tailwind exists
if (typeof tailwind !== "undefined") {
  tailwind.config = TAILWIND_CONFIG;
}
