const user = {
  name: "Test User1",
  email: `test-${Date.now()}@splito.dev`,
  password: "password123",
};

describe("Register", () => {
  it("shows validation errors", () => {
    cy.visit("/register");
    cy.get("input[name='name']").type("Someone");
    cy.get("input[name='email']").type("someone@test.com");
    cy.get("input[name='password']").type("short");
    cy.get("button[type='submit']").click();
    cy.contains("at least 8 characters").should("be.visible");
  });

  it("registers and lands on /welcome", () => {
    cy.visit("/register");
    cy.get("input[name='name']").type(user.name);
    cy.get("input[name='email']").type(user.email);
    cy.get("input[name='password']").type(user.password);
    cy.get("button[type='submit']").click();
    cy.url().should("include", "/welcome");
  });

  it("blocks duplicate email registration", () => {
    cy.visit("/register");
    cy.get("input[name='name']").type(user.name);
    cy.get("input[name='email']").type(user.email);
    cy.get("input[name='password']").type(user.password);
    cy.get("button[type='submit']").click();
    cy.url().should("include", "/register");
    cy.visit("/api/auth/signout");
    cy.get("button[type='submit']").click();
    cy.visit("/register");
    cy.get("input[name='name']").type("Test User2");
    cy.get("input[name='email']").type(user.email);
    cy.get("input[name='password']").type(user.password);
    cy.get("button[type='submit']").click();
    cy.contains("already exists").should("be.visible");
  });
});

describe("Login", () => {
  it("rejects wrong password", () => {
    cy.visit("/login");
    cy.get("input[name='email']").type(user.email);
    cy.get("input[name='password']").type("wrongpassword");
    cy.get("button[type='submit']").click();
    cy.contains("Invalid email or password").should("be.visible");
  });

  it("rejects unknown email", () => {
    cy.visit("/login");
    cy.get("input[name='email']").type("nobody@splito.dev");
    cy.get("input[name='password']").type(user.password);
    cy.get("button[type='submit']").click();
    cy.contains("Invalid email or password").should("be.visible");
  });

  it("logs in and goes to dashboard", () => {
    cy.visit("/login");
    cy.get('[data-cy="login-email-input"]').clear().type(user.email);
    cy.get('[data-cy="login-password-input"]').clear().type(user.password);
    cy.get('[data-cy="login-sign-btn"]').click();
    cy.url().should("include", "/dashboard");
  });

  it("has a forgot password link", () => {
    cy.visit("/login");
    cy.contains("Forgot password").click();
    cy.url().should("include", "/forgot-password");
  });
});

describe("Route protection", () => {
  beforeEach(() => cy.clearCookies());

  it("blocks /dashboard when not logged in", () => {
    cy.visit("/dashboard");
    cy.url().should("include", "/register");
  });

  it("blocks /members when not logged in", () => {
    cy.visit("/members");
    cy.url().should("include", "/register");
  });

  it("blocks /groups/* when not logged in", () => {
    cy.visit("/groups/any-id");
    cy.url().should("include", "/register");
  });

  it("blocks /welcome when not logged in", () => {
    cy.visit("/welcome");
    cy.url().should("include", "/register");
  });
});
