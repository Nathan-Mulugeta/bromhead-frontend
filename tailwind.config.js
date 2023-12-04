/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3085FE",
        text: {
          light: "#BDBFC4",
          normal: "rgb(75, 85, 99)",
        },
      },
    },
  },
  plugins: [],
};
