describe('Search', () => {
  it('shows more pictures after scrolling down', () => {
    cy.visit('/search');
    cy.get('.search-bar-container').find('input').type('Top-Level{enter}');
    cy.contains('.picture-count', 'Mehr als 100 Bilder');
    cy.get('.picture-grid .picture-preview').should('have.length', 100);
    cy.get('.App > .scroll-context > .scrollable-container').scrollTo('bottom');
    cy.contains('.picture-count', '107 Bild(er)');
    cy.get('.picture-grid .picture-preview').should('have.length', 107);
  });
});
