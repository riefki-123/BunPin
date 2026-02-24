/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          green: '#2FA77C',
          mint: '#7CC8B2',
          light: '#DFF3EC'
        },
        secondary: {
          coral: '#F07C82',
          peach: '#F6A5A8',
          blush: '#FCE3E3'
        },
        neutral: {
          cream: '#F4EDE4',
          white: '#FFFFFF',
          gray: '#6B6B6B',
          dark: '#2C2C2C'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'slide-in': 'slideIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [],
}
