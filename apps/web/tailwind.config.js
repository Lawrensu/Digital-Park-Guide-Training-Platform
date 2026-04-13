/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nature-inspired palette
        'primary': '#16a34a', // green-600
        'primary-light': '#22c55e', // green-500
        'primary-dark': '#15803d', // green-700
        'secondary': '#84cc16', // lime-500
        'accent': '#f59e0b', // amber-500
        'earth': '#78350f', // amber-900
        'water': '#0369a1', // sky-700
      },
      fontFamily: {
        'sans': ['Poppins', 'system-ui', 'sans-serif'],
        'serif': ['Merriweather', 'Georgia', 'serif'],
        'heading': ['Poppins', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['12px', '16px'],
        'sm': ['14px', '20px'],
        'base': ['16px', '24px'],
        'lg': ['18px', '28px'],
        'xl': ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['30px', '36px'],
        '4xl': ['36px', '40px'],
        '5xl': ['48px', '48px'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 6px rgba(0, 0, 0, 0.07)',
        'medium': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'large': '0 20px 25px rgba(0, 0, 0, 0.15)',
      },
      backgroundImage: {
        'nature-gradient': 'linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #84cc16 100%)',
        'nature-gradient-dark': 'linear-gradient(135deg, #15803d 0%, #16a34a 50%, #4ade80 100%)',
      },
    },
  },
  plugins: [],
}
