import { defineConfig } from "cypress";
import "dotenv/config";
import fs = require("fs");

export default defineConfig({
  reporter: "cypress-multi-reporters",
  reporterOptions: {
    reporterEnabled: "cypress-qase-reporter",
    cypressQaseReporterReporterOptions: {
      debug: true,
      environment: "dev",
      mode: "testops",
      testops: {
        api: { token: "" },
        project: "",
        run: { title: "Qase Cypress Run - Repro Project", complete: true },
        uploadAttachments: true
      },
      framework: { cypress: { screenshotsFolder: "cypress/screenshots" } }
    }
  },

  e2e: {
    specPattern: ["cypress/e2e/**/*.cy.ts"],
    baseUrl: "https://example.com",
    video: false,

    setupNodeEvents(on, config) {
      // Register Qase plugins
      require("cypress-qase-reporter/plugin")(on, config);
      require("cypress-qase-reporter/metadata")(on);

      // ❌ Problematic hook that interferes with run completion
      on("after:run", async (results) => {
        console.log("✅ Custom after:run hook fired");
        console.log("Results object:", results);
      });

      on("task", {
        fileExists(filename) {
          return fs.existsSync(`cypress/e2e/${filename}`);
        }
      });

      return config;
    }
  }
});