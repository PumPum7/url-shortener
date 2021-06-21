const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
    mode: process.env.NODE_ENV ? "jit" : undefined,
    purge: [
        "./src/pages/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", ...defaultTheme.fontFamily.sans],
            },
        },
        container: {
            center: true,
            padding: "2rem",
        },
    },
    plugins: [require("@tailwindcss/forms")],
};
