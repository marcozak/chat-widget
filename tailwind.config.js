/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js}",
  ],
  // Disabilita purging temporaneamente per Shadow DOM
  safelist: [
    // Layout
    'flex', 'flex-col', 'flex-row', 'grid', 'grid-cols-2', 'hidden', 'block', 'inline-block',
    // Position
    'fixed', 'absolute', 'relative', 'static',
    // Flex/Grid
    'items-center', 'items-start', 'justify-center', 'justify-between', 'justify-start', 'grow', 'shrink-0',
    // Sizing
    'w-full', 'w-screen', 'w-48', 'w-64', 'w-72', 'w-[24px]', 'w-[36px]', 'w-[50px]', 'w-[110px]', 'w-[375px]',
    'h-full', 'h-dynamic', 'h-[36px]', 'h-[48px]', 'h-[50px]', 'h-[64px]', 'h-[90px]', 'h-[640px]', 'h-12', 'h-[20px]',
    'min-h-0', 'min-h-10', 'min-h-[64px]', 'max-w-[110px]',
    // Spacing
    'p-3', 'px-2', 'px-3', 'px-5', 'px-[12px]', 'py-2', 'py-3',
    'pt-2', 'pt-3', 'pt-5', 'pb-2', 'pb-5', 'pb-10', 'pb-14', 'pl-3', 'pl-5', 'pr-1', 'pr-2', 'pr-5', 'pr-12',
    'ml-2', 'ml-3', 'ml-5', 'ml-16', 'ml-auto', 'mr-2', 'mr-5', 'mr-auto', 'mt-2', 'mt-4', 'mt-auto', 'mb-1', 'mb-3', 'mb-4',
    // Colors
    'bg-black', 'bg-white', 'bg-blue', 'bg-gray-dark', 'bg-blue-gray',
    'text-white', 'text-black', 'text-blue', 'text-gray', 'text-gray-900',
    'border', 'border-2', 'border-blue',
    // Border radius
    'rounded-full', 'rounded-t-2xl', 'rounded-b-2xl', 'rounded-2xl', 'rounded-3xl', 'rounded-t-3xl', 'rounded-bl-2xl', 'rounded-br-2xl',
    // Typography
    'text-xs', 'text-[8px]', 'text-[9px]', 'text-[10px]', 'text-[16px]', 'font-PeugeotNew', 'font-bold',
    'uppercase', 'italic', 'underline', 'text-left', 'text-right', 'leading-3', 'leading-4', 'leading-5', 'leading-tight',
    'break-words', 'break-normal',
    // Positioning
    'top-0', 'bottom-0', 'bottom-24', 'right-0', 'left-0', 'z-10', 'z-20', 'z-50',
    // Overflow
    'overflow-hidden', 'overflow-y-auto', 'overflow-y-scroll', 'no-scrollbar',
    // States
    'focus:border-transparent', 'focus:outline-none', 'hover:text-white',
    'transition-all', 'duration-200', 'cursor-pointer', 'opacity-80',
    // Misc
    'gap-2', 'bg-gradient-to-b', 'from-black', 'to-gray-dark',
    // Responsive
    'md:bottom-1', 'md:right-4', 'md:w-[375px]', 'md:h-[640px]', 'md:rounded-t-2xl', 'md:rounded-b-2xl', 'md:rounded-2xl', 'md:scrollbar-visible',
    'xs:w-72', 'sm:w-64', 'sm:text-[10px]', 'tall:gap-3', 'tall:pb-1', 'tall:pt-3'
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
      PeugeotNew: ['PeugeotNew', 'sans-serif']
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
