document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-button');
    const postsContainer = document.getElementById('posts-container');

    let allPosts = [];

    fetch('/posts/all-posts.json')
        .then(response => response.json())
        .then(posts => {
            allPosts = posts;
            renderPosts(allPosts);
        });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-kawaii-pink', 'text-custom-dark');
                btn.classList.add('bg-transparent', 'text-kawaii-pink');
            });
            button.classList.remove('bg-transparent', 'text-kawaii-pink');
            button.classList.add('active', 'bg-kawaii-pink', 'text-custom-dark');
            
            if (category === 'all') {
                renderPosts(allPosts);
            } else {
                const filteredPosts = allPosts.filter(post => post.category === category);
                renderPosts(filteredPosts);
            }
        });
    });

    function renderPosts(posts) {
        postsContainer.innerHTML = '';
        if (posts.length === 0) {
            postsContainer.innerHTML = '<p>No posts in this category yet.</p>';
            return;
        }
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.innerHTML = `
                <a href="${post.url}" class="block p-6 bg-gray-800/50 rounded-lg border border-kawaii-pink hover:bg-gray-700/50 transition-colors">
                    <h3 class="text-2xl font-bold text-kawaii-pink">${post.title}</h3>
                    <p class="text-gray-400 mt-2">${new Date(post.date).toLocaleDateString()}</p>
                    ${post.excerpt ? `<p class="text-gray-400 mt-2">${post.excerpt}</p>` : ''}
                </a>
            `;
            postsContainer.appendChild(postElement);
        });
    }
});