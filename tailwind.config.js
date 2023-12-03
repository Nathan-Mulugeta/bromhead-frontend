/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3085FE',
        text: {
          light: '#BDBFC4',
          normal: '#101317',
        },
      },
    },
  },
  plugins: [],
};
