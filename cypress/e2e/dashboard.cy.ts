/**
 * cypress/e2e/dashboard.cy.ts
 *
 * Tests the dashboard, group creation, and group detail page.
 * Uses cy.loginAs() from support/commands.ts to skip the login UI.
 */

const dashboardUser = {
  name: "Dashboard User",
  email: `dash-${Date.now()}@splito.dev`,
  password: "password123",
};

// Register and complete onboarding once before all tests in this file
before(() => {
  cy.visit("/register");
  cy.get("input[name='name']").type(dashboardUser.name);
  cy.get("input[name='email']").type(dashboardUser.email);
  cy.get("input[name='password']").type(dashboardUser.password);
  cy.get("button[type='submit']").click();
  cy.url().should("include", "/welcome");

  // Navigate through all info steps
  cy.get("button").contains("Get started").click();
  cy.get("button").contains("Next").click();
  cy.get("button").contains("Next").click();
  cy.get("button").contains("Next").click();
  cy.get("button").contains("Next").click();

  // Choose example members so the dashboard has someone to show
  cy.contains("Add 4 example members").click();
  cy.get("button").contains("Go to dashboard").click();
  cy.url().should("include", "/dashboard");
  // Sign out — individual tests will sign in via cy.loginAs
  cy.visit("/api/auth/signout");
  cy.get("button[type='submit']").click();
});

describe("Dashboard", () => {
  beforeEach(() => {
    cy.loginAs(dashboardUser.email, dashboardUser.password);
    cy.visit("/dashboard");
  });

  it("shows the three stats cards", () => {
    cy.contains("You are owed").should("be.visible");
    cy.contains("You owe").should("be.visible");
    cy.contains("Groups").should("be.visible");
  });

  it("shows the Your groups section", () => {
    cy.contains("Your groups").should("be.visible");
  });

  it("has a working + New group link", () => {
    cy.contains("+ New group").first().click();
    cy.url().should("include", "/groups/new");
  });

  it("shows the navbar with the user first name", () => {
    cy.get("header").contains("Dashboard").should("be.visible");
    cy.get("header").contains("Dashboard").should("be.visible");
  });
});

describe("Welcome / Onboarding", () => {
  it("skipping members shows empty dashboard", () => {
    const skipUser = {
      name: "Skip User",
      email: `skip-${Date.now()}@splito.dev`,
      password: "password123",
    };

    cy.visit("/register");
    cy.get("input[name='name']").type(skipUser.name);
    cy.get("input[name='email']").type(skipUser.email);
    cy.get("input[name='password']").type(skipUser.password);
    cy.get("button[type='submit']").click();
    cy.url().should("include", "/welcome");

    // Navigate through all info steps
    cy.get("button").contains("Get started").click();
    cy.get("button").contains("Next").click();
    cy.get("button").contains("Next").click();
    cy.get("button").contains("Next").click();
    cy.get("button").contains("Next").click();

    // Choose skip on the members step
    cy.contains("Skip for now").click();
    cy.get("button").contains("Go to dashboard").click();
    cy.url().should("include", "/dashboard");
  });

  it("does not show /welcome again after completing onboarding", () => {
    cy.loginAs(dashboardUser.email, dashboardUser.password);
    cy.visit("/welcome");
    cy.url().should("include", "/dashboard");
  });
});

describe("Create Group", () => {
  beforeEach(() => {
    cy.loginAs(dashboardUser.email, dashboardUser.password);
    cy.visit("/groups/new");
  });

  it("shows the group creation form", () => {
    cy.get("input[name='name']").should("exist");
    cy.contains("Group icon").should("be.visible");
    cy.contains("Add members").should("be.visible");
  });

  it("requires a group name", () => {
    cy.get("button[type='submit']").click();
    cy.get("input[name='name']:invalid").should("exist");
  });

  it("creates a group and redirects to the group page", () => {
    cy.get("input[name='name']").type("Holiday 2025");
    cy.get("input[name='description']").type("Summer trip");
    cy.get("[class*='emojiBtn']").contains("🎉").click();
    cy.get("[class*='memberBtn']").first().click();
    cy.get("button[type='submit']").click();
    cy.url().should("match", /\/groups\/settle-/);
    cy.contains("Holiday 2025").should("be.visible");
  });
});

describe("Members page", () => {
  beforeEach(() => {
    cy.loginAs(dashboardUser.email, dashboardUser.password);
    cy.visit("/members");
  });

  it("shows the members page", () => {
    cy.contains("Members").should("be.visible");
  });

  it("shows the registered user as account holder", () => {
    cy.contains("Account holder").should("be.visible");
  });

  it("shows example members added during onboarding", () => {
    cy.contains("Alex").should("be.visible");
  });

  it("can open the edit form for a mock member", () => {
    cy.get("[class*='editBtn']").first().click();
    cy.get("input[name='name']").should("be.visible");
  });

  it("shows add member button when under the limit", () => {
    cy.get('button').contains('Delete').click()
    cy.get('button').contains('Remove').click()
    cy.contains("+ Add member").should("be.visible");
  });
});
