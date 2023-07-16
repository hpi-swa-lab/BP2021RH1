import { login, logout } from '../../utils/login-utils';
import { bulkEdit, selectPictures, visitArchive1Pictures } from './helper';

describe('bulk edit keyword tags', () => {
  before(() => {
    cy.visit('/');
    login();
  });
  after(() => {
    cy.visit('/');
    logout();
  });

  it('shows the intersection of the given tags', () => {
    cy.visit('/picture/4');
    cy.contains('Verifiziertes Testschlagwort 2');
    cy.contains('Verifiziertes Testschlagwort 4');
    cy.visit('/picture/3');
    cy.contains('Verifiziertes Testschlagwort 2');
    cy.contains('Verifiziertes Testschlagwort 4').should('not.exist');
    visitArchive1Pictures();
    selectPictures('3', '4');
    bulkEdit();
    cy.contains('Verifiziertes Testschlagwort 2');
    cy.contains('Verifiziertes Testschlagwort 4').should('not.exist');
  });

  it("shows no tags when one picture doesn't have any tags", () => {
    cy.visit('/picture/4');
    cy.contains('Verifiziertes Testschlagwort 2');
    cy.contains('Verifiziertes Testschlagwort 4');
    cy.visit('/picture/5');
    cy.contains('.picture-info-field', 'Schlagworte').find('input');
    cy.contains('.picture-info-field', 'Schlagworte').find('.MuiChip-root').should('not.exist');
    visitArchive1Pictures();
    selectPictures('4', '5');
    bulkEdit();
    cy.contains('.picture-info-field', 'Schlagworte').find('input');
    cy.contains('.picture-info-field', 'Schlagworte').find('.MuiChip-root').should('not.exist');
  });

  it('adds new tags while keeping old ones', () => {
    cy.visit('/picture/3');
    cy.contains('Verifiziertes Testschlagwort 2');
    cy.contains('Verifiziertes Testschlagwort 4').should('not.exist');
    cy.visit('/picture/5');
    cy.contains('Verifiziertes Testschlagwort 2').should('not.exist');
    cy.contains('Verifiziertes Testschlagwort 4').should('not.exist');
    visitArchive1Pictures();
    selectPictures('3', '5');
    bulkEdit();
    cy.contains('.picture-info-field', 'Schlagworte')
      .find('input')
      .type('Verifiziertes Testschlagwort 4{enter}');
    cy.contains('[data-testid="save-status"]', 'Gespeichert');
    cy.contains('Verifiziertes Testschlagwort 4');
    cy.visit('/picture/3');
    cy.contains('Verifiziertes Testschlagwort 2');
    cy.contains('Verifiziertes Testschlagwort 4');
    cy.visit('/picture/5');
    cy.contains('Verifiziertes Testschlagwort 2').should('not.exist');
    cy.contains('Verifiziertes Testschlagwort 4');
  });

  it('removes tags while keeping untouched ones', () => {
    visitArchive1Pictures();
    selectPictures('3', '5');
    bulkEdit();
    cy.contains('.MuiChip-root', 'Verifiziertes Testschlagwort 4')
      .find('[data-testid="CancelIcon"]')
      .click();
    cy.contains('[data-testid="save-status"]', 'Gespeichert');
    cy.contains('Verifiziertes Testschlagwort 2').should('not.exist');
    cy.contains('Verifiziertes Testschlagwort 4').should('not.exist');
    cy.visit('/picture/3');
    cy.contains('Verifiziertes Testschlagwort 2');
    cy.contains('Verifiziertes Testschlagwort 4').should('not.exist');
    cy.visit('/picture/5');
    cy.contains('Verifiziertes Testschlagwort 2').should('not.exist');
    cy.contains('Verifiziertes Testschlagwort 4').should('not.exist');
  });

  it("adds tags to pictures which don't have them yet, even if some already have them", () => {
    cy.visit('/picture/4');
    cy.contains('Verifiziertes Testschlagwort 2');
    cy.contains('Verifiziertes Testschlagwort 4');
    cy.visit('/picture/3');
    cy.contains('Verifiziertes Testschlagwort 2');
    cy.contains('Verifiziertes Testschlagwort 4').should('not.exist');
    visitArchive1Pictures();
    selectPictures('3', '4');
    bulkEdit();
    cy.contains('.picture-info-field', 'Schlagworte')
      .find('input')
      .type('Verifiziertes Testschlagwort 4{enter}');
    cy.contains('[data-testid="save-status"]', 'Gespeichert');
    cy.contains('Verifiziertes Testschlagwort 2');
    cy.contains('Verifiziertes Testschlagwort 4');
    cy.visit('/picture/4');
    cy.contains('Verifiziertes Testschlagwort 2');
    cy.contains('Verifiziertes Testschlagwort 4');
    cy.visit('/picture/3');
    cy.contains('Verifiziertes Testschlagwort 2');
    cy.contains('Verifiziertes Testschlagwort 4');
    // cleanup
    cy.get('[data-testid="CancelIcon"]'); // wait for auth
    cy.contains('.MuiChip-root', 'Verifiziertes Testschlagwort 4')
      .find('[data-testid="CancelIcon"]')
      .click();
    cy.contains('[data-testid="save-status"]', 'Gespeichert');
    cy.contains('Verifiziertes Testschlagwort 2');
    cy.contains('Verifiziertes Testschlagwort 4').should('not.exist');
  });
});
