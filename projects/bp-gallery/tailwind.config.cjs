/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      gridTemplateColumns: {
        'autofit-card': 'repeat(auto-fit, minmax(20rem, 1fr))',
      },
      height: {
        '50vh': '50vh',
        main: 'calc(100vh - 5rem)',
      },
      colors: {
        primary: '#7e241d',
      },
    },
    fontFamily: {
      sans: ['Lato', 'Arial', 'sans-serif'],
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
