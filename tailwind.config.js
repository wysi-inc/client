/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        'custom': {
          '50': '#f6f7f9',
          '100': '#ededf1',
          '200': '#d6d8e1',
          '300': '#b3b7c6',
          '400': '#8990a7',
          '500': '#6a718d',
          '600': '#555a74',
          '700': '#414558',
          '800': '#3c4050',
          '900': '#353745',
          '950': '#23252e',
        },
      }
    }
  },
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  daisyui: {
    themes: [
      {
        wysi: {
          ...require("daisyui/src/theming/themes")["[data-theme=dracula]"],
          'text': '#ffffff',
          'primary-content': '#ffffff',
          'secondary-content': '#ffffff',
          'base-content': '#ffffff',
          "--border-btn": "0px", // border width of buttons
        },
      },
    ],
  },
  plugins: [require("daisyui")],
}

