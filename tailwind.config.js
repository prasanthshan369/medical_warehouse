/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter_400Regular"],
        "inter-medium": ["Inter_500Medium"],
        "inter-semibold": ["Inter_600SemiBold"],
        "inter-bold": ["Inter_700Bold"],
        "inter-extrabold": ["Inter_800ExtraBold"],
        heading: ["Inter_700Bold"],
        sans: ["Inter_400Regular"],
      },
      colors: {
        primary: "#0F7635",
        textDeep: "#1A1A1A",
        textMain: "#222222",
        textSecondary: "#6A6A6A",
        textMuted: "#969696",
        border: "#E6E6E6",
        borderLight: "#EEEEEE",
        bgMain: "#F9F9F9",
        bgGray: "#F2F2F2",
        blueInfo: "#2196F3",
        warning: "#D9A95D",
        warningBg: "#F5F2DC",
        successBg: "#E8F4EC",
        successBorder: "#A0C9AF",
        partialBg: "#FDF2E2",
        partialBorder: "#EAD2AF",
        completedBg: "#E8F4EC",
        completedBorder: "#A0C9AF",
      },
    },
  },
  plugins: [],
}