import { login, logout } from '../utils/login-utils';

describe('face tagging', () => {
  before(() => {
    cy.visit('/');
    login();
    cy.visit('/picture/1');
  });

  after(() => {
    cy.visit('/');
    cy.get('.nav-bar').contains('Mehr...').click();
    cy.get('.MuiPaper-root').contains('Personen').click();
    cy.contains('.MuiDataGrid-row', 'TestPerson').find('[data-testid="DeleteIcon"]').click();
    cy.get('.MuiButton-root').contains('Bestätigen').click();
    cy.contains('.MuiDataGrid-row', 'TestPerson').should('not.exist');
    cy.contains('.MuiDataGrid-row', 'Personentest').find('[data-testid="DeleteIcon"]').click();
    cy.get('.MuiButton-root').contains('Bestätigen').click();
    cy.contains('.MuiDataGrid-row', 'Personentest').should('not.exist');
    cy.visit('/');
    logout();
  });

  it('create face tags', () => {
    cy.get('.facetag').should('not.exist');
    cy.contains('Personen markieren').should('not.exist');
    cy.contains('Personenmarkierungen ausblenden').should('not.exist');
    cy.contains('Personenmarkierungen anzeigen').should('not.exist');

    cy.contains('.field-content', 'Personen').find('input').click();
    cy.contains('.field-content', 'Personen').find('input').clear();
    cy.contains('.field-content', 'Personen').find('input').type('TestPerson');
    cy.contains('TestPerson hinzufügen').click();
    cy.contains('.save-state', 'Gespeichert');

    cy.contains('.field-content', 'Personen').find('input').click();
    cy.contains('.field-content', 'Personen').find('input').clear();
    cy.contains('.field-content', 'Personen').find('input').type('Personentest');
    cy.contains('Personentest hinzufügen').click();
    cy.contains('.save-state', 'Gespeichert');

    cy.contains('Personen markieren').click();
    cy.contains('Personen bearbeiten');

    cy.contains('TestPerson').click();
    cy.get('.picture').click('left');
    cy.contains('.facetag', 'TestPerson').find('[data-testid="CancelIcon"]');

    cy.contains('Personentest').click();
    cy.get('.picture').click();
    cy.contains('.facetag', 'Personentest').find('[data-testid="CancelIcon"]');
  });

  it('hide and display facetags', () => {
    cy.contains('Personen bearbeiten').click();
    cy.contains('Personenmarkierungen anzeigen').should('not.exist');
    cy.contains('Personenmarkierungen ausblenden').click();
    cy.get('.facetag').should('not.exist');
    cy.contains('Personenmarkierungen ausblenden').should('not.exist');
    cy.contains('Personenmarkierungen anzeigen').click();
    cy.get('.facetag').should('have.length', 2);
    cy.contains('Personenmarkierungen ausblenden');

    //test wether it works as a regular user too
    cy.visit('/');
    logout();
    cy.visit('/picture/1');

    cy.get('.facetag').should('have.length', 2);

    cy.contains('Personen markieren').should('not.exist');
    cy.contains('Personen bearbeiten').should('not.exist');
    cy.contains('Personenmarkierungen anzeigen').should('not.exist');
    cy.contains('Personenmarkierungen ausblenden').click();
    cy.get('.facetag').should('not.exist');
    cy.contains('Personenmarkierungen ausblenden').should('not.exist');
    cy.contains('Personenmarkierungen anzeigen').click();
    cy.get('.facetag').should('have.length', 2);
    cy.contains('Personenmarkierungen ausblenden');
  });

  it('delete and move facetags', () => {
    cy.visit('/');
    login();
    cy.visit('/picture/1');
    cy.contains('Personen markieren').click();
    cy.contains('.MuiChip-root', 'TestPerson');
    cy.contains('.facetag', 'TestPerson').find('[data-testid="CancelIcon"]').click();
    cy.contains('.facetag', 'TestPerson').should('not.exist');

    cy.contains('.MuiChip-root', 'Personentest');
    cy.contains('.facetag', 'Personentest').find('[data-testid="OpenWithIcon"]').click();
    cy.contains('.facetag', 'Personentest')
      .find('[data-testid="OpenWithIcon"]')
      .should('not.exist');
    cy.get('.picture').click('left');
    cy.contains('.facetag', 'Personentest').find('[data-testid="OpenWithIcon"]');

    cy.contains('Personen bearbeiten').click();
    cy.contains('.facetag', 'Personentest');
    cy.contains('.MuiChip-root', 'Personentest').find('[data-testid="CancelIcon"]').click();
    cy.contains('.MuiChip-root', 'Personentest').should('not.exist');
    cy.contains('.facetag', 'Personentest').should('not.exist');
  });

  it('change face tag direction', () => {
    cy.contains('Personen bearbeiten').should('not.exist');
    cy.contains('Personen markieren').click();
    cy.contains('TestPerson').click();
    cy.get('.picture').click();

    // the force:true options are unfortunately necessary because there are other elements
    //overlapping with the picture causing the tests to fail
    //don't ask me why click('left') has worked before, it didn't work in this section of the test

    cy.contains('.facetag', 'TestPerson').find('[data-testid="AutorenewIcon"]').click();
    cy.get('.picture').click('top', { force: true });
    cy.contains('.facetag', 'TestPerson').find('[data-testid="tag direction: up"]');

    cy.contains('.facetag', 'TestPerson').find('[data-testid="AutorenewIcon"]').click();
    cy.get('.picture').click('right', { force: true });
    cy.contains('.facetag', 'TestPerson').find('[data-testid="tag direction: right"]');

    cy.contains('.facetag', 'TestPerson').find('[data-testid="AutorenewIcon"]').click();
    cy.get('.picture').click('bottom', { force: true });
    cy.contains('.facetag', 'TestPerson').find('[data-testid="tag direction: down"]');

    cy.contains('.facetag', 'TestPerson').find('[data-testid="AutorenewIcon"]').click();
    cy.get('.picture').click('left', { force: true });
    cy.contains('.facetag', 'TestPerson').find('[data-testid="tag direction: left"]');

    cy.contains('Personen bearbeiten').click();
    cy.contains('.MuiChip-root', 'TestPerson').find('[data-testid="CancelIcon"]').click();
    cy.contains('.MuiChip-root', 'TestPerson').should('not.exist');
    cy.contains('.facetag', 'TestPerson').should('not.exist');
  });
});
