/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        card: "#ffffff",
        foreground: "#161a26",
        "muted-foreground": "#5d646f",
        muted: "#f6f1e9",
        border: "#e9e4dc",
        background: "#fdfaf4",
        primary: "#22c55e",
        destructive: "#ef4444",
        "destructive-foreground": "#ffffff",
      },
      fontFamily: {
        sans: ["DM_Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
