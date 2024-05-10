/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      ringColor: {
        lime: "#32CD32",
      },
    },
  },
  variants: {
    extend: {
      ringColor: ["responsive", "dark", "focus", "reduced-motion"],
    },
  },
  plugins: [],
};
