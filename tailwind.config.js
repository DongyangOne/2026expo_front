/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#3B82F6', dark: '#2563EB' },
        secondary: '#6B7280',
        danger: '#EF4444',
      },
      fontFamily: {
        notoSansKRDemiLight: ['NotoSansKR-DemiLight'],
        notoSansKRRegular: ['NotoSansKR-Regular'],
        notoSansKRBold: ['NotoSansKR-Bold'],
      },
    },
  },
  plugins: [],
};
