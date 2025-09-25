/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./**/*.html",
    "./**/*.js",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Add any custom theme extensions here
    },
  },
  plugins: [
    // Add the same plugins you were using from the CDN
    require('@tailwindcss/forms')({
      strategy: 'class', // only generate classes
    }),
  ],
}