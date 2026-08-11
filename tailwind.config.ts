import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./europa-flow/index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        danger: "#d93f55",
        success: "#1c9b62",
        warning: "#d78610",
        nav: "#101b33"
      },
      borderRadius: { lg: "12px", md: "9px", sm: "7px" },
      boxShadow: { card: "0 2px 8px rgba(24,37,75,.06)" }
    }
  },
  plugins: []
} satisfies Config;
