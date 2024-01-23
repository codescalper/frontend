/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/react/utils/withMT");

// export default {
module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    colors: {
      lenspostLime: "#e1f16b",
      lenspostPurple: "#2C346B",
      lenspostPink: "#E598D8",
      lenspostBlack: "#272727",
      lenspostYellow: "#FFF559",
      lenspostCyan: "#A0F8EE",
    },
    extend: {
      screens: {
        sm: "500px",
      },
    },
  },
});
