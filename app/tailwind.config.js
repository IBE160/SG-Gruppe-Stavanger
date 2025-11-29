/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-beige': '#F2E8CF',
        'cornflower-blue': '#93C5FD',
        'terracotta': '#E07A5F',
        'sage-green': '#B2AC88',
        'charcoal': '#3D405B',
      },
      boxShadow: {
        'farmhouse': '8px 8px 0px rgba(178, 172, 136, 0.4)', // Sage Green with 40% opacity
        'farmhouse-dark': '10px 10px 0px rgba(61, 64, 91, 0.6)', // Charcoal with 60% opacity
      }
    },
  },
  plugins: [],
};
