/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: "#6366F1",
        "primary-dark": "#4F46E5",
        enemy: "#EF4444",
        success: "#22C55E",
        warning: "#F59E0B",
        background: "#0F172A",
        "background-light": "#1E293B",
        "surface": "#334155",
        text: "#F8FAFC",
        "text-muted": "#94A3B8",
      },
      fontFamily: {
        pixel: ["'Press Start 2P'", "cursive"],
        sans: ["'Noto Sans SC'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      animation: {
        "attack": "attack 0.5s ease-out",
        "hurt": "hurt 0.3s ease-out",
        "float-up": "floatUp 1s ease-out forwards",
        "shake": "shake 0.3s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "slide-in": "slideIn 0.3s ease-out",
        "bounce-in": "bounceIn 0.5s ease-out",
      },
      keyframes: {
        attack: {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(100px) rotate(10deg)" },
          "100%": { transform: "translateX(0)" },
        },
        hurt: {
          "0%, 100%": { transform: "translateX(0)", filter: "brightness(1)" },
          "25%": { transform: "translateX(-5px)", filter: "brightness(2)" },
          "75%": { transform: "translateX(5px)", filter: "brightness(1.5)" },
        },
        floatUp: {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-50px)", opacity: "0" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-10px)" },
          "75%": { transform: "translateX(10px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(99, 102, 241, 0.5)" },
          "50%": { boxShadow: "0 0 20px rgba(99, 102, 241, 0.8)" },
        },
        slideIn: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        bounceIn: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
