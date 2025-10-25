let allPosts = [];

const loadHomepagePosts = async () => {
    try {
        const response = await fetch(SITE_CONFIG?.paths?.postsData || '/posts/all-posts.json');
        if (!response.ok) throw new Error('Failed to load posts');

        const data = await response.json();
        allPosts = data.posts;
        // Keep sorting by date descending
        allPosts.sort((a, b) => {
            // Assuming date format is like "Oct 22, 2025"
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA; // Sort newest first
        });

        // Render only the top 20 posts
        renderHomepagePosts(allPosts.slice(0, 20));
        attachFiltersAndSearch();
    } catch (error) {
        console.error('Error loading posts:', error);
        showError('posts-container', 'Failed to load blog posts. Please try again later.');
    }
};

const renderHomepagePosts = (posts) => {
    const container = document.getElementById('posts-container');
    if (!container) return;

    if (posts.length === 0) {
        container.innerHTML = '<p class="text-gray-400 text-center py-12">No posts found.</p>';
        return;
    }

    container.innerHTML = posts.map(post => {
        const estimatedTime = post.readingTime;

        // Removed Tailwind bg/hover/text/rounded/px/py classes from the button
        // Kept text-sm equivalent via CSS rule
        return `
            <article data-category="${post.category}" data-title="${post.title.toLowerCase()}" data-excerpt="${post.excerpt.toLowerCase()}">
                <a href="${post.url}" class="block group">
                    <div class="post-card-container transition-all duration-300">
                        <div class="flex flex-col md:flex-row md:items-center md:space-x-8">
                            <div class="hidden md:block md:w-48 md:h-48 flex-shrink-0 mb-6 md:mb-0">
                                <img
                                    src="${post.thumbnailUrl}"
                                    alt="${post.title}"
                                    width="384"
                                    height="384"
                                    loading="lazy"
                                    decoding="async"
                                    class="w-full h-full object-cover rounded-lg shadow-md"
                                    onerror="this.onerror=null; this.src='/assets/images/og-default.png';">
                            </div>
                            <div class="flex-grow">
                                <p class="post-meta text-sm text-gray-400">${post.date} • ${estimatedTime} min read • <span class="post-category-tag">${post.category}</span></p>
                                <h2 class="post-title text-3xl font-extrabold mt-2 mb-4 group-hover:text-inherit transition-colors">${post.title}</h2>
                                <p class="post-excerpt text-gray-400 text-lg leading-relaxed">${post.excerpt}</p>
                                <div class="flex justify-between items-center mt-6">
                                    <span class="post-readmore font-bold text-kawaii-mint group-hover:underline">Read more &rarr;</span>
                                    <button class="share-btn" data-share-url="${window.location.origin}${post.url}" data-original-text="↻ Share">↻ Share</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </article>
        `;
    }).join('');
};

const attachFiltersAndSearch = () => {
    // Select only buttons with the filter-button class
    const filterButtons = document.querySelectorAll('.filter-button[data-category]');

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Stop the click from propagating if needed, though targeting buttons should prevent issues
             e.stopPropagation();

            const category = button.dataset.category;

            // Remove .active class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            // Add .active class to the clicked button
            button.classList.add('active');

            applyFiltersAndSearch();
        });
    });
     // Ensure initial state correctly applies 'active' if needed (e.g., to 'All Posts')
     const initialActive = document.querySelector('.filter-button[data-category="all"]');
     if (initialActive && !document.querySelector('.filter-button.active')) {
         initialActive.classList.add('active');
     }
};

const applyFiltersAndSearch = () => {
    // Find active button based on the .active class
    const activeCategory = document.querySelector('.filter-button.active')?.dataset.category || 'all';

    // Get the top 20 posts again for filtering
    let filtered = allPosts.slice(0, 20);

    if (activeCategory !== 'all') {
        filtered = filtered.filter(post => post.category === activeCategory);
    }

    renderHomepagePosts(filtered);
};

// Keep pageshow logic as it helps reset filters on back navigation
window.addEventListener('pageshow', function(event) {
    if (event.persisted) { // This is true if the page was loaded from bfcache
        const allButton = document.querySelector('.filter-button[data-category="all"]');
        if (allButton) {
            allButton.click(); // Click "All Posts" to reset state
        } else {
             loadHomepagePosts(); // Fallback to just reload if button not found immediately
        }
    }
});

document.addEventListener('DOMContentLoaded', loadHomepagePosts);
