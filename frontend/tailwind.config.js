// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit', // optional in v3+, but OK to leave
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: { light: '#6D9EFF', DEFAULT: '#3478F6', dark: '#285DC2' },
        success: '#38A169',
        danger:  '#E53E3E',
        muted:   '#A0AEC0'
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        '3xl': ['1.75rem', { lineHeight: '2rem' }]
      },
      borderRadius: { xl: '1rem' },
      boxShadow:   { card: '0 2px 8px rgba(0,0,0,0.1)' }
    }
  },
  plugins: []
}