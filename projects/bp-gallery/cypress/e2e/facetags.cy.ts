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
    cy.contains('.MuiDataGrid-row', 'Personentest').find('[data-testid="DeleteIcon"]').click();
    cy.get('.MuiButton-root').contains('Bestätigen').click();

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
    cy.contains('.field-content', 'Personen').find('input').type('TestPerson {enter}');
    cy.contains('TestPerson hinzufügen').click();
    cy.contains('.save-state', 'Gespeichert');

    cy.contains('.field-content', 'Personen').find('input').click();
    cy.contains('.field-content', 'Personen').find('input').clear();
    cy.contains('.field-content', 'Personen').find('input').type('Personentest {enter}');
    cy.contains('Personentest hinzufügen').click();
    cy.contains('.save-state', 'Gespeichert');

    cy.contains('Personen markieren').should('exist').click();
    cy.contains('Personen bearbeiten').should('exist');

    cy.contains('TestPerson').click();
    cy.get('.picture').trigger('mousemove', 'left');
    cy.contains('lädt').should('not.exist');
    cy.get('.picture').click('left').click().wait(1000);
    cy.get('.facetag').contains('TestPerson').should('exist');

    cy.contains('Personentest').click();
    cy.get('.picture').trigger('mousemove');
    cy.contains('lädt').should('not.exist');
    cy.get('.picture').click().click().wait(1000);
    cy.get('.facetag').contains('Personentest').should('exist');
  });

  it('hide and display facetags', () => {
    cy.contains('Personen bearbeiten').click();
    cy.contains('Personenmarkierungen anzeigen').should('not.exist');
    cy.contains('Personenmarkierungen ausblenden').should('exist').click();
    cy.get('.facetag').should('not.exist');
    cy.contains('Personenmarkierungen ausblenden').should('not.exist');
    cy.contains('Personenmarkierungen anzeigen').should('exist').click();
    cy.get('.facetag').should('have.length', 2);
    cy.contains('Personenmarkierungen ausblenden').should('exist');

    //test wether it works as a regular user too
    cy.visit('/');
    logout();
    cy.visit('/picture/1');

    cy.get('.facetag').should('have.length', 2);

    cy.contains('Personenmarkierungen anzeigen').should('not.exist');
    cy.contains('Personenmarkierungen ausblenden').should('exist').click();
    cy.get('.facetag').should('not.exist');
    cy.contains('Personenmarkierungen ausblenden').should('not.exist');
    cy.contains('Personenmarkierungen anzeigen').should('exist').click();
    cy.get('.facetag').should('have.length', 2);
    cy.contains('Personenmarkierungen ausblenden').should('exist');
  });

  it('delete and move facetags', () => {
    cy.visit('/');
    login();
    cy.visit('/picture/1');
    cy.contains('Personen markieren').should('exist').click();
    cy.contains('.MuiChip-label', 'TestPerson').should('exist');
    cy.contains('.facetag', 'TestPerson')
      .should('exist')
      .find('[data-testid="CancelIcon"]')
      .click();
    cy.contains('.facetag', 'TestPerson').should('not.exist');

    cy.contains('.MuiChip-label', 'Personentest').should('exist');
    cy.contains('.facetag', 'Personentest').find('[data-testid="OpenWithIcon"]').click();
    cy.contains('.facetag', 'Personentest')
      .find('[data-testid="OpenWithIcon"]')
      .should('not.exist');
    cy.get('.picture').trigger('movemouse', 'left');
    cy.contains('lädt').should('not.exist');
    cy.get('.picture').trigger('movemouse', 'left');
    cy.get('.picture').click('left').click('left').wait(1000);
    cy.contains('.facetag', 'Personentest').find('[data-testid="OpenWithIcon"]').should('exist');

    cy.contains('.MuiChip-label', 'Personentest');
    cy.contains('.facetag', 'Personentest').find('[data-testid="CancelIcon"]').click();
    cy.get('.facetag').contains('Personen').should('not.exist');
    cy.contains('.MuiChip-label', 'Personentest');
  });
});
