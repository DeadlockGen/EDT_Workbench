/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f5ff',
          100: '#dbe4ff',
          200: '#bac8ff',
          300: '#91a7ff',
          400: '#748ffc',
          500: '#1677ff',
          600: '#0958d9',
          700: '#003eb3',
          800: '#002c8c',
          900: '#001d66'
        }
      },
      fontFamily: {
        sans: ["'Segoe UI'", '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ["'Cascadia Code'", "'Fira Code'", "'Consolas'", 'monospace']
      },
      spacing: {
        '4xs': '2px',
        '3xs': '4px',
        '2xs': '8px',
        xs: '12px',
        sm: '16px',
        md: '24px',
        lg: '32px',
        xl: '40px'
      },
      fontSize: {
        '2xs': ['11px', '16px'],
        xs: ['12px', '18px'],
        sm: ['13px', '20px'],
        base: ['14px', '22px']
      }
    }
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
}
