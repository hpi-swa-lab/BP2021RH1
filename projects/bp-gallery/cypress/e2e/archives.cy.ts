/* eslint-disable @typescript-eslint/no-unsafe-call */
import { login, logout } from '../utils/login-utils';
import { urlIs } from '../utils/url-utils';

describe('Archives View', () => {
  before(() => {
    cy.visit('/archives/1');
  });
  after(() => {
    cy.get('[data-cy="archive-edit"]').click();
    cy.get('#archive-form-name').clear();
    cy.get('#archive-form-name').type('Herbert-Ahrens-Bilderarchiv');
    cy.get('.jodit-react-container').clear();
    cy.get('[data-testid="DeleteIcon"]').first().click();
    cy.get('[data-testid="DeleteIcon"]').first().click();
    cy.contains('Änderungen speichern').click();
    logout();
  });

  it('shows the first archive name and no edit button', () => {
    cy.contains('Herbert-Ahrens-Bilderarchiv');
    cy.get('[data-cy="archive-edit"]').should('not.exist');
  });
  it('shows an edit button upon login', () => {
    login();
    cy.get('[data-cy="archive-edit"]').should('be.visible');
  });
  it('redirects to the archive edit page after pressing on the edit button', () => {
    cy.get('[data-cy="archive-edit"]').click();
    urlIs('/archives/1/edit');
  });
  it('successfully edits the archive name and long description', () => {
    cy.get('#archive-form-name').should('be.visible').clear();
    cy.get('#archive-form-name').type('Herbert-Ahrens-Testarchiv');
    cy.get('#archive-form-name').should('have.value', 'Herbert-Ahrens-Testarchiv');
    cy.get('.jodit-react-container').should('have.value', '').type('Testbeschreibung');
    cy.get('.jodit-react-container').contains('Testbeschreibung');
    cy.get('#archive-form-logo').should('be.visible').selectFile('public/logo512.png');
    cy.get('img').should('be.visible');
  });
  it('successfully adds, removes and edits a link', () => {
    cy.contains('Link hinzufügen').click();
    cy.get('#archive-form-title').type('Test-Link 1');
    cy.get('#archive-form-url').type('test1.de');
    cy.get('.archive-link-entry').find('[data-testid="SaveIcon"]').click();
    cy.contains('Link hinzufügen').click();
    cy.get('#archive-form-title').type('Test-Link 2');
    cy.get('#archive-form-url').type('test2.de').blur();
    cy.get('.archive-link-entry').first().find('[data-testid="EditIcon"]').click();
    cy.get('#archive-form-title').scrollIntoView();
    cy.get('#archive-form-title').type(' Edit').blur();
    cy.contains('Link hinzufügen').click();
    cy.get('#archive-form-title').type('Test-Link 3');
    cy.get('#archive-form-url').type('test3.de').blur();
    cy.get('.archive-link-entry').eq(1).find(`[data-testid="DeleteIcon"]`).click();
    cy.contains('Test-Link 1 Edit');
    cy.contains('Test-Link 2').should('not.exist');
    cy.get('[data-testid="SaveIcon"]').eq(1).click();
    cy.contains('Test-Link 3');
  });
  it('successfully posts the form data', () => {
    cy.contains('Änderungen speichern').click();
    cy.contains('Änderungen gespeichert');
    cy.contains('Zum Archiv').click();
    cy.contains('Herbert-Ahrens-Bilderarchiv').should('not.exist');
    cy.contains('Herbert-Ahrens-Testarchiv');
    cy.contains('Testbeschreibung');
    cy.get('.archive-logo').should('be.visible');
    cy.contains('Test-Link 1 Edit');
    cy.contains('Test-Link 3');
  });

  it('successfully sets an image as showcase picture when pressing on the star button via show more for keywords', () => {
    cy.get('.overview-container:contains(Unsere Kategorien)').contains('Mehr anzeigen').click();
    cy.get(`[data-testid="StarIcon"]:eq(1)`).click();
    cy.contains('Zurück').click();
    cy.get('.archive-showcase #picture-preview-for-4').should('exist');
  });

  it('successfully sets an image as showcase picture when pressing on the star button via "Unsere Bilder"', () => {
    cy.get('.overview-selection-container:contains(Unsere Bilder)')
      .contains('Mehr anzeigen')
      .click();
    cy.get(`[data-testid="StarIcon"]:first`).click();
    cy.contains('Zurück').click();
    cy.get('.archive-showcase #picture-preview-for-5').should('exist');
  });

  it('successfully sets an image as showcase picture when pressing on the star button via show more for "Verifiziertes Testschlagwort 2', () => {
    cy.get('.overview-container:contains(Unsere Kategorien)')
      .contains('VERIFIZIERTES TESTSCHLAGWORT 2')
      .click();
    // make the test run
    cy.get('.show-more-container').should('contain.text', 'Verifiziertes Testschlagwort 2');

    cy.get(`[data-testid="StarIcon"]:eq(1)`).click();
    cy.contains('Zurück').click();
    cy.get('.archive-showcase #picture-preview-for-2').should('exist');
  });

  it('shows "Unsere Bilder" picture overview', () => {
    // check for basic components (title, show more button)
    cy.get('.overview-selection-container:contains(Unsere Bilder)').contains('Mehr anzeigen');

    // check if it contains rows with images
    cy.get(
      '.overview-container:first .overview-picture-grid-container div .picture-grid .row:has(.picture-preview)'
    ).should('exist');

    // check if contains at most 2 rows of images or 2 and one empty row
    cy.get(
      '.overview-container:first .overview-picture-grid-container div .picture-grid .row:has(.picture-preview)'
    ).should('have.length.lte', 2);
  });

  it('shows "Unsere Kategorien" picture overview', () => {
    // check for basic components (title, show more button)
    cy.get('.overview-container:contains(Unsere Kategorien)').contains('Mehr anzeigen');

    // check if it contains first 6 verified keywords
    for (const num of [2, 3, 4, 5, 6, 7]) {
      cy.get(
        '.overview-container:contains(Unsere Kategorien) .overview-collection-grid-container .items'
      ).should('contain.text', `VERIFIZIERTES TESTSCHLAGWORT ${num}`);
    }
  });
});
