/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FFAC1E",
        secondary: "#E16116",
        text: {
          light: "#FFFFFF",
          normal: "#124056",
          dark: "#6F767E",
        },
        background: "#0F2332",
        backgroundLight: "#124056",
      },
    },
  },
  plugins: [],
};
