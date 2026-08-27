import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1c1a17",
        paper: "#faf8f5",
        brass: "#9c7a3c",
      },
    },
  },
  plugins: [],
};

export default config;
