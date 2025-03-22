// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",       // ✅ typical for React apps
    "./container/**/*.{js,ts,jsx,tsx}", // ✅ add this for your folder
    "./component/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
