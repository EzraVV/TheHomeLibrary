/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./client/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2F5D50',
        secondary: '#6B4F3A',
        accent: '#C89B5B',
        background: '#F5F1EA',
        surface: '#FFFDF9',
        border: '#D8D1C7',
        'text-primary': '#1F1F1F',
        'text-muted': '#4B4B4B',
        success: '#4E8B62',
        warning: '#D1A248',
        danger: '#B44C4C',
      },
      fontFamily: {
        heading: ['Merriweather', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        pill: '9999px',
      },
      boxShadow: {
        card: '0 2px 6px rgba(0, 0, 0, 0.06)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        180: '180ms',
      },
      maxWidth: {
        app: '1200px',
      },
    },
  },
  plugins: [],
}
