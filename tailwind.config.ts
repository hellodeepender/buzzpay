import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1c1813",
        ink2: "#4a423a",
        muted: "#857a6c",
        paper: "#f8f1e4",
        paper2: "#f2e8d6",
        card: "#fffdf8",
        honey: "#ffb300",
        honeyDeep: "#e08a00",
        moss: "#1e7a4d",
        clay: "#b5462f",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        hard: "4px 4px 0 #1c1813",
        hardsm: "2px 2px 0 #1c1813",
      },
      borderRadius: { xl2: "14px" },
    },
  },
  plugins: [],
};
export default config;
