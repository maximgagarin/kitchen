/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
       colors: {
        brand: '#FF3C00',
      },
    },
  },
  plugins: [],
}