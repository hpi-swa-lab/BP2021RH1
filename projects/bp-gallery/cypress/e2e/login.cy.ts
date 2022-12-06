describe('Login', () => {
  before(() => {
    cy.visit('http://localhost:3000/');
  });
  after(() => {
    cy.get('.nav-element-title').contains('Mehr...').click();
    cy.get('.MuiPaper-root').contains('Logout').click();
  });

  it("should display a 'More' button in the navigation bar which opens a menu when clicked", () => {
    cy.get('.MuiPaper-root').should('not.exist');
    cy.get('.nav-bar').contains('Mehr...');
    cy.get('.nav-bar').contains('Mehr...').click();
    cy.get('.MuiPaper-root').should('be.visible');
  });

  it('should display a login button in the menu which opens a dialog when clicked', () => {
    cy.get('.MuiDialog-container').should('not.exist');
    cy.get('.MuiPaper-root').contains('Login');
    cy.get('.MuiPaper-root').contains('Login').click();
    cy.get('.MuiDialog-container').should('be.visible');
  });

  it('should show an error when entering invalid login data', () => {
    cy.get('#username').should('be.visible').type('Wrong data');
    cy.get('#password').should('be.visible').type('Wrong data');
    cy.get('button[type="submit"]').should('be.visible').click();
    cy.get('.MuiAlert-root').should('be.visible');
  });

  it('should close the dialog on successful login', () => {
    cy.get('#username').should('be.visible').clear().type('testCurator');
    cy.get('#password').should('be.visible').clear().type('1234abc');
    cy.get('button[type="submit"]').should('be.visible').click();
    cy.get('.MuiDialog-container').should('not.exist');
  });

  it('should show the upload-area after logging in', () => {
    cy.get('.upload-area').should('be.visible');
  });
});
