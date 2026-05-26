describe("Posts", () => {
  it("creates a post and sees it on the start page", () => {
    cy.makeUser("post").then((user) => {
      cy.registerUser(user).then(({ id, token }) => {
        cy.window().then((win) => {
          win.localStorage.setItem("token", token);
          win.localStorage.setItem("currentUser", user.email);
          win.localStorage.setItem("userId", String(id));
        });
        cy.visit("/");
        cy.contains("Välkommen tillbaka", { timeout: 10000 }).should(
          "be.visible"
        );

        cy.contains("Skapa").click();
        cy.contains("Skapa nytt inlägg").should("be.visible");

        const title = `E2E test post ${Date.now()}`;
        const body = "Behöver hjälp med att testa Cypress E2E-flödet.";

        cy.get('input[placeholder="Text"]').first().type(title);
        cy.get('textarea[placeholder="Text"]').type(body);
        cy.contains("button[aria-pressed]", "Teknik").click();
        cy.contains("button", "Publicera").click();

        cy.contains(title, { timeout: 10000 }).should("be.visible");
        cy.contains(body).should("be.visible");
      });
    });
  });

  it("shows posts under their category", () => {
    cy.makeUser("cat").then((user) => {
      cy.registerUser(user).then(({ token }) => {
        const title = `Category test ${Date.now()}`;
        cy.request({
          method: "POST",
          url: `${Cypress.env("API_URL")}/posts`,
          headers: { Authorization: `Bearer ${token}` },
          body: {
            title,
            description: "Visa mig i Studier-kategorin.",
            help_type: "getHelp",
            category: "Studier",
            tagg: "",
          },
        });

        cy.window().then((win) => {
          win.localStorage.setItem("token", token);
          win.localStorage.setItem("currentUser", user.email);
        });
        cy.visit("/");
        cy.contains("Kategorier").click();
        cy.contains("button", "Studier").click();
        cy.contains(title).should("be.visible");
      });
    });
  });
});
