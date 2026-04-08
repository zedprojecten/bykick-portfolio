import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      colors: {
        sunset: {
          50: "#fff7ed",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
        },
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out forwards",
        "gradient-shift": "gradient-shift 8s ease infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
