describe('bulk edit', () => {
  before(() => {
    cy.visit('http://localhost:3000/latest/');
    cy.get('.nav-bar').contains('Mehr...').click();
    cy.get('.MuiPaper-root').contains('Login');
    cy.get('.MuiPaper-root').contains('Login').click();
    cy.get('#username').should('be.visible').clear().type('testCurator');
    cy.get('#password').should('be.visible').clear().type('1234abc');
    cy.get('button[type="submit"]').should('be.visible').click();
  });
  after(() => {
    cy.wait(1000);
    cy.visit('http://localhost:3000/browse');
    cy.get('.nav-bar').contains('Mehr...').click();
    cy.get('.MuiPaper-root').contains('Logout').click();
  });

  it('select multiple photos manually', () => {
    cy.wait(500);
    cy.get('.picture-preview')
      .eq(0)
      .within(() => {
        cy.get('.adornment.bottom-left').click();
      });
    cy.get('.picture-preview')
      .eq(1)
      .within(() => {
        cy.get('.adornment.bottom-left').click();
      });
    cy.get('.picture-preview')
      .eq(2)
      .within(() => {
        cy.get('.adornment.bottom-left').click();
      });
    cy.get('.picture-preview')
      .eq(0)
      .within(() => {
        cy.get('span').contains('check_box').should('exist');
      });
    cy.get('.picture-preview')
      .eq(1)
      .within(() => {
        cy.get('span').contains('check_box').should('exist');
      });
    cy.get('.picture-preview')
      .eq(2)
      .within(() => {
        cy.get('span').contains('check_box').should('exist');
      });
  });
});
