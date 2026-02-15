import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Apple-inspired palette
        apple: {
          black: '#1d1d1f',
          blue: '#0071e3',
          'blue-hover': '#0077ed',
          gray: {
            50: '#f5f5f7',
            100: '#f9f9f9',
            200: '#e8e8ed',
            300: '#d2d2d7',
            400: '#86868b',
            500: '#6e6e73',
          },
        },
        // Keep primary/accent as aliases for backward compat during migration
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#0071e3',
          600: '#0077ed',
          700: '#005bb5',
          800: '#004a94',
          900: '#003a75',
        },
        accent: {
          purple: '#6e6e73',
          blue: '#0071e3',
          pink: '#86868b',
          cyan: '#0071e3',
        },
        // Dark mode
        dark: {
          bg: '#000000',
          surface: '#161617',
          card: '#1d1d1f',
          border: '#424245',
          hover: '#2c2c2e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
