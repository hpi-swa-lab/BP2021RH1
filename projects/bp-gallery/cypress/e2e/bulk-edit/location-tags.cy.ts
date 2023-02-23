import { login, logout } from '../../utils/login-utils';
import { selectPictures } from './helper';

describe('bulk edit location tags', () => {
  before(() => {
    cy.visit('/');
    login();
  });
  after(() => {
    cy.visit('/');
    logout();
  });

  it('shows the intersection of the given tags', () => {
    cy.visit('/picture/1');
    cy.contains('Testort 1');
    cy.contains('Market place');
    cy.visit('/picture/4');
    cy.contains('Testort 1');
    cy.contains('Market place').should('not.exist');
    cy.visit('/archives/1');
    selectPictures('1', '4');
    cy.contains('Mehrere Bilder editieren').click();
    cy.contains('Testort 1');
    cy.contains('Market place').should('not.exist');
  });

  it("shows no tags when one picture doesn't have any tags", () => {
    cy.visit('/picture/1');
    cy.contains('Bad Harzburg');
    cy.contains('Market place');
    cy.visit('/picture/25');
    cy.contains('.picture-info-field', 'Orte').find('input');
    cy.contains('.picture-info-field', 'Orte').find('.MuiChip-root').should('not.exist');
    cy.visit('/start');
    selectPictures('1', '25');
    cy.contains('Mehrere Bilder editieren').click();
    cy.contains('.picture-info-field', 'Orte').find('input');
    cy.contains('.picture-info-field', 'Orte').find('.MuiChip-root').should('not.exist');
  });

  it('adds new tags while keeping old ones', () => {
    cy.visit('/picture/1');
    cy.contains('.MuiChip-root', 'Bad Harzburg');
    cy.contains('Verifizierter Testort 3').should('not.exist');
    cy.visit('/picture/25');
    cy.contains('.MuiChip-root', 'Bad Harzburg').should('not.exist');
    cy.contains('Verifizierter Testort 3').should('not.exist');
    cy.visit('/start');
    selectPictures('1', '25');
    cy.contains('Mehrere Bilder editieren').click();
    cy.contains('.picture-info-field', 'Orte').find('input').type('Verifizierter Testort 3{enter}');
    cy.contains('.save-state', 'Gespeichert');
    cy.contains('Verifizierter Testort 3');
    cy.visit('/picture/1');
    cy.contains('.MuiChip-root', 'Bad Harzburg');
    cy.contains('Verifizierter Testort 3');
    cy.visit('/picture/25');
    cy.contains('.MuiChip-root', 'Bad Harzburg').should('not.exist');
    cy.contains('Verifizierter Testort 3');
  });

  it('removes tags while keeping untouched ones', () => {
    cy.visit('/start');
    selectPictures('1', '25');
    cy.contains('Mehrere Bilder editieren').click();
    cy.contains('.MuiChip-root', 'Verifizierter Testort 3')
      .find('[data-testid="CancelIcon"]')
      .click();
    cy.contains('.save-state', 'Gespeichert');
    cy.contains('.MuiChip-root', 'Bad Harzburg').should('not.exist');
    cy.contains('Verifizierter Testort 3').should('not.exist');
    cy.visit('/picture/1');
    cy.contains('.MuiChip-root', 'Bad Harzburg');
    cy.contains('Verifizierter Testort 3').should('not.exist');
    cy.visit('/picture/25');
    cy.contains('.MuiChip-root', 'Bad Harzburg').should('not.exist');
    cy.contains('Verifizierter Testort 3').should('not.exist');
  });

  it("adds tags to pictures which don't have them yet, even if some already have them", () => {
    cy.visit('/picture/1');
    cy.contains('.MuiChip-root', 'Bad Harzburg');
    cy.contains('Market place');
    cy.visit('/picture/4');
    cy.contains('.MuiChip-root', 'Bad Harzburg');
    cy.contains('Market place').should('not.exist');
    cy.visit('/archives/1');
    selectPictures('1', '4');
    cy.contains('Mehrere Bilder editieren').click();
    cy.contains('.picture-info-field', 'Orte').find('input').type('Market{enter}');
    cy.contains('.save-state', 'Gespeichert');
    cy.contains('.MuiChip-root', 'Bad Harzburg');
    cy.contains('Market place');
    cy.visit('/picture/1');
    cy.contains('.MuiChip-root', 'Bad Harzburg');
    cy.contains('Market place');
    cy.visit('/picture/4');
    cy.contains('.MuiChip-root', 'Bad Harzburg');
    cy.contains('Market place');
    // cleanup
    cy.get('[data-testid="CancelIcon"]'); // wait for auth
    cy.contains('.MuiChip-root', 'Market place').find('[data-testid="CancelIcon"]').click();
    cy.contains('.save-state', 'Gespeichert');
    cy.contains('Bad Harzburg');
    cy.contains('Market place').should('not.exist');
  });
});
