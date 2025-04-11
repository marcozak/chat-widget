/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js}",
  ],
  theme: {
    screens: {
      xxs: '390px',
      xs: '400px',
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },

    fontFamily: {
      PeugeotNew: ['PeugeotNew', 'sans-serif'],
      PeugeotNewBold: ['PeugeotNewBold', 'sans-serif']
    },
    extend: {
      colors: {
        'blue': '#0174E7',
        'blue-light': '#00A3E0',
        'blue-medium': '#007FAE',
        'blue-deep': '#0056AC',
        'blue-gray': '#445C82',
        'gray-dark': '#313131',
        'gray': '#ADAEB2'
      },
      screens: {
        'tall': { 'raw': '(min-height: 800px)' },
        // => @media (min-height: 800px) { ... }
      },
      keyframes: {
        "slide-in-up": {
          "0%": {
              visibility: "visible",
              transform: "translate3d(0, 90%, 0)",
          },
          "100%": {
              transform: "translate3d(0, 0, 0)",
          },
        },
      },
      animation: {
        slideinup: 'slide-in-up 1s ease-in-out 0.25s 1',
      }
    },
    plugins: [],
  }
}
