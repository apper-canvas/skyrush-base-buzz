/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          light: '#818cf8',
          dark: '#4f46e5'
        },
        secondary: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          dark: '#d97706'
        },
        accent: '#ef4444',
        success: '#10b981',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'neu-light': '5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff',
        'neu-dark': '5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.05)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.3)'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem'
      },
animation: {
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'crash': 'crash 0.5s ease-out',
        'smooth-fly': 'smooth-fly 4s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite',
        'gentle-float': 'gentle-float 2s ease-in-out infinite',
        'dramatic-crash': 'dramatic-crash 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        crash: {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '100%': { transform: 'scale(0.5) rotate(45deg)', opacity: '0' }
        },
        'smooth-fly': {
          '0%': { transform: 'translate(0px, 0px) rotate(-5deg) scale(1)' },
          '25%': { transform: 'translate(120px, -80px) rotate(-15deg) scale(1.05)' },
          '50%': { transform: 'translate(280px, -180px) rotate(-25deg) scale(1.1)' },
          '75%': { transform: 'translate(420px, -280px) rotate(-30deg) scale(1.15)' },
          '100%': { transform: 'translate(600px, -400px) rotate(-35deg) scale(1.2)' }
        },
        'gentle-float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(-5deg)' },
          '50%': { transform: 'translateY(-8px) rotate(-3deg)' }
        },
        'dramatic-crash': {
          '0%': { transform: 'rotate(-35deg) scale(1.2)' },
          '30%': { transform: 'rotate(45deg) scale(1.4)' },
          '70%': { transform: 'rotate(180deg) scale(0.8)' },
          '100%': { transform: 'rotate(270deg) scale(0.3)', opacity: '0.1' }
        }
      }
    }
  },
  plugins: [],
  darkMode: 'class',
}