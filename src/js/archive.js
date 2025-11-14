document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('posts-container');
    const searchInput = document.getElementById('search-input');
    const sortButton = document.getElementById('sort-button');

    let allPosts = [];
    let sortOrder = 'desc'; // 'desc' for newest, 'asc' for oldest

    fetch('/posts/all-posts.json')
        .then(response => response.json())
        .then(posts => {
            allPosts = posts;
            sortAndRenderPosts();
        });

    searchInput.addEventListener('input', () => {
        sortAndRenderPosts();
    });

    sortButton.addEventListener('click', () => {
        sortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
        sortButton.textContent = `Sort: ${sortOrder === 'desc' ? 'Newest' : 'Oldest'}`;
        sortAndRenderPosts();
    });

    function sortAndRenderPosts() {
        let postsToRender = [...allPosts];

        // Filter posts
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            postsToRender = postsToRender.filter(post =>
                post.title.toLowerCase().includes(searchTerm) ||
                post.category.toLowerCase().includes(searchTerm)
            );
        }

        // Sort posts
        postsToRender.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });

        renderPosts(postsToRender);
    }

    function renderPosts(posts) {
        postsContainer.innerHTML = '';
        if (posts.length === 0) {
            postsContainer.innerHTML = '<p>No posts found.</p>';
            return;
        }
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.innerHTML = `
                <a href="${post.url}" class="block p-6 bg-gray-800/50 rounded-lg border border-kawaii-pink hover:bg-gray-700/50 transition-colors">
                    <h3 class="text-2xl font-bold text-kawaii-pink">${post.title}</h3>
                    <p class="text-gray-400 mt-2">${new Date(post.date).toLocaleDateString()} • ${post.readingMinutes || 1} min read</p>
                    ${post.excerpt ? `<p class="text-gray-400 mt-2">${post.excerpt}</p>` : ''}
                </a>
            `;
            postsContainer.appendChild(postElement);
        });
    }
});
