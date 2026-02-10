export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#D4AF37', // Gold for primary buttons
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        'classic-cream': '#f0fdfa', // Teal 50
        'classic-navy': '#134e4a', // Teal 900
        'premium-dark': '#f0fdfa', // Teal 50 (Light Teal Bg)
        'premium-card': '#ffffff', // White
        'premium-gold': '#0d9488', // Teal 600 (Primary Brand)
        'premium-gold-light': '#2dd4bf', // Teal 400
        'premium-gold-dark': '#115e59', // Teal 800
        'premium-text': '#134e4a', // Teal 900 (Deep Green/Teal Text)
        'premium-slate': '#5eead4', // Teal 300 (Accents) or Slate-500 #64748b
        'premium-slate-text': '#334155', // Slate 700 for body text
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%)', // Teal Gradient
        'dark-gradient': 'radial-gradient(circle at center, #ccfbf1 0%, #f0fdfa 100%)', // Soft Teal Glow
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}