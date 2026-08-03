const { colors } = require("@vira/core/tokens");

/** @type {import('tailwindcss').Config} */
// Same "Lumina Dark" tokens the web app uses — imported, not copied.
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  // The app is dark-only; "media" would let the OS fight the theme.
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      fontFamily: {
        display: ["Geist"],
        body: ["Inter"],
        data: ["JetBrainsMono"],
      },
      borderRadius: { sm: 4, DEFAULT: 8, md: 12, lg: 16, xl: 24 },
    },
  },
  plugins: [],
};
