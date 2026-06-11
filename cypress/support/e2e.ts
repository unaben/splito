// cypress/support/e2e.ts
import "./commands"

// Suppress uncaught exceptions from the app so they don't
// fail tests that aren't specifically testing error states.
Cypress.on("uncaught:exception", () => false)