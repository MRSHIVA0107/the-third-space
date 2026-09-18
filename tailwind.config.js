/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F5F0E8",
          50: "#FDFCF8",
          100: "#F9F5EE",
          200: "#F5F0E8",
          300: "#EDE4D4",
          400: "#DDD0B8",
          500: "#C8B89A",
        },
        forest: {
          DEFAULT: "#2D5016",
          50: "#EBF2E5",
          100: "#C8DFB5",
          200: "#9EC67F",
          300: "#6FAD45",
          400: "#4D8A26",
          500: "#2D5016",
          600: "#1E3A0D",
          700: "#122308",
        },
        lime: {
          DEFAULT: "#A8C456",
          50: "#F4F8E8",
          100: "#E2EFBC",
          200: "#CBE48A",
          300: "#B4D85A",
          400: "#A8C456",
          500: "#8BAD3A",
          600: "#6D9021",
        },
        maroon: {
          DEFAULT: "#8B2635",
          50: "#F9EBEC",
          100: "#ECC4C9",
          200: "#D98F98",
          300: "#C55A67",
          400: "#B03A4A",
          500: "#8B2635",
          600: "#651A26",
        },
        ink: {
          DEFAULT: "#1A1A1A",
          light: "#333333",
          muted: "#666666",
        },
        sand: {
          DEFAULT: "#D4C4A8",
          light: "#EDE4D4",
          dark: "#B8A68A",
        },
        muted: "#8C7B6B",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-dm-serif)", "Georgia", "serif"],
      },
      fontSize: {
        "display-2xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-xl": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-lg": ["3rem", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
        "display-md": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "display-sm": ["1.875rem", { lineHeight: "1.3" }],
      },
      backgroundImage: {
        "dot-pattern": "radial-gradient(circle, #2D501620 1px, transparent 1px)",
      },
      backgroundSize: {
        "dot-sm": "20px 20px",
        "dot-md": "30px 30px",
        "dot-lg": "40px 40px",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "scale-in": "scaleIn 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
