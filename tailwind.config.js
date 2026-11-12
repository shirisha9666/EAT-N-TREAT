/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        burgundy: '#64152D',
        berry: '#E91E63',
        strawberry: '#FFB6C8',
        cream: '#FFF0E8',
        cocoa: '#3B1725',
        caramel: '#E6AD57',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        luxe: '0 25px 60px rgba(100, 21, 45, 0.18)',
      },
    },
  },
  plugins: [],
}

