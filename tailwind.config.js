/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'in-coral':       'var(--in-coral)',
        'in-coral-dark':  'var(--in-coral-dark)',
        'in-coral-text':  'var(--in-coral-text)',
        'in-rose':        'var(--in-rose)',
        'in-peach':       'var(--in-peach)',
        'in-blush':       'var(--in-blush)',
        'in-cream':       'var(--in-cream)',
        'in-warm-white':  'var(--in-warm-white)',
        'in-charcoal':    'var(--in-charcoal)',
        'in-dark':        'var(--in-dark)',
        'in-gray':        'var(--in-gray)',
        'in-gray-light':  'var(--in-gray-light)',
      },
      fontFamily: {
        sans:  ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      borderRadius: {
        'sm': '8px',
        DEFAULT: '12px',
        'md': '14px',
        'lg': '20px',
        'xl': '28px',
        '2xl': '36px',
      },
      boxShadow: {
        'in':    'var(--in-shadow)',
        'in-lg': 'var(--in-shadow-lg)',
      },
      animation: {
        'float':    'float 6s ease-in-out infinite',
        'glow':     'glow 3s ease-in-out infinite',
        'fade-in':  'fadeIn 0.4s ease both',
        'slide-up': 'slideUp 0.4s ease both',
        'spin-slow':'spin 0.65s linear infinite',
      },
      keyframes: {
        float:    { '0%,100%': { transform:'translateY(0)' }, '50%': { transform:'translateY(-8px)' } },
        glow:     { '0%,100%': { opacity:'0.4', transform:'scale(1)' }, '50%': { opacity:'0.8', transform:'scale(1.1)' } },
        fadeIn:   { from: { opacity:'0', transform:'translateY(8px)' }, to: { opacity:'1', transform:'translateY(0)' } },
        slideUp:  { from: { opacity:'0', transform:'translateY(20px)' }, to: { opacity:'1', transform:'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
