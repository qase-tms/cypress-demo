# Cypress Qase Reporter – `after:run` Hook Issue Reproduction

This repository demonstrates an issue where the **Qase Cypress Reporter** does not correctly complete/close a test run when a custom `after:run` hook is also registered in `cypress.config.ts`.

## Steps to Reproduce

1. Clone this repo and switch to the branch containing the reproduction:
   ```bash
   git clone https://github.com/qase-tms/cypress-demo.git
   cd cypress-demo
   git checkout repro-after-run-hook
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set token and project inside `cypress.config.ts` :

4. Run Cypress:
   ```bash
   npx cypress run
   ```

## Expected Behavior

- Qase reporter should upload results and close the run in TestOps.
- The custom `after:run` hook should fire after Qase finishes.

## Actual Behavior

- The custom `after:run` hook **fires correctly**.
- The Qase reporter **does not complete/close the run** if `after:run` is present.
- If the `after:run` hook is removed, the Qase reporter behaves as expected.

## Key Configuration

In `cypress.config.ts`:

```ts
require("cypress-qase-reporter/plugin")(on, config);
require("cypress-qase-reporter/metadata")(on);

on("after:run", async (results) => {
  console.log("✅ Custom after:run hook fired");
  console.log("Results object:", results);
});
```
