import { login, logout } from '../utils/login-utils';

describe('picture grid', () => {
  it('should render more pictures after scrolling', () => {
    cy.visit('/start');
    cy.contains('.picture-count', 'Mehr als 100 Bilder');
    cy.get('.picture-grid .picture-preview').should('have.length', 100);
    cy.get('.App > .scroll-context > .scrollable-container').scrollTo('bottom');
    cy.contains('.picture-count', '107 Bilder');
    cy.get('.picture-grid .picture-preview').should('have.length', 107);
  });
});
