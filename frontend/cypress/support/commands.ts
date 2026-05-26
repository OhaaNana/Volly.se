/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      registerUser(user: {
        firstName?: string;
        lastName?: string;
        email: string;
        password: string;
      }): Chainable<{ id: number; token: string; email: string }>;
      loginAs(email: string, password: string): Chainable<void>;
      apiLogin(email: string, password: string): Chainable<{
        id: number;
        token: string;
      }>;
      makeUser(prefix?: string): Chainable<{
        email: string;
        password: string;
        firstName: string;
        lastName: string;
      }>;
    }
  }
}

const API = (): string => Cypress.env("API_URL");

Cypress.Commands.add("makeUser", (prefix = "e2e") => {
  const id = `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  return cy.wrap({
    email: `${id}@test.local`,
    password: "Pa55w0rd!",
    firstName: "Test",
    lastName: id.slice(-6),
  });
});

Cypress.Commands.add("registerUser", (user) => {
  return cy
    .request({
      method: "POST",
      url: `${API()}/api/auth/register`,
      body: {
        first_name: user.firstName ?? "Test",
        last_name: user.lastName ?? "User",
        email: user.email,
        password: user.password,
      },
    })
    .then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.token).to.be.a("string");
      return {
        id: response.body.id,
        token: response.body.token,
        email: user.email,
      };
    });
});

Cypress.Commands.add("apiLogin", (email, password) => {
  return cy
    .request({
      method: "POST",
      url: `${API()}/api/auth/login`,
      body: { email, password },
    })
    .then((response) => {
      expect(response.status).to.eq(200);
      return { id: response.body.id, token: response.body.token };
    });
});

Cypress.Commands.add("loginAs", (email, password) => {
  cy.session([email, password], () => {
    cy.apiLogin(email, password).then(({ id, token }) => {
      window.localStorage.setItem("token", token);
      window.localStorage.setItem("currentUser", email);
      window.localStorage.setItem("userId", String(id));
    });
  });
});

export {};
