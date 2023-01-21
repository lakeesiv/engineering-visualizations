/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        b: {
          900: "#0a0a0a",
          800: "#141414",
        },
      },
    },
  },
  plugins: [],
};
