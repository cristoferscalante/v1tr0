import typography from '@tailwindcss/typography';
import tailwindcssAnimate from 'tailwindcss-animate';

module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#08A696',
        secondary: '#025159',
        background: '#011C26',
        backgroundSecondary: '#0f0f0f',
        highlight: '#26FFDF',
        accent: '#F26A1B',
        danger: '#FF2C10',
        textPrimary: '#FFFFFF',
        textMuted: '#B0B0B0',
        custom: {
          1: '#011C26',
          2: '#025159',
          3: '#08A696',
          4: '#26FFDF',
        },
      },
      fontFamily: {
        alexandria: ['var(--font-alexandria)', 'sans-serif'],
      },
      backdropBlur: {
        42: '42px',
      },
    },
  },
  plugins: [
    typography, 
    tailwindcssAnimate, 
  ], 
  };
