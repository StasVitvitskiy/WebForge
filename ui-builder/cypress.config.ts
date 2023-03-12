import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        setupNodeEvents() {},
        experimentalStudio: true,
    },
    viewportWidth: 1400,
    viewportHeight: 800,
    scrollBehavior: false,
});
