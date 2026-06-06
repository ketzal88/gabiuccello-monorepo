import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAFAF8",
        foreground: "#1C1917",
        cream: {
          50: "#FAFAF8",
          100: "#F5F5F0",
        },
        victoria: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
        },
        brand: {
          bg: "#0a0a0a",
          "bg-2": "#141414",
          "bg-3": "#1c1c1c",
          ink: "#fafaf5",
          "ink-2": "#d4d4cf",
          "ink-3": "#8b8b85",
          accent: "#f97316",
          "accent-light": "#fb923c",
          line: "#262626",
          "line-2": "#333333",
        },
        paso: {
          1: "#fbbf24",
          2: "#60a5fa",
          3: "#a78bfa",
          4: "#fb923c",
          5: "#f87171",
          6: "#22d3ee",
          7: "#818cf8",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Georgia", "serif"],
        "brand-display": ["var(--font-archivo-black)", "sans-serif"],
        "brand-body": ["var(--font-manrope)", "system-ui", "sans-serif"],
        "brand-mono": ["var(--font-jetbrains-mono)", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-in": "bounceIn 0.5s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "fill-progress": "fillProgress 1s ease-out forwards",
      },
      keyframes: {
        bounceIn: {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        fillProgress: {
          "0%": { width: "0%" },
          "100%": { width: "var(--progress-width)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
