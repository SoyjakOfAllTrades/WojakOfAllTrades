/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'border-stonks-gray/20',
    'bg-stonks-gray/5',
    'border-stonks-gray',
    'bg-stonks-gray/20',
  ],
  theme: {
    extend: {
      colors: {
        wojak: {
          yellow: '#F7E98E',
          pink: '#FFB6C1',
          blue: '#87CEEB',
          green: '#00FF00',
          purple: '#DDA0DD',
        },
        stonks: {
          green: '#00FF00',
          red: '#FF0000',
          dark: '#0A0A0A',
          darker: '#050505',
          gray: '#1A1A1A',
          light: '#F0F0F0',
          accent: '#00D4FF',
          warning: '#FFD700',
          blue: '#0066FF',
          purple: '#8B5CF6',
          orange: '#FF8C00',
          golden: '#FFD700',
          diamond: '#B9F2FF',
        },
      },
      fontFamily: {
        comic: ['Comic Sans MS', 'cursive'],
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
