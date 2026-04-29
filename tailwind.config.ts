import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1a2a4a",
          50: "#e8ecf3",
          100: "#c5cedf",
          700: "#1a2a4a",
          800: "#121e35",
          900: "#0a1220",
        },
        crimson: "#c0392b",
        forest: "#1e6b3c",
        steel: "#185fa5",
        gold: {
          DEFAULT: "#b7950b",
          light: "#f0d060",
          muted: "#d4a70d",
        },
        paper: {
          DEFAULT: "#fdf9f0",
          dark: "#f5f0e4",
          line: "#e8e0d0",
        },
        warm: {
          bg: "#f5f3ee",
          card: "#fdf9f0",
        },
      },
      fontFamily: {
        serif: ["Lora", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["'Crimson Pro'", "Georgia", "serif"],
      },
      backgroundImage: {
        "notebook-lines": `repeating-linear-gradient(transparent, transparent 31px, #e8e0d0 31px, #e8e0d0 32px)`,
        "hero-grid": `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
      },
      backgroundSize: {
        "notebook-lines": "100% 32px",
        "hero-grid": "40px 40px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(26,42,74,0.06)",
        "card-hover": "0 6px 20px rgba(26,42,74,0.12)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
