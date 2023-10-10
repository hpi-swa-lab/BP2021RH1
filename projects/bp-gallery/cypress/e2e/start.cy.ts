describe('Start view', () => {
  before(() => {
    cy.visit('/start');
  });

  it('shows the archive cards and browse view', () => {
    cy.get('.archives').should('exist');
    cy.get('[data-testid="archive"]').should('exist');
    cy.get('.browse-container').should('exist');
  });

  it('shows the picture count for the archive cards', () => {
    cy.contains('[data-testid="archive"]', 'Herbert-Ahrens-Bilderarchiv').contains('5 Bilder');
  });

  it('should have a visible navigation bar', () => {
    cy.get('.nav-bar').should('exist');
  });

  it('should contain child collections', () => {
    cy.get('.collection-picture-display .item').should('exist');
  });

  it('should have selectable custom overview', () => {
    cy.get('.overview-selection-container').contains('Neuzugänge').click();
  });

  it('should show a picture preview', () => {
    cy.get('.picture-grid').find('img').first().should('exist');
  });

  it('should direct the user to child collections when clicking on them', () => {
    cy.contains('collection 1', { matchCase: false }).click();
    cy.url().should('include', '/Collection_1');
  });

  it('should open a picture view after clicking on a picture preview and closing it afterwards', () => {
    cy.get('.picture-grid').find('.picture-preview').first().click();
    cy.url().should('include', '/picture/');
    cy.get('.picture-toolbar').should('exist');
    cy.get('.picture-toolbar').find('button').first().click();
    cy.url().should('include', '/Collection_1');
    cy.get('.picture-toolbar').should('not.exist');
  });
});
