let allPosts = [];
let isSortedDescending = true;

const loadArchivePosts = async () => {
    try {
        const response = await fetch(SITE_CONFIG?.paths?.postsData || "/posts/all-posts.json");
        if (!response.ok) throw new Error("Failed to load posts");

        const data = await response.json();
        allPosts = data.posts;
        sortPosts(); // Initial sort
        
        renderArchivePosts(allPosts);
        attachArchiveSearchAndSort();
    } catch (error) {
        console.error("Error loading posts:", error);
        showError("posts-container", "Failed to load blog posts. Please try again.");
    }
};

const sortPosts = () => {
    allPosts.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return isSortedDescending ? dateB - dateA : dateA - dateB;
    });
};

const renderArchivePosts = (posts) => {
    const container = document.getElementById("posts-container");
    if (!container) return;

    if (posts.length === 0) {
        container.innerHTML = '<p class="text-gray-400">No posts found.</p>';
        return;
    }

    container.innerHTML = posts.map(post => {
        const estimatedTime = post.readingTime;
        
        return `
        <div data-post-id="${post.id}" data-category="${post.category}" class="p-6 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
            <div class="flex justify-between items-start mb-2">
                <div>
                    <p class="text-sm text-gray-400">${post.date}</p>
                    <a href="${post.url}" class="text-2xl font-bold text-kawaii-pink hover:text-kawaii-blue transition-colors">
                        ${post.title}
                    </a>
                </div>
                <span class="px-3 py-1 rounded-full text-sm font-bold bg-kawaii-mint/20 text-kawaii-mint">
                    ${post.category}
                </span>
            </div>
            <p class="text-gray-400 mb-4">${post.excerpt}</p>
            <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500">${estimatedTime} min read</span>
                <a href="${post.url}" class="text-kawaii-pink hover:text-kawaii-blue transition-colors">
                    Read more →
                </a>
            </div>
        </div>
    `}).join("");
};

const attachArchiveSearchAndSort = () => {
    const searchInput = document.getElementById("search-input");
    const sortButton = document.getElementById("sort-button");

    if (searchInput) {
        searchInput.addEventListener("input", applyFiltersAndSearch);
    }

    if (sortButton) {
        sortButton.addEventListener("click", () => {
            isSortedDescending = !isSortedDescending; // Toggle sort order
            sortButton.textContent = isSortedDescending ? "Sort: Newest" : "Sort: Oldest";
            sortPosts(); // Re-sort the main list
            applyFiltersAndSearch(); // Re-render the list
        });
    }
};

const applyFiltersAndSearch = () => {
    const searchQuery = document.getElementById("search-input")?.value.toLowerCase() || "";
    let filtered = allPosts;

    if (searchQuery) {
        filtered = filtered.filter(post =>
            post.title.toLowerCase().includes(searchQuery) ||
            post.excerpt.toLowerCase().includes(searchQuery)
        );
    }
    
    renderArchivePosts(filtered);
};

document.addEventListener("DOMContentLoaded", loadArchivePosts);
