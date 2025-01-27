import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontSize: {
        'heading1-bold': [
          '50px',
          {
            lineHeight: '100%',
            fontWeight: '700',
          },
        ],
        'heading2-bold': [
          '30px',
          {
            lineHeight: '100%',
            fontWeight: '700',
          },
        ],
        'heading3-bold': [
          '24px',
          {
            lineHeight: '100%',
            fontWeight: '700',
          },
        ],
        'heading4-bold': [
          '20px',
          {
            lineHeight: '100%',
            fontWeight: '700',
          },
        ],
        'body-bold': [
          '18px',
          {
            lineHeight: '100%',
            fontWeight: '700',
          },
        ],
        'body-semibold': [
          '18px',
          {
            lineHeight: '100%',
            fontWeight: '600',
          },
        ],
        'body-medium': [
          '18px',
          {
            lineHeight: '100%',
            fontWeight: '500',
          },
        ],
        'base-bold': [
          '16px',
          {
            lineHeight: '100%',
            fontWeight: '600',
          },
        ],
        'base-medium': [
          '16px',
          {
            lineHeight: '100%',
            fontWeight: '500',
          },
        ],
        'small-bold': [
          '14px',
          {
            lineHeight: '140%',
            fontWeight: '700',
          },
        ],
        'small-medium': [
          '14px',
          {
            lineHeight: '140%',
            fontWeight: '500',
          },
        ],
      },
      fontFamily: {
        Noto_Sans_Bengali: ['var(--font-notosansbangla)', 'sans-serif'],
      },
      backgroundImage: {
        // #003366
        'custom-radial': 'radial-gradient(circle, #00ADB5, #00888F)',
      },
      colors: {
        'bondi-blue': {
          DEFAULT: '#00ABB3',
          50: '#99FAFF',
          100: '#80F9FF',
          200: '#4DF7FF',
          300: '#1AF5FF',
          400: '#00DBE6',
          500: '#00ABB3',
          600: '#00888F',
          700: '#00436B',
          800: '#002147',
          900: '#000A24',
          950: '#000412',
        },
        'custom-gray': {
          DEFAULT: '#616161',
        },
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
export default config;
