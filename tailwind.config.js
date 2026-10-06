/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './App.tsx',
    './index.tsx',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './context/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        maroon: 'rgb(var(--color-primary) / <alpha-value>)',
        anthracite: 'rgb(var(--color-text-main) / <alpha-value>)',
        lavender: '#C8A2C8',
        'off-white': 'rgb(var(--color-bg-main) / <alpha-value>)',
        'card-bg': 'rgb(var(--color-bg-card) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'Tajawal', 'Cairo', 'sans-serif'],
        display: ['Playfair Display', 'Tajawal', 'Cairo', 'serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'border-flow': 'borderFlow 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        borderFlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};
