/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chinese-red': '#E84142',
        'ink-black': '#2C2C2C',
        'gold': '#FFD700',
      },
      fontFamily: {
        'chinese': ['Noto Sans TC', 'sans-serif'],
        'chinese-serif': ['Noto Serif TC', 'serif'],
      },
    },
  },
  plugins: [],
}
