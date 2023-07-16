import { login, logout } from '../utils/login-utils';
import { bulkEdit } from './bulk-edit/helper';

describe('bulk edit', () => {
  before(() => {
    cy.visit('/latest/');
    login();
  });
  after(() => {
    logout();
  });

  it('deselect all if and only if something was changed', () => {
    cy.get('.picture-preview .adornment[title="Bild auswählen"]').eq(0).click();
    cy.get('.picture-preview .adornment[title="Bild auswählen"]').eq(1).click();
    bulkEdit();
    cy.contains('Zurück').click();
    cy.get('.picture-preview .adornment[title="Bild auswählen"]')
      .eq(0)
      .find('[data-testid="CheckBoxIcon"]');
    cy.get('.picture-preview .adornment[title="Bild auswählen"]')
      .eq(1)
      .find('[data-testid="CheckBoxIcon"]');
    bulkEdit();
    cy.contains('.picture-info-field', 'Personen').find('input').type('Simon');
    cy.contains('Simon Heraldson').click();
    cy.contains('[data-testid="save-status"]', 'Gespeichert');
    cy.contains('.MuiChip-root', 'Simon Heraldson').find('[data-testid="CancelIcon"]').click(); // cleanup
    cy.contains('[data-testid="save-status"]', 'Gespeichert');
    cy.contains('Zurück').click();
    cy.get('.picture-preview .adornment [data-testid="CheckBoxIcon"]').should('not.exist');
  });
});
