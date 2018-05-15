module.exports = (ctx) => ({
    // parser: 'precss',
    // map: ctx === 'development' ? 'inline' : false,
    plugins: {
        "autoprefixer": {
            "browsers": [
                "ie >= 9",
                "ff >= 30",
                "chrome >= 34",
                "safari >= 7",
                "opera >= 23"
            ]
        },
        "cssnano": ctx === "production" ? {} : false
    }

})