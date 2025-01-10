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
        'custom-radial': 'radial-gradient(circle, #351F6A, #18072C)',
      },
      colors: {
        // e-commerce: Colors
        primary: '#1A73E8',
        secondary: '#34A853',
        accent: '#FBBC05',
        neutral: {
          light: '#F9F9F9',
          dark: '#202124',
        },
        custom: {
          dark: '#18072C',
          medium: '#351F6A',
          accentLight: '#5B3A91',
          accentDark: '#12051F',
          highlight: '#7A5CB6',
          muted: '#2C194E',
          complementary: '#6A4A35',
          softGlow: '#9982C2',
          // e-commerce: Themes
        },
        'red-1': '#FF0000',
        'gray-1': '#F7F7F7',
        'gray-2': '#8A8A8A',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
export default config;
