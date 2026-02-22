/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './public/**/*.html'],
    theme: {
        extend: {
            fontSize: {
                xs: ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.05em', fontWeight: '400' }],
                sm: ['0.875rem', { lineHeight: '1.3', letterSpacing: '0.025em', fontWeight: '400' }],
                base: ['1.125rem', { lineHeight: '1.6', letterSpacing: '0em', fontWeight: '400' }], // 18px body text
                lg: ['1.25rem', { lineHeight: '1.7', letterSpacing: '0em', fontWeight: '400' }],
                xl: ['1.5rem', { lineHeight: '1.8', letterSpacing: '0em', fontWeight: '500' }],
                '2xl': ['1.75rem', { lineHeight: '2', letterSpacing: '-0.01em', fontWeight: '600' }],
                '3xl': ['1.5rem', { lineHeight: '2', letterSpacing: '-0.015em', fontWeight: '600' }], // 24px H3
                '4xl': ['2rem', { lineHeight: '2.4', letterSpacing: '-0.02em', fontWeight: '700' }],
                '5xl': ['2rem', { lineHeight: '2.4', letterSpacing: '-0.025em', fontWeight: '700' }],
                '6xl': ['2rem', { lineHeight: '2.4', letterSpacing: '-0.03em', fontWeight: '700' }], // 32px H2
                '7xl': ['3rem', { lineHeight: '3.6', letterSpacing: '-0.035em', fontWeight: '800' }],
                '8xl': ['4rem', { lineHeight: '4.8', letterSpacing: '-0.04em', fontWeight: '800' }], // 48-64px H1
                '9xl': ['4rem', { lineHeight: '4.8', letterSpacing: '-0.045em', fontWeight: '900' }],
            },
            fontFamily: {
                heading: "Space Grotesk, Montserrat, Poppins, sans-serif",
                paragraph: "Inter, Lato, sans-serif"
            },
            colors: {
                text: '#FF8C42',
                icon1: '#FF8C42',
                icon2: '#FFB366',
                icon3: '#FFFFFF',
                icon4: '#1A1A1A',
                icon5: '#2D2D2D',
                icon6: '#404040',
                icon7: '#525252',
                icon8: '#656565',
                shape: '#FF8C42',
                'shape-stroke': '#FF8C42',
                background: '#0F0F0F',
                secondary: '#FFB366',
                foreground: '#FFFFFF',
                'secondary-foreground': '#1A1A1A',
                'primary-foreground': '#0F0F0F',
                primary: '#FF6A00'
            },
            borderRadius: {
                'button': '10px',
                'button-lg': '12px',
            },
        },
    },
    future: {
        hoverOnlyWhenSupported: true,
    },
    plugins: [require('@tailwindcss/container-queries'), require('@tailwindcss/typography')],
}
