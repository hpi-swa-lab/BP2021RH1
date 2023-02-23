import { login, logout } from '../../utils/login-utils';
import { selectPictures } from './helper';

describe('bulk edit person tags', () => {
  before(() => {
    cy.visit('/');
    login();
  });
  after(() => {
    cy.visit('/');
    logout();
  });

  it('shows the intersection of the given tags', () => {
    cy.visit('/picture/2');
    cy.contains('Simon Heraldson');
    cy.contains('Katharina Schmunk');
    cy.visit('/picture/3');
    cy.contains('Simon Heraldson');
    cy.contains('Katharina Schmunk').should('not.exist');
    cy.visit('/archives/1');
    selectPictures('2', '3');
    cy.contains('Mehrere Bilder editieren').click();
    cy.contains('Simon Heraldson');
    cy.contains('Katharina Schmunk').should('not.exist');
  });

  it("shows no tags when one picture doesn't have any tags", () => {
    cy.visit('/picture/1');
    cy.contains('.picture-info-field', 'Personen').find('input');
    cy.contains('.picture-info-field', 'Personen').find('.MuiChip-root').should('not.exist');
    cy.visit('/picture/2');
    cy.contains('Simon Heraldson');
    cy.contains('Katharina Schmunk');
    cy.visit('/archives/1');
    selectPictures('1', '2');
    cy.contains('Mehrere Bilder editieren').click();
    cy.contains('.picture-info-field', 'Personen').find('input');
    cy.contains('.picture-info-field', 'Personen').find('.MuiChip-root').should('not.exist');
  });

  it('adds new tags while keeping old ones', () => {
    cy.visit('/picture/1');
    cy.contains('Simon Heraldson').should('not.exist');
    cy.contains('Katharina Schmunk').should('not.exist');
    cy.visit('/picture/3');
    cy.contains('Simon Heraldson');
    cy.contains('Katharina Schmunk').should('not.exist');
    cy.visit('/archives/1');
    selectPictures('1', '3');
    cy.contains('Mehrere Bilder editieren').click();
    cy.contains('.picture-info-field', 'Personen').find('input').type('Katharina{enter}');
    cy.contains('.save-state', 'Gespeichert');
    cy.contains('Katharina Schmunk');
    cy.visit('/picture/1');
    cy.contains('Simon Heraldson').should('not.exist');
    cy.contains('Katharina Schmunk');
    cy.visit('/picture/3');
    cy.contains('Simon Heraldson');
    cy.contains('Katharina Schmunk');
  });

  it('removes tags while keeping untouched ones', () => {
    cy.visit('/archives/1');
    selectPictures('1', '3');
    cy.contains('Mehrere Bilder editieren').click();
    cy.contains('.MuiChip-root', 'Katharina Schmunk').find('[data-testid="CancelIcon"]').click();
    cy.contains('.save-state', 'Gespeichert');
    cy.contains('Simon Heraldson').should('not.exist');
    cy.contains('Katharina Schmunk').should('not.exist');
    cy.visit('/picture/1');
    cy.contains('Simon Heraldson').should('not.exist');
    cy.contains('Katharina Schmunk').should('not.exist');
    cy.visit('/picture/3');
    cy.contains('Simon Heraldson');
    cy.contains('Katharina Schmunk').should('not.exist');
  });

  it("adds tags to pictures which don't have them yet, even if some already have them", () => {
    cy.visit('/picture/2');
    cy.contains('Simon Heraldson');
    cy.contains('Katharina Schmunk');
    cy.visit('/picture/3');
    cy.contains('Simon Heraldson');
    cy.contains('Katharina Schmunk').should('not.exist');
    cy.visit('/archives/1');
    selectPictures('2', '3');
    cy.contains('Mehrere Bilder editieren').click();
    cy.contains('.picture-info-field', 'Personen').find('input').type('Katharina{enter}');
    cy.contains('.save-state', 'Gespeichert');
    cy.contains('Simon Heraldson');
    cy.contains('Katharina Schmunk');
    cy.visit('/picture/2');
    cy.contains('Simon Heraldson');
    cy.contains('Katharina Schmunk');
    cy.visit('/picture/3');
    cy.contains('Simon Heraldson');
    cy.contains('Katharina Schmunk');
    // cleanup
    cy.get('[data-testid="CancelIcon"]'); // wait for auth
    cy.contains('.MuiChip-root', 'Katharina Schmunk').find('[data-testid="CancelIcon"]').click();
    cy.contains('.save-state', 'Gespeichert');
    cy.contains('Simon Heraldson');
    cy.contains('Katharina Schmunk').should('not.exist');
  });
});
