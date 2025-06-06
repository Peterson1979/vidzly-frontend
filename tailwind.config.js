/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-orange': '#F97316',
        'primary-light': '#FFFFFF',
        'secondary-light': '#F3F4F6',
        'text-light': '#1F2937',
        'primary-dark': '#111827',
        'secondary-dark': '#1F2937',
        'text-dark': '#F3F4F6',
      },
      transformOrigin: {
        '0': '0%',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
      },
    },
  },
  plugins: [],
}
