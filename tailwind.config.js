/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'bg-primary': '#141313',
                'bg-card': 'rgba(255, 255, 255, 0.07)',
                'text-primary': '#ffffff',
                'text-secondary': 'rgba(255, 255, 255, 0.7)',
                'accent': '#3b82f6',
            },
            boxShadow: {
                'card': '0 8px 32px rgba(0, 0, 0, 0.2)',
            },
            borderColor: {
                'card': 'rgba(255, 255, 255, 0.1)',
            },
            backdropBlur: {
                'card': '12px',
            },
        },
    },
    plugins: [],
} 