/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#070708",
          900: "#0D0D0F",
          850: "#121214",
          800: "#18181B",
          700: "#222226",
        },
        bone: "#F2F2F2",
        mute: "#8F8F96",
        dim: "#5F5F66",
        accent: {
          DEFAULT: "#E5252A",
          soft: "#FF4D4F",
          deep: "#8E0E12",
        },
        ember: "#FF8A76",
        silver: "#B8B8BF",
      },
      fontFamily: {
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Anton"', '"Impact"', '"Arial Narrow"', "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
        script: ['"Mrs Saint Delafield"', "cursive"],
      },
      borderColor: {
        line: "rgba(255,255,255,0.08)",
        "line-strong": "rgba(255,255,255,0.14)",
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        pulseDot: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.7" },
          "50%": { transform: "scale(2.4)", opacity: "0" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "48%": { opacity: "1" },
          "50%": { opacity: "0.55" },
          "52%": { opacity: "1" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "pulse-dot": "pulseDot 2s ease-out infinite",
        flicker: "flicker 6s linear infinite",
      },
    },
  },
  plugins: [],
};
