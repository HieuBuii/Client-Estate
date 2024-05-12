import flowbite from "flowbite-react/tailwind";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "768px",
        md: "1024px",
        lg: "1366px",
        "2xl": "1400px",
      },
    },
    screens: {
      sm: "738px",
      md: "1024px",
      lg: "1366px",
    },
    extend: {
      fontFamily: {
        nunito: ["Nunito", "san-serif"],
      },
      flex: {
        2: 2,
        3: 3,
        4: 4,
      },
      screens: {
        xs: "480px",
      },
      colors: {
        primary: "#fece51",
        secondary: "#fcf5f3",
        third: "#fecd5170",
        primaryHover: "#ffdf8d",
      },
    },
  },
  plugins: [flowbite.plugin()],
};
