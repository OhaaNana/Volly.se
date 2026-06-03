describe("Auth", () => {
  beforeEach(() => {
    cy.clearAllLocalStorage();
    cy.clearAllCookies();
  });

  it("shows the public landing when no session", () => {
    cy.visit("/");
    cy.contains("Logga in").should("be.visible");
  });

  it("signs up a new user via the homepage form", () => {
    cy.makeUser("signup").then((user) => {
      cy.visit("/");
      cy.contains('button[type="button"]', "Skapa konto").click();

      cy.get('input[name="firstName"]').type(user.firstName);
      cy.get('input[name="lastName"]').type(user.lastName);
      cy.get('input[name="email"]').type(user.email);
      cy.get('input[name="password"]').type(user.password);
      cy.get('input[name="repeatPassword"]').type(user.password);
      cy.contains("Jag har läst och godkänner villkoren").click();

      cy.contains('button[type="submit"]', "Skapa konto").click();

      cy.contains("Välkommen tillbaka", { timeout: 10000 }).should(
        "be.visible"
      );
    });
  });

  it("logs an existing user in via the login form", () => {
    cy.makeUser("login").then((user) => {
      cy.registerUser(user);

      cy.visit("/");
      cy.contains("Logga in").should("be.visible");
      cy.get('input[type="email"]').first().type(user.email);
      cy.get('input[type="password"]').first().type(user.password);
      cy.contains("button", "Logga in").click();

      cy.contains("Välkommen tillbaka", { timeout: 10000 }).should(
        "be.visible"
      );
      cy.window()
        .its("localStorage")
        .invoke("getItem", "token")
        .should("exist");
      cy.window()
        .its("localStorage")
        .invoke("getItem", "userId")
        .should("exist");
    });
  });

  it("rejects an invalid password", () => {
    cy.makeUser("bad").then((user) => {
      cy.registerUser(user);

      cy.visit("/");
      cy.get('input[type="email"]').first().type(user.email);
      cy.get('input[type="password"]').first().type("wrong-password");
      cy.contains("button", "Logga in").click();

      cy.contains(/Invalid password|Login failed/).should("be.visible");
    });
  });
});
