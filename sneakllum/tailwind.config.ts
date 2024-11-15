import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "rgb(234 179 8)",
        primaryhover: "rgb(251 146 60)",
        secondary: "rgb(0 0 0)",
        secondaryhover: "rgb(247 247 247)",
      },
      fontsize: {
        test: ""
      },
    },
  },
  plugins: [],
} satisfies Config;
