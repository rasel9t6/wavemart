import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
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
    extend: {
      backgroundImage: {
        // #003366
        'custom-radial': 'radial-gradient(circle, #003366, #001e3c)',
      },
      colors: {
        midnight: {
          DEFAULT: '#001E3C',
          50: '#C6E2FF',
          100: '#A2D0FF',
          200: '#5BADFF',
          300: '#1389FF',
          400: '#0065CB',
          500: '#004283',
          600: '#001E3C', // Default color
          700: '#001932',
          800: '#001428',
          900: '#000F1D',
          950: '#000C18',
        },
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
export default config;
