// cypress/support/commands.ts
// Custom commands used across all E2E tests.
// Types declared in cypress/support/index.d.ts

/**
 * cy.loginAs(email, password)
 *
 * Logs in programmatically via the login form and caches the
 * session so subsequent tests in the same spec don't repeat it.
 */
Cypress.Commands.add("loginAs", (email: string, password: string) => {
    cy.session(
      [email, password],
      () => {
        cy.visit("/login")
        cy.get("input[name='email']").type(email)
        cy.get("input[name='password']").type(password)
        cy.get("button[type='submit']").click()
        cy.url().should("include", "/dashboard")
      },
      { cacheAcrossSpecs: false }
    )
  })