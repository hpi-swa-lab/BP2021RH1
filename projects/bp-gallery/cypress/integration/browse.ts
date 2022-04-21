describe('Browse view', () => {
  before(() => {
    cy.visit('http://localhost:3000/');
  });

  it('shows the browse view', () => {
    cy.contains('Top-Level collection');
  });

  it('should have a visible navigation bar', () => {
    cy.get('.nav-bar').should('be.visible');
  });

  it('should contain child collections', () => {
    cy.get('.collection-picture-display .item').should('be.visible');
  });

  it('should show a picture preview', () => {
    cy.get('.picture-grid').find('img').first().should('be.visible');
  });

  it('should direct the user to child collections when clicking on them', () => {
    cy.contains('collection 1', { matchCase: false }).click();
    cy.url().should('include', '/Collection_1');
  });

  it('should open a picture view after clicking on a picture preview and closing it afterwards', () => {
    cy.get('.picture-grid').find('.picture-preview').first().click();
    cy.url().should('include', '/picture/');
    cy.get('.picture-toolbar').should('be.visible');
    cy.get('.picture-toolbar').find('button').first().click();
    cy.url().should('include', '/Collection_1');
    cy.get('.picture-toolbar').should('not.be.visible');
  });
});
