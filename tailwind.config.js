/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          //메인
          backgorund: '#F8F9FC',
          start: '#7B61FF',
          end: '#FF4FD8',
        },
        linear: {
          //Linear
          start: '#FF6363',
          end: '#FF7A59',
        },
        black: '#111827', // 검은글씨
        gray: '#9CA3AF', // 회색글씨
        body: '#4B5563', // 본문
        border: '#E5E7EB', // 테두리
        disabledBg: '#E5E7EB', // 비활성배경
        purple: '#7B61FF', //보라색
        pink: '#FF4FD8', //핑크
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
