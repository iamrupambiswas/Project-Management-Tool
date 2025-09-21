/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 1. Font Families
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      // 2. Color Palette
      colors: {
        'background-dark': '#0A0B1A',
        'background-light': '#06071B',
        "background-content": "#121424",
        'text-base': '#EAECEE',
        'text-muted': '#DDE0E3',
        'accent-blue': '#00C0FF',
        'accent-purple': '#6D28D9',
        'accent-green': '#05E6A3',
        'warning-orange': '#FF8C00',
        'error-red': '#EF4444',
      },
      // 3. Spacing & Sizing Scale
      fontSize: {
        'xs': '0.75rem',   // 12px
        'sm': '0.875rem',  // 14px
        'base': '1rem',    // 16px (standard for form inputs, etc.)
        'lg': '1.125rem',  // 18px (section titles)
        'xl': '1.25rem',   // 20px
        '2xl': '1.5rem',   // 24px
        '3xl': '2rem',     // 32px (main headlines)
      },
      // 4. Custom Shadows for the "mysterious" look
      boxShadow: {
        'glow-sm': '0 2px 10px rgba(0, 192, 255, 0.2)',
        'glow-md': '0 4px 20px rgba(0, 192, 255, 0.3)',
      },
    },
  },
  plugins: [],
}