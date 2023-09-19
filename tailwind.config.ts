import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      screens: {
        "m-s": "320px",
        "m-m": "375px",
        "m-l": "425px",
        t: "768px",
        "l-s": "1024px",
        "l-l": "1440px",
      },
      fontFamily: {
        body: "var(--poppins)",
      },
      colors: {
        primary: {
          900: "#10197A",
          800: "#1A2793",
          700: "#2A3BB7",
          600: "#3D53DB",
          500: "#546FFF",
          400: "#9F84FD",
          300: "#98ABFF",
          200: "#BAC8FF",
          100: "#DCE4FF",
        },
        secondary: {
          900: "#040815",
          800: "#060713",
          700: "#0A0A18",
          600: "#0E0F1D",
          500: "#141522",
          400: "#54577A",
          300: "#8E92BC",
          200: "#C2C6E8",
          100: "#DFE1F3",
        },
        sucess: {
          900: "#3B6506",
          800: "#4C7A0B",
          700: "#659711",
          600: "#7FB519",
          500: "#9CD323",
          400: "#BCE455",
          300: "#D3F178",
          200: "#E8FAA6",
          100: "#F5FCD2",
        },
        error: {
          900: "#7A0619",
          800: "#930B16",
          700: "#B71112",
          600: "#DB2719",
          500: "#FF4423",
          400: "#FF7F59",
          300: "#FFA37A",
          200: "#FFC8A6",
          100: "#FFE7D3",
        },
        warning: {
          900: "#7A4D0B",
          800: "#936312",
          700: "#B7821D",
          600: "#DBA32A",
          500: "#FFC73A",
          400: "#FFD96B",
          300: "#FFE488",
          200: "#FFEFB0",
          100: "#FFF8D7",
        },
        information: {
          900: "#102E7A",
          800: "#1A4393",
          700: "#2A60B7",
          600: "#3D81DB",
          500: "#54A6FF",
          400: "#7EC2FF",
          300: "#98D3FF",
          200: "#BAE5FF",
          100: "#DCF3FF",
        },
      },
      animation: {
        float: "float 3s ease-in-out alternate infinite",
      },
      keyframes: {
        float: {
          "0%": {
            transform: "translateY(-3%)",
          },
          "100%": {
            transform: "translateY(3%)",
          },
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
export default config;
