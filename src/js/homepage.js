document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-button');
    const postsContainer = document.getElementById('posts-container');

    let allPosts = [];
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
            renderPosts(allPosts);
        })
        .catch(() => {
            showStatus('Unable to load posts right now. Please refresh in a moment.', 'text-kawaii-pink');
        });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (!dataLoaded) {
                return;
            }
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
        if (!posts.length) {
            showStatus('No posts in this category yet.');
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
