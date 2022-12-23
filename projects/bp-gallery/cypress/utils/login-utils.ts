export const login = () => {
  cy.get('.nav-bar').contains('Login').click();
  cy.get('#username').should('be.visible').clear().type('testCurator');
  cy.get('#password').should('be.visible').clear().type('1234abc');
  cy.get('button[type="submit"]').should('be.visible').click();
};

export const logout = () => {
  cy.get('.nav-bar').contains('Logout').click();
};
