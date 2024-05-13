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
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        cardforeground: "hsl(var(--card-foreground))",
        popover: "hsl(var(--popover))",
        popverforeground: "hsl(var(--popover-foreground))",
        primary: "hsl(var(--primary))",
        primaryforeground: "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        secondaryforeground: "hsl(var(--secondary-foreground))",
        muted: "hsl(var(--muted))",
        mutedforeground: "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        accentforeground: "hsl(var(--accent-foreground))",
        destructive: "hsl(var(--destructive))",
        destructiveforeground: "hsl(var(--destructive-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
    },
  },
  variants: {
    extend: {
      ringColor: ["responsive", "dark", "focus", "reduced-motion"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
