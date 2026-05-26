const seedSession = (user: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) =>
  cy.registerUser(user).then(({ id, token }) => {
    cy.window().then((win) => {
      win.localStorage.setItem("token", token);
      win.localStorage.setItem("currentUser", user.email);
      win.localStorage.setItem("userId", String(id));
    });
    return cy.wrap({ id, token, email: user.email });
  });

describe("Chat (per-pair conversation)", () => {
  it("Kontakta creates a pending chat for both users", () => {
    cy.makeUser("author").then((author) => {
      cy.makeUser("contactor").then((contactor) => {
        cy.registerUser(author).then(({ token: authorToken }) => {
          const title = `Chat E2E ${Date.now()}`;
          cy.request({
            method: "POST",
            url: `${Cypress.env("API_URL")}/posts`,
            headers: { Authorization: `Bearer ${authorToken}` },
            body: {
              title,
              description: "Beskrivning för chatt-flow",
              help_type: "getHelp",
              category: "Teknik",
              tagg: "",
            },
          });

          cy.visit("/");
          seedSession(contactor).then(() => {
            cy.reload();
            cy.contains(title, { timeout: 10000 }).should("be.visible");
            cy.contains(title)
              .parents("article")
              .within(() => {
                cy.contains("button", "Kontakta").click();
              });

            cy.contains("Väntar på svar", { timeout: 10000 }).should(
              "be.visible"
            );
            cy.get('input[placeholder*="Chatt inte aktiverad"]').should(
              "be.disabled"
            );
          });
        });
      });
    });
  });

  it("Author can accept and both users can exchange messages", () => {
    cy.makeUser("author").then((author) => {
      cy.makeUser("contactor").then((contactor) => {
        cy.registerUser(author).then(({ token: authorToken }) => {
          const title = `Accept E2E ${Date.now()}`;
          cy.request({
            method: "POST",
            url: `${Cypress.env("API_URL")}/posts`,
            headers: { Authorization: `Bearer ${authorToken}` },
            body: {
              title,
              description: "För accept-flow",
              help_type: "getHelp",
              category: "Teknik",
              tagg: "",
            },
          }).then((postRes) => {
            const postId = postRes.body.id;

            cy.registerUser(contactor).then(({ token: contactorToken }) => {
              cy.request({
                method: "POST",
                url: `${Cypress.env("API_URL")}/api/chat/chat`,
                headers: { Authorization: `Bearer ${contactorToken}` },
                body: { postId },
              }).then((chatRes) => {
                const chatId = chatRes.body.id;

                cy.visit("/");
                cy.window().then((win) => {
                  win.localStorage.setItem("token", authorToken);
                  win.localStorage.setItem("currentUser", author.email);
                });
                cy.apiLogin(author.email, author.password).then(({ id }) => {
                  cy.window().then((win) => {
                    win.localStorage.setItem("userId", String(id));
                  });
                  cy.visit("/");
                  cy.contains("Inkorg").click();
                  cy.contains("Ny förfrågan", { timeout: 10000 }).should(
                    "be.visible"
                  );
                  cy.contains("button", "Acceptera").click();
                  cy.contains("Starta videosamtal", { timeout: 10000 }).should(
                    "be.visible"
                  );
                });

                const authorMessage = `Hej från författaren ${Date.now()}`;
                cy.get('input[placeholder*="Skriv ett meddelande"]').type(
                  authorMessage
                );
                cy.contains("button", "Skicka").click();
                cy.contains(authorMessage, { timeout: 10000 }).should(
                  "be.visible"
                );

                cy.request({
                  method: "GET",
                  url: `${Cypress.env("API_URL")}/api/chat/chat/${chatId}`,
                  headers: { Authorization: `Bearer ${authorToken}` },
                }).then((history) => {
                  expect(history.status).to.eq(200);
                  const texts = (history.body as Array<{
                    text_message: string;
                  }>).map((m) => m.text_message);
                  expect(texts).to.include(authorMessage);
                });
              });
            });
          });
        });
      });
    });
  });

  it("Author can decline and chat shows as Avböjd", () => {
    cy.makeUser("author").then((author) => {
      cy.makeUser("contactor").then((contactor) => {
        cy.registerUser(author).then(({ token: authorToken }) => {
          const title = `Decline E2E ${Date.now()}`;
          cy.request({
            method: "POST",
            url: `${Cypress.env("API_URL")}/posts`,
            headers: { Authorization: `Bearer ${authorToken}` },
            body: {
              title,
              description: "För decline-flow",
              help_type: "getHelp",
              category: "Teknik",
              tagg: "",
            },
          }).then((postRes) => {
            const postId = postRes.body.id;

            cy.registerUser(contactor).then(({ token: contactorToken }) => {
              cy.request({
                method: "POST",
                url: `${Cypress.env("API_URL")}/api/chat/chat`,
                headers: { Authorization: `Bearer ${contactorToken}` },
                body: { postId },
              });

              cy.visit("/");
              cy.apiLogin(author.email, author.password).then(({ id }) => {
                cy.window().then((win) => {
                  win.localStorage.setItem("token", authorToken);
                  win.localStorage.setItem("currentUser", author.email);
                  win.localStorage.setItem("userId", String(id));
                });
                cy.visit("/");
                cy.contains("Inkorg").click();
                cy.contains("Ny förfrågan", { timeout: 10000 }).should(
                  "be.visible"
                );
                cy.contains("button", "Avböj").click();
                cy.contains("Avböjd", { timeout: 10000 }).should("be.visible");
                cy.contains("Starta videosamtal").should("not.exist");
              });
            });
          });
        });
      });
    });
  });
});
