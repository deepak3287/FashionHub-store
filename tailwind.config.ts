import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        cream: "#F7F1E8",
        champagne: "#D4AF37",
        mutedgold: "#B9924B",
        softgray: "#F5F5F5"
      },
      boxShadow: {
        premium: "0 20px 60px rgba(17,17,17,0.10)"
      },
      borderRadius: {
        "2xl": "1.25rem"
      }
    }
  },
  plugins: [require("@tailwindcss/forms")]
};

export default config;
