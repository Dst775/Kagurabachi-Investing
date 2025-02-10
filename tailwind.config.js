import daisyui from 'daisyui';
import themes from 'daisyui/src/theming/themes';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./public/**/*.{html,js,ts}", "./admin/**/*.{html,js,ts}", "./views/**/*.ejs"],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...themes["dark"],
          success: "#EFEFEF",
          secondary: "#f11e1e"
        },
      }
    ]
  }
}