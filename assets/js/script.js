// Function to handle the mobile menu toggle
const attachMobileMenuEvent = () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenu && !e.target.closest('nav') && !e.target.closest('#mobile-menu-button')) {
                mobileMenu.classList.add('hidden');
            }
        });

        // Close menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
};

const attachBackToTopButton = () => {
    const button = document.getElementById('back-to-top');
    
    if (!button) return; // Element doesn't exist on this page
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            button.classList.remove('hidden');
        } else {
            button.classList.add('hidden');
        }
    });
    
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

const attachShareButtons = () => {
    // Use event delegation for dynamically added buttons
    document.body.addEventListener('click', async (e) => {
        if (e.target && e.target.matches('[data-share-url]')) {
            e.preventDefault();
            const button = e.target;
            const url = button.dataset.shareUrl;
            
            try {
                if (navigator.share) {
                    // Use native share if available (mobile)
                    await navigator.share({
                        title: document.title,
                        url: url
                    });
                } else {
                    // Fallback: copy to clipboard (desktop)
                    await navigator.clipboard.writeText(url);
                    const originalText = button.textContent;
                    button.textContent = 'Copied!';
                    setTimeout(() => {
                        button.textContent = originalText;
                    }, 2000);
                }
            } catch (err) {
                console.log('Share failed:', err);
            }
        }
    });
};

// Run all setup functions when the page is loaded
document.addEventListener('DOMContentLoaded', () => {

    // Attach events that don't depend on fetched content
    attachBackToTopButton();
    attachShareButtons(); 

    // Header/Footer are now baked in, so just attach events directly
    attachMobileMenuEvent();

    // The fetch logic for header/footer has been removed.
});

// Function to show an error message in a specified container
const showError = (containerId, message) => {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="text-center py-12">
                <p class="text-red-400 mb-4">${message}</p>
                <button onclick="location.reload()" class="px-4 py-2 bg-kawaii-pink text-gray-900 rounded-lg font-bold hover:opacity-80">
                    Try Again
                </button>
            </div>
        `;
    }
};
