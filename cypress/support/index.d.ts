// cypress/support/index.d.ts
/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
      /**
       * Log in via the login form and cache the session.
       * @example cy.loginAs('alice@example.com', 'password123')
       */
      loginAs(email: string, password: string): Chainable<void>
    }
  }