/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: "#2C1B57",
          light: "#3B2470",
        },
        brand: {
          50: "#F2EEFB",
          100: "#E4DCF7",
          200: "#C9B9EF",
          300: "#A98CE3",
          400: "#8C63D6",
          500: "#6D3FC7",
          600: "#5B2EB8",
          700: "#4A2497",
          800: "#3B1C79",
          900: "#2C1B57",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(44, 27, 87, 0.08), 0 1px 2px -1px rgba(44, 27, 87, 0.08)",
      },
    },
  },
  plugins: [],
};
