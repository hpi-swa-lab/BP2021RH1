/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      gridTemplateColumns: {
        'autofill-card': 'repeat(auto-fill, minmax(20rem, 1fr))',
      },
      height: {
        '50vh': '50vh',
        main: 'calc(100vh - 5rem)',
      },
      minHeight: {
        main: 'calc(100vh - 5rem)',
      },
      animation: {
        'paypal-open': 'paypal-open 1s',
      },
      keyframes: {
        'paypal-open': {
          from: {
            maxHeight: '0px',
          },
          to: {
            maxHeight: '60rem',
          },
        },
      },
    },
    fontFamily: {
      sans: ['Lato', 'Arial', 'sans-serif'],
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
