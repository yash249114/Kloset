import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ivory: { DEFAULT: '#FAF7F2', dark: '#F2EDE4' },
        champagne: { DEFAULT: '#C9A96E', light: '#E8D5B0' },
        'rose-gold': { DEFAULT: '#B76E79', light: '#F2C4CE' },
        charcoal: { DEFAULT: '#2C2C2C', mid: '#4A4A4A', light: '#6B6B6B' },
        'warm-white': '#FFFCF8',
        gold: '#D4A853',
        border: '#E8E0D5',
        success: '#4CAF7D',
        error: '#E07070',
        admin: {
          bg: '#0F0F0F',
          surface: '#1A1A1A',
          sidebar: '#161616',
          border: '#2A2A2A',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
