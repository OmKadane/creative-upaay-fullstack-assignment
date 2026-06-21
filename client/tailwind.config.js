/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette
        brand: {
          50:  '#f3f0ff',
          100: '#e9e3ff',
          200: '#d5caff',
          300: '#b8a4ff',
          400: '#9775ff',
          500: '#7c4dff',  // Primary purple
          600: '#6c35f5',
          700: '#5a22d9',
          800: '#4a1cb5',
          900: '#3d1893',
        },
        dark: {
          900: '#0a0a0f',  // Deepest background
          800: '#111118',  // Card background
          700: '#1a1a24',  // Elevated surface
          600: '#242436',  // Borders / dividers
          500: '#2e2e45',  // Input background
          400: '#3d3d58',  // Muted borders
        },
        // Seat states
        seat: {
          available: '#2e2e45',
          selected: '#7c4dff',
          occupied: '#3a3a3a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        mobile: '390px',
      },
      screens: {
        // No external breakpoints needed; mobile-only
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'bounce-soft': 'bounceSoft 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'brand': '0 4px 24px rgba(124, 77, 255, 0.3)',
        'brand-lg': '0 8px 40px rgba(124, 77, 255, 0.4)',
        'card': '0 2px 16px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.6)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
