import daisyui from 'daisyui'
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./public/**/*.{html,js,ts}", "./admin/**/*.{html,js,ts}"],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui
  ],
  daisyui: {
    themes: ["dark"]
  }
}