/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                wine: "#760707",
                neon: {
                    green: "#4ade80",
                    orange: "#fb923c",
                    glow: "rgba(118, 7, 7, 0.5)",
                },
                background: "#0f0f0f",
                card: "rgba(255, 255, 255, 0.05)",
            },
            borderRadius: {
                '2xl': '20px',
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    plugins: [],
}
