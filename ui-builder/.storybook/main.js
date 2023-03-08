const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
        config.resolve.alias = {
            ...(config.resolve && config.resolve.alias),
            "~": path.resolve(__dirname, "../src/"),
        };

        config.plugins.push(
            new MiniCssExtractPlugin({ filename: "styles.css" }),
        );

        // Add Linaria loader after babel-loader
        config.module.rules.splice(1, 0, {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: require.resolve("@linaria/webpack-loader"),
                    options: {
                        sourceMap: true,
                        babelOptions: {
                            presets: [
                                require.resolve("@babel/preset-env"),
                                require.resolve("@babel/preset-typescript"),
                                require.resolve("@linaria/babel-preset"),
                            ],
                        },
                    },
                },
            ],
        });

        config.module.rules = config.module.rules.map((rule) => {
            if (rule.test.toString().includes("css")) {
                return {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                        },
                        {
                            loader: "css-loader",
                            options: { sourceMap: true },
                        },
                    ],
                };
            }

            return rule;
        });

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

        // Return the altered config
        return config;
    },
};
