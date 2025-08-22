import { defineConfig } from "cypress";
import "dotenv/config";
import fs = require("fs");

// Import Qase hooks
const { beforeRunHook, afterRunHook } = require("cypress-qase-reporter/hooks");

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

      // ✅ Proper override of hooks
      on("before:run", async () => {
        console.log("override before:run");
        await beforeRunHook(config);
      });

      on("after:run", async (results) => {
  console.log("override after:run");
  await afterRunHook(config);

  // Type-safe logging
  const totalTests = results.totalTests ?? 0;
  const totalPassed = "totalPassed" in results ? results.totalPassed : 0;
  const totalFailed = "totalFailed" in results ? results.totalFailed : 0;

  console.log("✅ Custom after:run hook fired");
  console.log(`Total tests: ${totalTests}, Passed: ${totalPassed}, Failed: ${totalFailed}`);
});

      // Custom tasks
      on("task", {
        fileExists(filename) {
          return fs.existsSync(`cypress/e2e/${filename}`);
        }
      });

      return config;
    }
  }
});
