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
        brand: {
          primary: "#7C3AED",
          "primary-hover": "#6D28D9",
        },
        dark: {
          bg: "#0B1020",
          card: "#151B2F",
          text: "#F8FAFC",
          muted: "#94A3B8",
        },
        light: {
          bg: "#FFFFFF",
          "bg-secondary": "#F8FAFC",
          text: "#0F172A",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
