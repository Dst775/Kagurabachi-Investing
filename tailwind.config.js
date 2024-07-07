import daisyui from 'daisyui';
import themes from 'daisyui/src/theming/themes';

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
    themes: [
      {
        light: {
          ...themes["dark"],
          success: "#2CA3D4",
          secondary: "#EF34B1"
        },
      }
    ]
  }
}