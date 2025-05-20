/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'float-slow': 'float 20s ease-in-out infinite',
        'float-medium': 'float 15s ease-in-out infinite',
        'float-fast': 'float 10s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'ripple': 'ripple 0.6s linear',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(10px, 10px) rotate(5deg)' },
          '50%': { transform: 'translate(5px, 15px) rotate(0deg)' },
          '75%': { transform: 'translate(-5px, 10px) rotate(-5deg)' },
          '100%': { transform: 'translate(0, 0) rotate(0deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
