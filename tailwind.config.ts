import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
    container: {
      padding: {
        DEFAULT: '16px',
      },
    },
    colors: {
      transparent: 'transparent',
      'green': 'var(--green)',
      'black': 'var(--black)',
      'secondary': 'var(--secondary)',
      'secondary2': 'var(--secondary2)',
      'white': 'var(--white)',
      'surface': 'var(--surface)',
      'red': 'var(--red)',
      'purple': 'var(--purple)',
      'success': 'var(--success)',
      'yellow': 'var(--yellow)',
      'pink': 'var(--pink)',
      'line': 'var(--line)',
      'outline': 'var(--outline)',
      'surface2': 'var(--surface2)',
      'surface1': 'var(--surface1)',
      'bg': 'var(--color-bg)',
      'text': 'var(--color-text)',
      'bg-surface': 'var(--color-surface)',
      'bg-line': 'var(--color-line)',
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      },
      blue: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
    },
  },
  plugins: [],
}
export default config
