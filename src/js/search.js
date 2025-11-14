document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results-container');
    const meta = document.getElementById('search-meta');

    let allPosts = [];
    let dataLoaded = false;

    fetch('/posts/search-index.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch search index');
            }
            return response.json();
        })
        .then(data => {
            dataLoaded = true;
            allPosts = data;
            meta.textContent = `${allPosts.length} posts indexed.`;
        })
        .catch(() => {
            meta.textContent = '';
            showStatus('Unable to load search index.', 'text-red-400');
        });

    searchInput.addEventListener('input', handleSearch);

    function handleSearch() {
        if (!dataLoaded) {
            return;
        }

        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            meta.textContent = '';
            showStatus('Start typing to see results.');
            return;
        }

        const filtered = allPosts.filter(post => {
            const haystack = `${post.title} ${post.excerpt} ${post.content} ${post.category}`.toLowerCase();
            return haystack.includes(query);
        });

        meta.textContent = `${filtered.length} result${filtered.length === 1 ? '' : 's'} for "${query}"`;
        renderResults(filtered, query);
    }

    function renderResults(results, query) {
        if (!results.length) {
            renderNoResults(query);
            return;
        }

        resultsContainer.innerHTML = '';
        results.forEach(post => {
            resultsContainer.appendChild(createResultCard(post));
        });
    }

    function createResultCard(post) {
        const cardWrapper = document.createElement('div');

        const link = document.createElement('a');
        link.href = post.url;
        link.className = 'block p-6 bg-gray-800/50 rounded-lg border border-kawaii-pink hover:bg-gray-700/50 transition-colors';

        const metaRow = document.createElement('div');
        metaRow.className = 'flex justify-between items-center';

        const category = document.createElement('p');
        category.className = 'uppercase tracking-[0.4em] text-xs text-kawaii-pink';
        category.textContent = post.category;

        const date = document.createElement('p');
        date.className = 'text-gray-400 text-sm';
        date.textContent = formatDate(post.date);

        metaRow.appendChild(category);
        metaRow.appendChild(date);

        const title = document.createElement('h3');
        title.className = 'text-2xl font-bold text-white mt-2';
        title.textContent = post.title;

        link.appendChild(metaRow);
        link.appendChild(title);
        if (post.excerpt) {
            const excerpt = document.createElement('p');
            excerpt.className = 'text-gray-400 mt-3';
            excerpt.textContent = post.excerpt;
            link.appendChild(excerpt);
        }

        cardWrapper.appendChild(link);
        return cardWrapper;
    }

    function renderNoResults(query) {
        resultsContainer.innerHTML = '';
        const paragraph = document.createElement('p');
        paragraph.className = 'text-gray-400';
        paragraph.append('No results for "');
        const highlight = document.createElement('span');
        highlight.className = 'text-kawaii-pink';
        highlight.textContent = query;
        paragraph.append(highlight);
        paragraph.append('"');
        resultsContainer.appendChild(paragraph);
    }

    function formatDate(value) {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
    }

    function showStatus(message, className = 'text-gray-400') {
        resultsContainer.innerHTML = '';
        const paragraph = document.createElement('p');
        paragraph.className = className;
        paragraph.textContent = message;
        resultsContainer.appendChild(paragraph);
    }
});
