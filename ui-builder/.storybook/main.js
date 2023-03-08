const path = require("path");

module.exports = {
    stories: [
        "../src/**/*.stories.mdx",
        "../src/**/*.stories.@(js|jsx|ts|tsx)",
    ],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
    ],
    core: {
        builder: "@storybook/builder-webpack5",
    },
    framework: "@storybook/react",
    webpackFinal: async (config) => {
        config.module.rules.push({
            test: /\.css$/i,
            use: [
                {
                    loader: "postcss-loader",
                    options: { implementation: require.resolve("postcss") },
                },
            ],
            include: path.resolve(__dirname, "../"),
        });

        config.resolve.alias = {
            ...(config.resolve && config.resolve.alias),
            "~": path.resolve(__dirname, "../src/"),
        };

        // Return the altered config
        return config;
    },
};
