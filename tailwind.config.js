/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        gradient: "gradient 3s ease infinite",
        backgroundImage: {
          "custom-gradient":
            "linear-gradient(to right, #5088FF, #DAE5FF, #FFFFFF)",
        },
      },
      keyframes: {
        gradient: {
          "0%": { "background-position": "0% 50%" },
          "100%": { "background-position": "100% 50%" },
        },
      },
      backgroundSize: {
        "200%": "200% 200%",
      },
    },
  },
  plugins: [],
};
