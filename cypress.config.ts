import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: "http://localhost:3003",
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.ts",
    viewportWidth: 1280,
    viewportHeight: 800,
    video: false,
    screenshotOnRunFailure: true,
    // How long to wait for assertions before failing (ms)
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 30000,

    setupNodeEvents(on, config) {
      return config;
    },
  },
});
