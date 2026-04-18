/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#F97316',
        primary: '#6366f1',
        success: '#22c55e',
      },
      boxShadow: {
        glow: '0 0 24px rgba(249, 115, 22, 0.45)',
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(circle at 8% 12%, rgba(99,102,241,0.34), transparent 40%), radial-gradient(circle at 88% 8%, rgba(249,115,22,0.2), transparent 36%), linear-gradient(180deg, #020617 0%, #0f172a 55%, #020617 100%)',
      },
    },
  },
  plugins: [],
};
