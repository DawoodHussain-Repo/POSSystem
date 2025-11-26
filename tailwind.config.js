/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCFB',
          100: '#F5F5F0',
          200: '#E6D8C3',
          300: '#D4C4A8',
          400: '#C2A68C',
          500: '#B08968',
          600: '#8B6F47',
          700: '#6B5435',
          800: '#4A3A24',
          900: '#2A2014',
        },
        sage: {
          50: '#F0F4F1',
          100: '#E1EAE3',
          200: '#C3D5C7',
          300: '#A5C0AB',
          400: '#87AB8F',
          500: '#5D866C',
          600: '#4A6B56',
          700: '#385041',
          800: '#25352B',
          900: '#131A16',
        },
      },
    },
  },
  plugins: [],
}
