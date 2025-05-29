/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        petrol: "#264653",
        olive: "#A9C5A0",
        gold: "#E9C46A",
        beige: "#F6F5F2",
        graphite: "#22223B",
        deepPurple: "#523A68",
      },
    },
  },
  plugins: [],
}