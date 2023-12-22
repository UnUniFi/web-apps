/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./projects/**/*.{html,ts}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      'light',
      'dark',
      'dracula',
      'night',
      'business',
      'luxury',
      'synthwave',
      {
        irs: {
          primary: '#387CFF',
          secondary: '#ADC9FF',
          accent: '#58D6A9',
          neutral: '#FFFFFF',
          'base-100': '#253548',
        },
      },
    ],
  },
};
