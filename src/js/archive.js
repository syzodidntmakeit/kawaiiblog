document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('posts-container');
    const searchInput = document.getElementById('search-input');
    const sortButton = document.getElementById('sort-button');

    let allPosts = [];
    let sortOrder = 'desc';
    let dataLoaded = false;

    fetch('/posts/all-posts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            return response.json();
        })
        .then(posts => {
            dataLoaded = true;
            allPosts = posts;
            sortAndRenderPosts();
        })
        .catch(() => {
            showStatus('Unable to load posts right now. Please refresh in a moment.', 'text-kawaii-pink');
        });

    searchInput.addEventListener('input', () => {
        if (!dataLoaded) {
            return;
        }
        sortAndRenderPosts();
    });

    sortButton.addEventListener('click', () => {
        if (!dataLoaded) {
            return;
        }
        sortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
        sortButton.textContent = `Sort: ${sortOrder === 'desc' ? 'Newest' : 'Oldest'}`;
        sortAndRenderPosts();
    });

    function sortAndRenderPosts() {
        if (!dataLoaded) {
            return;
        }

        let postsToRender = [...allPosts];
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            postsToRender = postsToRender.filter(post =>
                post.title.toLowerCase().includes(searchTerm) ||
                post.category.toLowerCase().includes(searchTerm)
            );
        }

        postsToRender.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });

        renderPosts(postsToRender);
    }

    function renderPosts(posts) {
        postsContainer.innerHTML = '';
        if (!posts.length) {
            showStatus('No posts found.');
            return;
        }
        posts.forEach(post => {
            postsContainer.appendChild(createPostCard(post));
        });
    }

    function createPostCard(post) {
        const wrapper = document.createElement('div');

        const link = document.createElement('a');
        link.href = post.url;
        link.className = 'block p-6 bg-gray-800/50 rounded-lg border border-kawaii-pink hover:bg-gray-700/50 transition-colors';

        const title = document.createElement('h3');
        title.className = 'text-2xl font-bold text-kawaii-pink';
        title.textContent = post.title;

        const meta = document.createElement('p');
        meta.className = 'text-gray-400 mt-2';
        const minutes = post.readingMinutes || 1;
        meta.textContent = `${formatDate(post.date)} • ${minutes} min read`;

        link.appendChild(title);
        link.appendChild(meta);

        if (post.excerpt) {
            const excerpt = document.createElement('p');
            excerpt.className = 'text-gray-400 mt-2';
            excerpt.textContent = post.excerpt;
            link.appendChild(excerpt);
        }

        wrapper.appendChild(link);
        return wrapper;
    }

    function formatDate(value) {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
    }

    function showStatus(message, className = 'text-gray-400') {
        postsContainer.innerHTML = '';
        const paragraph = document.createElement('p');
        paragraph.className = className;
        paragraph.textContent = message;
        postsContainer.appendChild(paragraph);
    }
});
