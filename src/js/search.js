document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results-container');
    const meta = document.getElementById('search-meta');
    let allPosts = [];

    function formatDate(value) {
        const date = new Date(value);
        return Number.isNaN(date) ? value : date.toLocaleDateString();
    }

    function renderResults(results, query) {
        if (!results.length) {
            resultsContainer.innerHTML = `<p class="text-gray-400">No results for "<span class="text-kawaii-pink">${query}</span>".</p>`;
            return;
        }

        resultsContainer.innerHTML = '';
        results.forEach(post => {
            const card = document.createElement('div');
            card.innerHTML = `
                <a href="${post.url}" class="block p-6 bg-gray-800/50 rounded-lg border border-kawaii-pink hover:bg-gray-700/50 transition-colors">
                    <div class="flex justify-between items-center">
                        <p class="uppercase tracking-[0.4em] text-xs text-kawaii-pink">${post.category}</p>
                        <p class="text-gray-400 text-sm">${formatDate(post.date)}</p>
                    </div>
                    <h3 class="text-2xl font-bold text-white mt-2">${post.title}</h3>
                    <p class="text-gray-400 mt-3">${post.excerpt}</p>
                </a>
            `;
            resultsContainer.appendChild(card);
        });
    }

    function handleSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            meta.textContent = '';
            resultsContainer.innerHTML = '<p class="text-gray-400">Start typing to see results.</p>';
            return;
        }

        const filtered = allPosts.filter(post => {
            const haystack = `${post.title} ${post.excerpt} ${post.content} ${post.category}`.toLowerCase();
            return haystack.includes(query);
        });

        meta.textContent = `${filtered.length} result${filtered.length === 1 ? '' : 's'} for "${query}"`;
        renderResults(filtered, query);
    }

    fetch('/posts/search-index.json')
        .then(response => response.json())
        .then(data => {
            allPosts = data;
            meta.textContent = `${allPosts.length} posts indexed.`;
        })
        .catch(() => {
            resultsContainer.innerHTML = '<p class="text-red-400">Unable to load search index.</p>';
        });

    searchInput.addEventListener('input', handleSearch);
});
