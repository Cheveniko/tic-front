Cypress.Commands.add("login", () => {
  cy.visit("http://localhost:4200");

  cy.get('[data-cy="emailInput"]').focus().type("diego.baquero01@epn.edu.ec");
  cy.get('[data-cy="passwordInput"]').focus().type("Ola1234!");
  cy.get('[data-cy="loginButton"]').click();

  cy.url().should("not.include", "login");
});
