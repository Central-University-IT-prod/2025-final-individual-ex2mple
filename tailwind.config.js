/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      inherit: 'inherit',
      current: 'currentColor',
      'black': '#121212',
      'white': '#f6f2f2',
      'neo-green': '#97FB57',
      'gray': '#909090',
      'danger': '#ef4444',
      'success': '#6C9A3D',
      'warning': '#F49649',
    },
  },
  darkMode: 'selector',
  plugins: [],
}