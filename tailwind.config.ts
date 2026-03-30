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
        brand: {
          red: "#cb1e27",
          "red-dark": "#a2232e",
          soft: "#eaeef2",
          ink: "#020202",
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(203, 30, 39, 0.35)",
        "glow-lg": "0 0 42px rgba(203, 30, 39, 0.55)",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-150%)" },
          "100%": { transform: "translateX(220%)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "1", filter: "brightness(1)" },
          "50%": { opacity: "0.88", filter: "brightness(1.2)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.8s linear infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
