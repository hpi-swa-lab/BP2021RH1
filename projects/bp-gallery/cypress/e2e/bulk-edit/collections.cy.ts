import { login, logout } from '../../utils/login-utils';
import { bulkEdit, selectPictures, visitArchive1Pictures } from './helper';

describe('bulk edit collections', () => {
  before(() => {
    cy.visit('/');
    login();
  });
  after(() => {
    cy.visit('/');
    logout();
  });

  it('shows the intersection of the given collections', () => {
    cy.visit('/picture/3');
    cy.contains('Collection 1');
    cy.contains('Collection 2');
    cy.visit('/picture/2');
    cy.contains('Collection 1');
    cy.contains('Collection 2').should('not.exist');
    visitArchive1Pictures();
    selectPictures('3', '2');
    bulkEdit();
    cy.contains('Collection 1');
    cy.contains('Collection 2').should('not.exist');
  });

  it("shows no collections when one picture doesn't have any collections", () => {
    // create a picture without collections
    cy.visit('/picture/1');
    cy.contains('.MuiChip-root', 'Top-Level collection').find('[data-testid="CancelIcon"]').click();
    cy.contains('.save-state', 'Gespeichert');

    cy.visit('/picture/3');
    cy.contains('Collection 1');
    cy.contains('Collection 2');
    cy.visit('/picture/1');
    cy.contains('.picture-info-field', 'Collections').find('input');
    cy.contains('.picture-info-field', 'Collections').find('.MuiChip-root').should('not.exist');
    visitArchive1Pictures();
    selectPictures('3', '1');
    bulkEdit();
    cy.contains('.picture-info-field', 'Collections').find('input');
    cy.contains('.picture-info-field', 'Collections').find('.MuiChip-root').should('not.exist');

    // readd the deleted collection
    cy.visit('/picture/1');
    cy.contains('.picture-info-field', 'Collections')
      .find('input')
      .type('Top-Level collection{enter}');
    cy.contains('.save-state', 'Gespeichert');
  });

  it('adds new collections while keeping old ones', () => {
    cy.visit('/picture/2');
    cy.contains('Collection 1');
    cy.contains('Collection 2').should('not.exist');
    cy.visit('/picture/1');
    cy.contains('Collection 1').should('not.exist');
    cy.contains('Collection 2').should('not.exist');
    visitArchive1Pictures();
    selectPictures('2', '1');
    bulkEdit();
    cy.contains('.picture-info-field', 'Collections').find('input').type('Collection 2{enter}');
    cy.contains('.save-state', 'Gespeichert');
    cy.contains('Collection 2');
    cy.visit('/picture/2');
    cy.contains('Collection 1');
    cy.contains('Collection 2');
    cy.visit('/picture/1');
    cy.contains('Collection 1').should('not.exist');
    cy.contains('Collection 2');
  });

  it('removes collections while keeping untouched ones', () => {
    visitArchive1Pictures();
    selectPictures('2', '1');
    bulkEdit();
    cy.contains('.MuiChip-root', 'Collection 2').find('[data-testid="CancelIcon"]').click();
    cy.contains('.save-state', 'Gespeichert');
    cy.contains('Collection 1').should('not.exist');
    cy.contains('Collection 2').should('not.exist');
    cy.visit('/picture/2');
    cy.contains('Collection 1');
    cy.contains('Collection 2').should('not.exist');
    cy.visit('/picture/1');
    cy.contains('Collection 1').should('not.exist');
    cy.contains('Collection 2').should('not.exist');
  });

  it("adds collections to pictures which don't have them yet, even if some already have them", () => {
    cy.visit('/picture/3');
    cy.contains('Collection 1');
    cy.contains('Collection 2');
    cy.visit('/picture/2');
    cy.contains('Collection 1');
    cy.contains('Collection 2').should('not.exist');
    visitArchive1Pictures();
    selectPictures('3', '2');
    bulkEdit();
    cy.contains('.picture-info-field', 'Collections').find('input').type('Collection 2');
    cy.get('.MuiAutocomplete-popper').contains('Collection 2').click();
    cy.contains('.save-state', 'Gespeichert');
    cy.contains('Collection 1');
    cy.contains('Collection 2');
    cy.visit('/picture/3');
    cy.contains('Collection 1');
    cy.contains('Collection 2');
    cy.visit('/picture/2');
    cy.contains('Collection 1');
    cy.contains('Collection 2');
    // cleanup
    cy.get('[data-testid="CancelIcon"]'); // wait for auth
    cy.contains('.MuiChip-root', 'Collection 2').find('[data-testid="CancelIcon"]').click();
    cy.contains('.save-state', 'Gespeichert');
    cy.contains('Collection 1');
    cy.contains('Collection 2').should('not.exist');
  });
});
