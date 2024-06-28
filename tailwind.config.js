/** @type {import('tailwindcss').Config} */

// wr: 'well-read'
module.exports = {
  content: [
    './src/**/*.{html,ts}',
    "./node_modules/flowbite/**/*.js"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'bg-blog': "url('/assets/icon/blog.png')",
        'counter': "url('/assets/image/counter.jpg')",
      },
      colors: {
        dark: {
          '50': '#f5f6f6',
          '100': '#e4e7e9',
          '200': '#ccd1d5',
          '300': '#a9b1b7',
          '400': '#7e8892',
          '500': '#626c78',
          '600': '#545b66',
          '700': '#484e56',
          '800': '#40444a',
          '900': '#393b40',
          '950': '#222428',
        },
        wr: {
          '50': '#fef3f2',
          '100': '#fce9e7',
          '200': '#f9d3d2',
          '300': '#f4afad',
          '400': '#ed807f',
          '500': '#e15254',
          '600': '#bb2d36',
          '700': '#ac2430',
          '800': '#90212f',
          '900': '#7c1f2d',
          '950': '#450c13',
        },
        cb: {
          '50': '#f0f2fe',
          '100': '#dee2fb',
          '200': '#c4cef9',
          '300': '#9badf5',
          '400': '#6c84ee',
          '500': '#3d51e6',
          '600': '#343ddc',
          '700': '#2b2bca',
          '800': '#2c29a4',
          '900': '#262682',
          '950': '#1d1c4f',
        },
        bo: {
          '50': '#fff8ec',
          '100': '#fff0d3',
          '200': '#ffdca5',
          '300': '#ffc26d',
          '400': '#ff9d32',
          '500': '#ff7f0a',
          '600': '#ff6600',
          '700': '#cc4902',
          '800': '#a1390b',
          '900': '#82310c',
          '950': '#461604',
        },
        br: {
          '50': '#edf8ff',
          '100': '#d6efff',
          '200': '#b5e4ff',
          '300': '#83d5ff',
          '400': '#48bcff',
          '500': '#1e9aff',
          '600': '#067aff',
          '700': '#0166ff',
          '800': '#084ec5',
          '900': '#0d459b',
          '950': '#0e2b5d',
        }
      },
      fontFamily: {
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
        marquee2: 'marquee2 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio')
    , require('@tailwindcss/forms')
    , require('@tailwindcss/typography')
  ],
};
