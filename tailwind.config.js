// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [ // Tell Tailwind where to look for classes
    './*.html',
    './assets/**/*.html',
    './assets/js/**/*.js', // If you add classes via JS
    './posts/**/*.html',
    './blog-to-site/template.html', // Include your template
  ],
  theme: {
    extend: {
      colors: {
        'kawaii-pink': '#FFC0CB',
        'kawaii-blue': '#A7C7E7',
        'kawaii-mint': '#B2F2BB',
        'kawaii-lavender': '#E6E6FA',
        'social-email': '#D14836',
        'social-github': '#181717',
        'social-linkedin': '#0A66C2',
        'social-twitter': '#000000',
        'social-instagram': '#E4405F',
        'social-mastodon': '#6364FF',
        'social-twitch': '#9146FF',
        'social-telegram': '#26A5E4',
        'social-patreon': '#FF424D',
        'social-threads': '#000000',
      }
    }
  },
  plugins: [
      require('@tailwindcss/typography'), // Add if needed for blog styling
      require('@tailwindcss/forms'),    // Add if needed for form styling
  ],
}