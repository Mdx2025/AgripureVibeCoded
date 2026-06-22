import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand greens (AgriPure design system)
        mint: "#EDF6F3",
        leaf: { DEFAULT: "#6FAE52", hover: "#8BC06F", 600: "#538B3C", 700: "#356A26" },
        forest: { DEFAULT: "#063A12", deep: "#004800", canvas: "#001706", sidebar: "#04210B" },
        // Warm paper surfaces
        paper: { DEFAULT: "#EDEAE0", 2: "#F4F1E8" },
        // Text + hairlines
        ink: "#1E251F",
        fg2: "#5A6157",
        fg3: "#8A958B",
        hair: "#E2DFD2",
        "hair-strong": "#C7CBB8",
      },
      fontFamily: {
        display: ["var(--font-nunito)", "system-ui", "sans-serif"],
        sans: ["var(--font-hanken)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "18px",
        panel: "26px",
      },
      boxShadow: {
        "g-sm": "0 1px 3px rgba(0,40,8,.06)",
        "g-md": "0 4px 12px rgba(0,40,8,.08)",
        "g-lg": "0 12px 32px rgba(0,40,8,.12)",
        "g-xl": "0 24px 60px rgba(0,40,8,.18)",
      },
      maxWidth: {
        container: "1240px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(.16,1,.3,1)",
      },
      backgroundImage: {
        forest: "linear-gradient(160deg,#063A12 0%,#001706 100%)",
        aurora:
          "radial-gradient(120% 90% at 50% 120%, #BFE89A 0%, #6FAE52 32%, #063210 78%, #001706 100%)",
      },
      keyframes: {
        rise: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "none" },
        },
        draw: {
          from: { opacity: "0", transform: "translateX(28px)" },
          to: { opacity: "1", transform: "none" },
        },
        overlay: { from: { opacity: "0" }, to: { opacity: "1" } },
        bouncey: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(9px)" },
        },
      },
      animation: {
        rise: "rise .7s cubic-bezier(.16,1,.3,1) forwards",
        draw: "draw .3s cubic-bezier(.16,1,.3,1)",
        overlay: "overlay .25s ease",
        bouncey: "bouncey 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
