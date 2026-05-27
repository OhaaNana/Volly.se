import "./commands";

Cypress.on("uncaught:exception", (err) => {
  if (/ResizeObserver/.test(err.message)) return false;
  return undefined;
});
