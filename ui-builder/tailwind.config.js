const path = require("path")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    path.join(
      path.dirname(require.resolve("flowbite-react")),
      "**/*.{js,jsx,ts,tsx}"
    )
  ],
  theme: {
    extend: {}
  },
  plugins: [require("flowbite/plugin")]
}
