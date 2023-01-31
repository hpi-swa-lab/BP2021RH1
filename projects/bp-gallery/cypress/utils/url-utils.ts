export const urlIs = (url: string) => {
  cy.url().should('eq', (Cypress.config().baseUrl ?? '') + url);
};
