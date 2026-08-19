/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FFF3F6",
        ink: "#3B1F2B",
        muted: "#9C6B7C",
        line: "#F4C9D6",
        accent: "#E0447B",
        accentSoft: "#FDE3EC",
        blush: "#FFD9E6",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        comic: ["'Bangers'", "cursive"],
        comicBody: ["'Comic Neue'", "cursive"],
      },
    },
  },
  plugins: [],
};
