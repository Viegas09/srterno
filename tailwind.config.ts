import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#171310",
        "ink-soft": "#221c16",
        leather: "#2e2419",
        paper: "#f6f1e7",
        card: "#fffdf8",
        line: "#e6dcc6",
        "line-dark": "#3c3225",
        gold: "#b1873f",
        "gold-soft": "#e9dbb8",
        "gold-deep": "#8a6529",
        bordeaux: "#7c2c34",
        "bordeaux-soft": "#f3e0df",
      },
      boxShadow: {
        card: "0 1px 2px rgba(23, 19, 16, 0.04), 0 8px 24px -12px rgba(23, 19, 16, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
