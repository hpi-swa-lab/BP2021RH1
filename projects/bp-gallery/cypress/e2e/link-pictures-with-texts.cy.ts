import { login, logout } from '../utils/login-utils';

describe('link pictures with texts', () => {
  before(() => {
    cy.visit('/browse');
    login();
  });
  after(() => {
    cy.visit('/browse');
    logout();
  });

  it('mark picture as text', () => {
    cy.visit('/picture/1');
    cy.contains('Verlinkte Texte');
    cy.contains('button', 'Als Text markieren').find('[data-testid="CheckBoxOutlineBlankIcon"]');
    cy.contains('Als Text markieren').click();
    cy.contains('button', 'Als Text markieren').find('[data-testid="CheckBoxIcon"]');
    cy.contains('Verlinkte Bilder');
  });

  it('cleanup', () => {
    cy.visit('/picture/1');
    cy.contains('Als Text markieren').click();
    cy.contains('button', 'Als Text markieren').find('[data-testid="CheckBoxOutlineBlankIcon"]');
    cy.contains('Verlinkte Texte');
  });
});
