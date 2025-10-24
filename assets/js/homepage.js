let allPosts = [];

const loadHomepagePosts = async () => {
    try {
        const response = await fetch(SITE_CONFIG?.paths?.postsData || '/posts/all-posts.json');
        if (!response.ok) throw new Error('Failed to load posts');
        
        const data = await response.json();
        allPosts = data.posts;
        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
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

        return `
            <article class="group" data-category="${post.category}" data-title="${post.title.toLowerCase()}" data-excerpt="${post.excerpt.toLowerCase()}">
                <a href="${post.url}" class="block">
                    <div class="p-8 bg-gray-800/50 rounded-lg shadow-lg transition-all duration-300 group-hover:bg-gray-800 group-hover:shadow-kawaii-pink/20 group-hover:shadow-2xl">
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
                                    onerror="this.src='/assets/images/og-default.png';"> </div>
                            <div class="flex-grow">
                                <p class="text-sm text-gray-400">${post.date} • ${estimatedTime} min read • ${post.category}</p>
                                <h2 class="text-3xl font-extrabold mt-2 mb-4 group-hover:text-kawaii-pink transition-colors">${post.title}</h2>
                                <p class="text-gray-400 text-lg leading-relaxed">${post.excerpt}</p>
                                <div class="flex justify-between items-center mt-6">
                                    <span class="font-bold text-kawaii-mint group-hover:underline">Read more &rarr;</span>
                                    <button class="share-btn px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-sm" data-share-url="${window.location.origin}${post.url}">📋 Share</button>
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
    // Note: Search input is removed, but filter logic remains.
    const filterButtons = document.querySelectorAll('[data-category]');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-kawaii-pink', 'text-gray-900');
                btn.classList.add('bg-gray-800/50', 'text-gray-300');
            });
            button.classList.add('bg-kawaii-pink', 'text-gray-900');
            button.classList.remove('bg-gray-800/50', 'text-gray-300');
            applyFiltersAndSearch();
        });
    });
};

const applyFiltersAndSearch = () => {
    const activeCategory = document.querySelector('[data-category].bg-kawaii-pink')?.dataset.category || 'all';
    
    // Get the top 20 posts again for filtering
    let filtered = allPosts.slice(0, 20); 

    if (activeCategory !== 'all') {
        filtered = filtered.filter(post => post.category === activeCategory);
    }
    
    renderHomepagePosts(filtered);
};

window.addEventListener('pageshow', function(event) {
    if (event.persisted) { // This is true if the page was loaded from bfcache
        document.querySelector('[data-category="all"]').click(); // Click "All Posts"
        loadHomepagePosts(); // Re-load the posts
    }
});

document.addEventListener('DOMContentLoaded', loadHomepagePosts);
