module.exports = {
  content: [
    "./index.html",
    "./assets/**/*.html",
    "./posts/**/*.html",
    "./includes/**/*.html",
    "./blog-to-site/template.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'kawaii-pink': '#FFC0CB',
        'kawaii-blue': '#A7C7E7',
        'kawaii-mint': '#B2F2BB',
        'kawaii-lavender': '#E6E6FA'
      }
    }
  }
}

