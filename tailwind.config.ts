import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        calm: {
          bg: "#fafaf8",
          surface: "#ffffff",
          subtle: "#f4f5f7",
          border: "#e2e5ea",
          "border-hover": "#cbd2d9",
          muted: "#64748b",
          text: "#1e293b",
          heading: "#0f172a",
        },
        primary: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
        },
        accent: {
          blue: "#0284c7",
          sky: "#0ea5e9",
          navy: "#0f2338",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "'Noto Sans Devanagari'",
          "sans-serif",
        ],
      },
      minHeight: {
        screen: "100dvh",
      },
      height: {
        screen: "100dvh",
      },
      boxShadow: {
        soft: "0 2px 10px -2px rgba(15, 23, 42, 0.05), 0 1px 3px -1px rgba(15, 23, 42, 0.03)",
        card: "0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -2px rgba(15, 23, 42, 0.03)",
        focus: "0 0 0 3px rgba(13, 148, 136, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
