import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Refined LifeCharter Brand Colors based on Babs' design
        "navy": {
          DEFAULT: "#1a2b4a",
          light: "#2a3b5a",
          dark: "#0f1a2e",
        },
        "gold": {
          DEFAULT: "#c9a227",
          light: "#d4b43a",
          dark: "#a88b1e",
        },
        "cream": {
          DEFAULT: "#F8F5F0",
          light: "#FFFCF7",
          dark: "#EDE8E0",
        },
        "lavender": {
          DEFAULT: "#e8e4f0",
          light: "#f0eef5",
          dark: "#d4cee0",
        },
        "teal": {
          DEFAULT: "#4a9b9b",
          light: "#5ab0b0",
          dark: "#3a8585",
        },
        "plum": {
          DEFAULT: "#7b6b8d",
          light: "#8b7b9d",
          dark: "#6b5b7d",
        },
        // Legacy mappings for compatibility
        "deep-indigo": "#1a2b4a",
        "royal-plum": "#7b6b8d",
        "sacred-teal": "#4a9b9b",
        "soft-lavender": "#e8e4f0",
        "warm-gold": "#c9a227",
        "ivory-light": "#F8F5F0",
        "soft-taupe": "#b8a898",
        // Shadcn defaults
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1.25rem",
        "2xl": "1.5rem",
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(26, 43, 74, 0.08)',
        'soft-lg': '0 8px 30px rgba(26, 43, 74, 0.12)',
        'glow': '0 0 20px rgba(201, 162, 39, 0.3)',
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};

export default config;