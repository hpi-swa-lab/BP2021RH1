/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      height: {
        '50vh': '50vh'
      }
    },
    fontFamily: {
      sans: ['Lato', 'Arial', 'sans-serif'],
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp')
  ],
};
