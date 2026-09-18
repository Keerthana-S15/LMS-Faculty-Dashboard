/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: "#2C1B57",
          light: "#3B2470",
          dark: "#22143F",
        },
        surface: {
          DEFAULT: "#F5F4FA",
          muted: "#EEEBF6",
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
        "card-hover":
          "0 10px 24px -8px rgba(44, 27, 87, 0.18), 0 2px 6px -2px rgba(44, 27, 87, 0.08)",
        dropdown:
          "0 12px 32px -8px rgba(44, 27, 87, 0.22), 0 2px 8px -2px rgba(44, 27, 87, 0.10)",
        modal: "0 24px 64px -16px rgba(30, 21, 51, 0.35)",
        focus: "0 0 0 3px rgba(169, 140, 227, 0.45)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(12px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 150ms ease-out both",
        "fade-up": "fade-up 220ms ease-out backwards",
        "scale-in": "scale-in 160ms cubic-bezier(0.16, 1, 0.3, 1) backwards",
        "slide-in-right": "slide-in-right 200ms ease-out backwards",
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
};
