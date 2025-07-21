import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4200/#/spa",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
