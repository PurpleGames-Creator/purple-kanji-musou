import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Noto Serif JP', 'serif'],
      },
      colors: {
        // Purple 基調カスタムカラー
        'purple-primary': '#8b5cf6', // 標準的な紫
        'purple-dark': '#6d28d9', // 濃い紫
        'purple-light': '#c4b5fd', // 薄い紫
      },
      backgroundColor: {
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        'purple-glow': '0 0 20px rgba(139, 92, 246, 0.5)',
        'purple-lg': '0 10px 30px rgba(139, 92, 246, 0.2)',
      },
      animation: {
        'pulse-purple': 'pulse-purple 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'monster-breathe': 'monster-breathe 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-purple': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'monster-breathe': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
