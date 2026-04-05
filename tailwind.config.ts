import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          500: '#a78bfa',
          600: '#9333ea',
          700: '#7e22ce',
          900: '#4c0519',
        },
        // Theme-aware semantic color tokens (resolved via CSS custom properties)
        'app-bg':      'rgb(var(--app-bg) / <alpha-value>)',
        'app-card':    'rgb(var(--app-card) / <alpha-value>)',
        'app-inner':   'rgb(var(--app-inner) / <alpha-value>)',
        'app-text':    'rgb(var(--app-text) / <alpha-value>)',
        'app-text-2':  'rgb(var(--app-text-2) / <alpha-value>)',
        'app-text-3':  'rgb(var(--app-text-3) / <alpha-value>)',
        'app-primary': 'rgb(var(--app-primary) / <alpha-value>)',
        'app-border':  'rgb(var(--app-border) / <alpha-value>)',
      },
      spacing: {
        'safe-bottom': 'var(--safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
} satisfies Config
