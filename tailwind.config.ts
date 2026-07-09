import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Anton', 'system-ui', 'sans-serif'],
      },
      colors: {
        latenta: {
          bighorn: '#1E1510',
          varnish: '#B85C38',
          sugar: '#C9A87A',
          evening: '#7A7A3D',
          subtle: '#E8D4C0',
          'muted-light': '#6b5a4a',
          'muted-subtle': '#8a7360',
        },
        surface: 'var(--surface)',
        'surface-elevated': 'var(--surface-elevated)',
        text: 'var(--text)',
        'text-muted': 'var(--text-muted)',
        'text-subtle': 'var(--text-subtle)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
} satisfies Config
