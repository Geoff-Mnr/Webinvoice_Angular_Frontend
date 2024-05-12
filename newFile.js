/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,ts}"],
  theme: {
    fontFamily: {
      open: ["Open Sans", "sans-serif"],
      montserrat: ["Montserrat", "sans-serif"], // Ensure fonts are installed on your machine
    },
    extend: {
      ringColor: {
        lime: "#32CD32",
      },
      colors: {},

      variants: {
        extend: {
          ringColor: ["responsive", "dark", "focus", "reduced-motion"],
        },
      },
      plugins: [require("@tailwindcss/forms")],
    },
  },
};
