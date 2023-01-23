/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
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
