/** @type {import('tailwindcss').Config} */

const fs = require('fs');
const { kebabCase } = require('lodash');

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: loadSharedColors(),
      gridTemplateColumns: {
        'autofit-card': 'repeat(auto-fit, minmax(20rem, 1fr))',
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

function loadSharedColors() {
  const styles = fs.readFileSync('./src/shared/style.module.scss');
  const regex = /^\$([a-zA-Z]+)Color:\s*(.+)\s*;$/gm;
  const colors = {};
  let match;
  while ((match = regex.exec(styles))) {
    const [_line, name, color] = match;
    const kebabCaseName = kebabCase(name);
    colors[kebabCaseName] = color;
  }
  return colors;
}
