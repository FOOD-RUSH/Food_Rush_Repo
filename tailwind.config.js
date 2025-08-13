/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './App.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        primary: '#007aff',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        text: 'var(--text)',
        'text-secondary': 'var(--text-secondary)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        info: 'var(--info)',
        error: 'var(--error)',
      },
    },
  },
  plugins: [],
};
