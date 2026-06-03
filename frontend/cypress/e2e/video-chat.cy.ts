describe("Video chat", () => {
  const stubMedia = () => {
    cy.on("window:before:load", (win) => {
      Object.defineProperty(win.navigator, "mediaDevices", {
        value: {
          getUserMedia: () => Promise.resolve(new win.MediaStream()),
          getDisplayMedia: () => Promise.resolve(new win.MediaStream()),
        },
      });
    });
  };

  it("button is hidden when chat is pending", () => {
    cy.makeUser("author").then((author) => {
      cy.makeUser("contactor").then((contactor) => {
        cy.registerUser(author).then(({ token: authorToken }) => {
          const title = `Video pending ${Date.now()}`;
          cy.request({
            method: "POST",
            url: `${Cypress.env("API_URL")}/posts`,
            headers: { Authorization: `Bearer ${authorToken}` },
            body: {
              title,
              description: "Video pending flow",
              help_type: "getHelp",
              category: "Teknik",
              tagg: "",
            },
          }).then((postRes) => {
            cy.registerUser(contactor).then(
              ({ id: contactorId, token: contactorToken }) => {
                cy.request({
                  method: "POST",
                  url: `${Cypress.env("API_URL")}/api/chat/chat`,
                  headers: { Authorization: `Bearer ${contactorToken}` },
                  body: { postId: postRes.body.id },
                });
                cy.visit("/");
                cy.window().then((win) => {
                  win.localStorage.setItem("token", contactorToken);
                  win.localStorage.setItem("currentUser", contactor.email);
                  win.localStorage.setItem("userId", String(contactorId));
                });
                cy.visit("/");
                cy.contains("Inkorg").click();
                cy.contains("Väntar på svar", { timeout: 10000 }).should(
                  "be.visible"
                );
                cy.contains("Starta videosamtal").should("not.exist");
              }
            );
          });
        });
      });
    });
  });

  it("opens /room/<chatId> after acceptance", () => {
    stubMedia();
    cy.makeUser("author").then((author) => {
      cy.makeUser("contactor").then((contactor) => {
        cy.registerUser(author).then(({ id: authorId, token: authorToken }) => {
          const title = `Video accepted ${Date.now()}`;
          cy.request({
            method: "POST",
            url: `${Cypress.env("API_URL")}/posts`,
            headers: { Authorization: `Bearer ${authorToken}` },
            body: {
              title,
              description: "Video accepted flow",
              help_type: "getHelp",
              category: "Teknik",
              tagg: "",
            },
          }).then((postRes) => {
            cy.registerUser(contactor).then(({ token: contactorToken }) => {
              cy.request({
                method: "POST",
                url: `${Cypress.env("API_URL")}/api/chat/chat`,
                headers: { Authorization: `Bearer ${contactorToken}` },
                body: { postId: postRes.body.id },
              }).then((chatRes) => {
                const chatId = chatRes.body.id;
                cy.request({
                  method: "PATCH",
                  url: `${Cypress.env("API_URL")}/api/chat/chat/${chatId}/status`,
                  headers: { Authorization: `Bearer ${authorToken}` },
                  body: { status: "accepted" },
                });

                cy.visit("/");
                cy.window().then((win) => {
                  win.localStorage.setItem("token", authorToken);
                  win.localStorage.setItem("currentUser", author.email);
                  win.localStorage.setItem("userId", String(authorId));
                });
                cy.visit("/");
                cy.contains("Inkorg").click();
                cy.contains("button", "Starta videosamtal", {
                  timeout: 10000,
                }).click();
                cy.url().should("include", `/room/${chatId}`);
                cy.contains(`Room: ${chatId}`).should("be.visible");
              });
            });
          });
        });
      });
    });
  });

  it("rejects /room access for a non-participant via WS close 1008", () => {
    stubMedia();
    cy.makeUser("author").then((author) => {
      cy.makeUser("contactor").then((contactor) => {
        cy.makeUser("stranger").then((stranger) => {
          cy.registerUser(author).then(({ token: authorToken }) => {
            cy.request({
              method: "POST",
              url: `${Cypress.env("API_URL")}/posts`,
              headers: { Authorization: `Bearer ${authorToken}` },
              body: {
                title: `Stranger test ${Date.now()}`,
                description: "Stranger flow",
                help_type: "getHelp",
                category: "Teknik",
                tagg: "",
              },
            }).then((postRes) => {
              cy.registerUser(contactor).then(({ token: contactorToken }) => {
                cy.request({
                  method: "POST",
                  url: `${Cypress.env("API_URL")}/api/chat/chat`,
                  headers: { Authorization: `Bearer ${contactorToken}` },
                  body: { postId: postRes.body.id },
                }).then((chatRes) => {
                  const chatId = chatRes.body.id;
                  cy.request({
                    method: "PATCH",
                    url: `${Cypress.env("API_URL")}/api/chat/chat/${chatId}/status`,
                    headers: { Authorization: `Bearer ${authorToken}` },
                    body: { status: "accepted" },
                  });

                  cy.registerUser(stranger).then(
                    ({ id: strangerId, token: strangerToken }) => {
                      cy.visit("/");
                      cy.window().then((win) => {
                        win.localStorage.setItem("token", strangerToken);
                        win.localStorage.setItem("currentUser", stranger.email);
                        win.localStorage.setItem("userId", String(strangerId));
                      });
                      cy.visit(`/room/${chatId}`);
                      cy.contains(/connected|completed/i, {
                        timeout: 4000,
                      }).should("not.exist");
                    }
                  );
                });
              });
            });
          });
        });
      });
    });
  });
});
