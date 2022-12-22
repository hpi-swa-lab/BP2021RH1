describe('Archives View', () => {
  before(() => {
    cy.visit('http://localhost:3000/archives/1');
  });
  after(() => {
    cy.get('.nav-element-title').contains('Mehr...').click();
    cy.get('.MuiPaper-root').contains('Logout').click();
  });

  it('shows the first archive name and no edit button', () => {
    cy.contains('Herbert-Ahrens-Bilderarchiv');
    cy.contains('Archiv editieren').should('not.exist');
  });
  it('shows an edit button upon login', () => {
    cy.get('.nav-bar').contains('Mehr...').click();
    cy.get('.MuiPaper-root').contains('Login').click();
    cy.get('#username').should('be.visible').clear().type('testCurator');
    cy.get('#password').should('be.visible').clear().type('1234abc');
    cy.get('button[type="submit"]').should('be.visible').click();
    cy.contains('Archiv editieren');
  });
  it('redirects to the archive edit page after pressing on the edit button', () => {
    cy.contains('Archiv editieren').click();
    cy.url().should('eq', 'http://localhost:3000/archives/1/edit');
  });
  it('successfully edits the archive name and long description', () => {
    cy.get('#archive-form-name').should('be.visible').clear();
    cy.get('#archive-form-name')
      .should('be.visible')
      .clear()
      .type('Herbert-Ahrens-Testarchiv')
      .should('have.value', 'Herbert-Ahrens-Testarchiv');
    cy.get('.jodit-react-container')
      .should('have.value', '')
      .type('Testbeschreibung')
      .contains('Testbeschreibung');
    cy.get('#archive-form-logo').should('be.visible').selectFile('public/logo512.png');
    cy.get('img').should('be.visible');
  });
  it('successfully adds, removes and edits a link', () => {
    cy.contains('Link hinzufügen').click();
    cy.get('#archive-form-title').should('be.visible').type('Test-Link 1');
    cy.get('#archive-form-url').should('be.visible').type('test1.de');
    cy.get('.archive-link-entry').within(() => {
      return cy.get('[data-testid="SaveIcon"]').click();
    });
    cy.contains('Link hinzufügen').click();
    cy.get('#archive-form-title').should('be.visible').type('Test-Link 2');
    cy.get('#archive-form-url').should('be.visible').type('test2.de');
    cy.get('.archive-link-entry')
      .first()
      .within(() => {
        return cy.get('[data-testid="EditIcon"]').click();
      });
    cy.get('#archive-form-title').should('be.visible').type(' Edit');
    cy.contains('Link hinzufügen').click();
    cy.get('#archive-form-title').should('be.visible').type('Test-Link 3');
    cy.get('#archive-form-url').should('be.visible').type('test3.de');
    cy.get('.archive-link-entry')
      .eq(1)
      .within(() => {
        return cy.get(`[data-testid="DeleteIcon"]`).click();
      });
    cy.contains('Test-Link 1 Edit');
    cy.contains('Test-Link 2').should('not.exist');
    cy.get('[data-testid="SaveIcon"]').eq(1).click();
    cy.contains('Test-Link 3');
  });
  it('successfully posts the form data', () => {
    cy.contains('Änderungen speichern').click();
    cy.contains('Änderungen gespeichert');
    cy.wait(500);
    cy.contains('Zum Archiv').click();
    cy.contains('Herbert-Ahrens-Bilderarchiv').should('not.exist');
    cy.contains('Herbert-Ahrens-Testarchiv');
    cy.contains('Testbeschreibung');
    cy.get('.archive-logo').should('be.visible');
    cy.contains('Test-Link 1 Edit');
    cy.contains('Test-Link 3');
  });
  it('successfully sets an image as showcase picture when pressing on the star button', () => {
    cy.get(`[data-testid="StarIcon"]`).first().click();
    cy.get('.archive-showcase');
  });
});
