/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:  ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
        mono:  ['var(--font-mono)'],
      },
      colors: {
        surface:  '#0d0d14',
        's1':     '#13131f',
        's2':     '#191926',
        's3':     '#1f1f30',
        indigo:   '#6366f1',
        violet:   '#8b5cf6',
        emerald:  '#34d399',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'fadeup':     'fadeUp 0.5s ease both',
        'glow':       'glow 3s ease-in-out infinite',
        'pulse-dot':  'pulse-dot 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
