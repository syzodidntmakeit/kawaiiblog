module.exports = {
    darkMode: 'class',
    content: [
        './index.html',
        './404.html',
        './pages/**/*.html',
        './templates/**/*.html',
        './posts/**/*.html',
        './posts/**/*.md',
        './src/js/**/*.js',
    ],
    theme: {
        extend: {
            colors: {
                'custom-dark': '#0d011f',
                'kawaii-pink': '#FFC0CB',
                'kawaii-blue': '#A7C7E7',
                'kawaii-mint': '#B2F2BB',
                'kawaii-lavender': '#E6E6FA',
                'social-email': '#8B55CC',
                'social-github': '#FFFFFF',
                'social-linkedin': '#0A66C2',
                'social-twitter': '#FFFFFF',
                'social-instagram': '#E4405F',
                'social-mastodon': '#6364FF',
                'social-twitch': '#9146FF',
                'social-telegram': '#26A5E4',
                'social-patreon': '#FF424D',
                'social-threads': '#FFFFFF',
            },
            fontFamily: {
                nunito: ['"Nunito"', 'sans-serif'],
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
};
