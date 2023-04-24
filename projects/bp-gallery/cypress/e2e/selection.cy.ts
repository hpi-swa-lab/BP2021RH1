import { login, logout } from '../utils/login-utils';

describe('selection', () => {
  before(() => {
    cy.visit('/latest/');
    login();
  });
  after(() => {
    logout();
  });

  it('select multiple photos manually', () => {
    cy.get('.picture-preview .adornment[title="Bild auswählen"]').eq(0).click();
    cy.get('.picture-preview .adornment[title="Bild auswählen"]').eq(1).click();
    cy.get('.picture-preview .adornment[title="Bild auswählen"]').eq(2).click();
    cy.get('.picture-preview').eq(0).find('[data-testid="CheckBoxIcon"]');
    cy.get('.picture-preview').eq(1).find('[data-testid="CheckBoxIcon"]');
    cy.get('.picture-preview').eq(2).find('[data-testid="CheckBoxIcon"]');
    cy.contains('Keine auswählen').click();
    cy.get('.picture-preview .adornment [data-testid="CheckBoxIcon"]').should('not.exist');
  });

  it('selection is preserved while scrolling', () => {
    cy.visit('/latest/');
    cy.get('.picture-preview .adornment[title="Bild auswählen"]').eq(0).click();
    cy.get('.picture-preview .adornment[title="Bild auswählen"]').eq(1).click();
    cy.get('[data-testid="scrollable-container"]').scrollTo('bottom');
    cy.get('.picture-preview').eq(0).find('[data-testid="CheckBoxIcon"]');
    cy.get('.picture-preview').eq(1).find('[data-testid="CheckBoxIcon"]');
  });
});
