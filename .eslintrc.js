module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
    },
    extends: ["plugin:react/recommended", "standard-with-typescript"],
    overrides: [],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["react", "eslint-plugin-react-hooks"],
    rules: {
        "react/prop-types": 0,
        "react/no-children-prop": 0,
        "@typescript-eslint/strict-boolean-expressions": 0,
        "@typescript-eslint/no-non-null-assertion": 0,
        "@typescript-eslint/consistent-type-assertions": 0,
        "react/display-name": 0,
        "@typescript-eslint/restrict-template-expressions": 0,
        quotes: ["error", "double"],
        "@typescript-eslint/quotes": ["error", "double"],
        "@typescript-eslint/comma-dangle": 0,
        "space-before-function-paren": ["error", "never"],
        "@typescript-eslint/space-before-function-paren": ["error", "never"],
    },
};
