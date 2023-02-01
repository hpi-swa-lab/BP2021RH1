export const login = () => {
  cy.contains('.nav-element', 'Login').click();
  cy.get('#username').should('be.visible').clear().type('testCurator');
  cy.get('#password').should('be.visible').clear().type('1234abc');
  cy.get('button[type="submit"]').should('be.visible').click();
  cy.get('.login-screen').should('not.exist');
};

export const logout = () => {
  cy.contains('.nav-element', 'Logout').click();
  cy.get('.login-screen').should('not.exist');
};
