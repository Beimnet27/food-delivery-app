/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ffffffeb",
        secondary: "#BABABA",
        accent: "#f58e33",
        cards: "#a4a4a433",
        cards2: "#a4a4a421",
        cards3: "#2b2b2be2",
        hoverbg: "#8a8a8a",
        headerCard: "#a4a4a433",
        energybar: "#1D1D1D",
        btn: "#ff695a",
        btn2: "#00000066",
        btn4: "#1F2833",
        taskicon: "#6b69699c",
        divider: "#66FCF1",
        borders: "#42361c",
        borders2: "rgb(54, 54, 54)",
        energybar: "#1D1D1D",
        accent2: "#bcbcbc",
        cardtext: "#e7e7e7",
        lime: "#e1f75c",
        dimtext: "#ffffff71",
        divider2: "#554f3f",
        divider3: "#393D43",
        modal: "#0B0C10",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        Inter: ["'Inter', sans-serif"],
        outfit: ["'Outfit', sans-serif"],
        RobotoMono: ["'Roboto Mono', monospace"],
        PublicSans: ["'Public Sans', sans-serif"],
        Monserrat: ["'Montserrat', sans-serif"],
        Syne: ["'Syne', sans-serif"],
        Orkney: ["'Orkney', sans-serif"],
        Cerebri: ["'Cerebri Sans', sans-serif"],
      },
      maxWidth: {
        'app': '650px', // Add a max width of 650px for the app
      },
    },
    screens: {
      xs: "480px", // Small devices (phones)
      sm: "640px", // Small tablets
      md: "768px", // Medium devices (landscape tablets)
      lg: "1024px", // Large devices (laptops)
      xl: "1280px", // Extra large devices
    },
  },
  plugins: [require("tailwindcss")],
};
