/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './App.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
        144: '36rem',
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
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
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0, 0, 0, 0.1)',
        medium: '0 4px 16px rgba(0, 0, 0, 0.15)',
        large: '0 8px 32px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};
