import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'accent': '#00d2d2',  // Accent color (light cyan)
        'dark': '#181818',    // Dark background color
        'dark-secondary': '#222', // Secondary dark color for containers
        'light': '#f5f5f5',   // Light text color
      },
    },
  },
  plugins: [],
} satisfies Config;
