/** @type {import('tailwindcss').Config} */

export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        screens: {
            sm: '640px', // Small screens
            md: '768px', // Medium screens
            lg: '1024px', // Large screens
            xl: '1280px', // Extra large screens
            '2xl': '1536px', // 2 Extra large screens
            '2xxl': '1650px' // Custom screen size from 1536px to 1600px
        },
        extend: {
            keyframes: {
                slide: {
                    '0%': { width: '0%' },
                    '100%': { width: '100%' }
                }
            },
            animation: {
                slide: 'slide linear'
            },
            boxShadow: {
                custom: '0px 8px 24px 0px rgba(149, 157, 165, 0.2)' // rgba equivalent of #959DA533
            },
            colors: {
                primary: '#4226C4',
                secondary: '#634d39',
                textBlack: '#232323',
                grayText: '#757575',
                grayBg: '#F6F8FD'
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif']
            },
            fontSize: {
                font10: '10px',
                font12: '12px',
                font13: '13px',
                font14: '14px',
                font15: '15px',
                font16: '16px',
                font18: '18px',
                font20: '20px',
                font22: '22px',
                font24: '24px',
                font28: '28px',
                font30: '30px',
                font32: '32px',
                font36: '36px',
                font40: '40px',
                font42: '42px',
                font48: '48px',
                font50: '50px',
                font64: '64px'
            }
        },
        plugins: []
    }
}
