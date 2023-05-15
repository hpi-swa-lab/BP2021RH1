/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      height: {
        '50vh': '50vh',
        'main': 'calc(100vh - 5rem)',
      },
      colors: {
        primary: '#7e241d'
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
