describe('Browse view', () => {
  it('shows the browse view', () => {
    cy.visit('http://localhost:3000/');
    cy.contains('Top-Level collection');
  });
});
