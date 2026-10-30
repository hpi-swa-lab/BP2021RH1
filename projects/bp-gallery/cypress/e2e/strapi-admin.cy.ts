describe('Strapi admin panel', () => {
  it('lists entries after logging in', () => {
    cy.visit('http://localhost:9000/admin/auth/login');
    cy.get('input[name="email"]').type('dev@example.com');
    cy.get('input[name="password"]').type('Dev12345');
    cy.get('button[type="submit"]').click();
    cy.location('pathname').should('not.contain', '/auth');
    cy.visit(
      'http://localhost:9000/admin/content-manager/collectionType/api::keyword-tag.keyword-tag'
    );
    cy.contains('Verifiziertes Testschlagwort 1', { timeout: 30000 });
  });
});
