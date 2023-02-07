const { guessProductionMode } = require('@ngneat/tailwind');

process.env.TAILWIND_MODE = guessProductionMode() ? 'build' : 'watch';

module.exports = {
  content: ['./projects/**/*.{html,ts}'],
  theme: {
    extend: {
      screens: {},
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('daisyui')],
  important: true,
};
