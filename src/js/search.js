document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results-container');
    const meta = document.getElementById('search-meta');

    let posts = [];
    let dataLoaded = false;
    let loadPromise = null;
    let loadFailed = false;

    function showStatus(message, className = 'text-gray-400') {
        resultsContainer.innerHTML = '';
        const paragraph = document.createElement('p');
        paragraph.className = className;
        paragraph.textContent = message;
        resultsContainer.appendChild(paragraph);
    }

    function loadIndex() {
        if (loadPromise) {
            return loadPromise;
        }

        loadPromise = fetch('/posts/search-index.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch search index');
                }
                return response.json();
            })
            .then(index => {
                posts = index;
                dataLoaded = true;
                meta.textContent = `${posts.length} posts indexed.`;
            })
            .catch(() => {
                loadFailed = true;
                meta.textContent = '';
                showStatus('Unable to load search index.', 'text-red-400');
            });

        return loadPromise;
    }

    function handleInput() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            meta.textContent = '';
            showStatus('Start typing to see results.');
            return;
        }

        const performSearch = () => {
            if (!dataLoaded || loadFailed) {
                return;
            }
            const results = posts.filter(post => `${post.title} ${post.excerpt} ${post.content} ${post.category}`.toLowerCase().includes(query));
            meta.textContent = `${results.length} result${results.length === 1 ? '' : 's'} for "${query}"`;
            renderResults(results, query);
        };

        if (dataLoaded) {
            performSearch();
        } else {
            loadIndex().then(performSearch);
        }
    }

    function renderResults(matches, query) {
        if (!matches.length) {
            showNoResults(query);
            return;
        }

        resultsContainer.innerHTML = '';
        matches.forEach(post => {
            resultsContainer.appendChild(createResultCard(post));
        });
    }

    function showNoResults(query) {
        resultsContainer.innerHTML = '';
        const paragraph = document.createElement('p');
        paragraph.className = 'text-gray-400';
        paragraph.append('No results for "');
        const highlight = document.createElement('span');
        highlight.className = 'text-kawaii-pink';
        highlight.textContent = query;
        paragraph.appendChild(highlight);
        paragraph.append('"');
        resultsContainer.appendChild(paragraph);
    }

    function createResultCard(post) {
        const wrapper = document.createElement('div');
        const link = document.createElement('a');
        link.href = post.url;
        link.className = 'block p-6 bg-gray-800/50 rounded-lg border border-kawaii-pink hover:bg-gray-700/50 transition-colors';

        const headingRow = document.createElement('div');
        headingRow.className = 'flex justify-between items-center';

        const category = document.createElement('p');
        category.className = 'uppercase tracking-[0.4em] text-xs text-kawaii-pink';
        category.textContent = post.category;

        const date = document.createElement('p');
        date.className = 'text-gray-400 text-sm';
        date.textContent = formatDate(post.date);
        headingRow.appendChild(category);
        headingRow.appendChild(date);

        const title = document.createElement('h3');
        title.className = 'text-2xl font-bold text-white mt-2';
        title.textContent = post.title;
        link.appendChild(headingRow);
        link.appendChild(title);

        if (post.excerpt) {
            const excerpt = document.createElement('p');
            excerpt.className = 'text-gray-400 mt-3';
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

    const primeIndexLoad = () => {
        searchInput.removeEventListener('focus', primeIndexLoad);
        searchInput.removeEventListener('keydown', primeIndexLoad);
        loadIndex();
    };

    searchInput.addEventListener('focus', primeIndexLoad);
    searchInput.addEventListener('keydown', primeIndexLoad);
    searchInput.addEventListener('input', handleInput);
});
