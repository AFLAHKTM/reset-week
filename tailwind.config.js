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
        obsidian: {
          950: '#0a0a0c',
          900: '#111114',
          850: '#16161a',
          800: '#1d1d22',
          700: '#2b2b32',
          600: '#3f3f4a',
        },
        paper: {
          50: '#faf9f5',
          100: '#f5f4ef',
          200: '#eae8e0',
          300: '#dad7cb',
          800: '#2d2b28',
          900: '#191816',
        },
        accent: {
          emerald: '#10b981',
          gold: '#d97706',
          indigo: '#6366f1',
          rose: '#f43f5e',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
        serif: ['Newsreader', 'Georgia', 'serif'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)',
        'elevated': '0 4px 20px -2px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 25px -5px rgba(255, 255, 255, 0.08)',
      }
    },
  },
  plugins: [],
}
