/* eslint-disable @typescript-eslint/no-unsafe-call */
import { aliasQuery, aliasMutation } from '../utils/graphql-test-utils';
import { login, logout } from '../utils/login-utils';

beforeEach(() => {
  cy.intercept('POST', 'http://localhost:9000/graphql', req => {
    // Queries
    aliasQuery(req, 'getArchive');

    // Mutations
    aliasMutation(req, 'updateArchive');
  });
});

describe('Archives View', () => {
  before(() => {
    cy.visit('http://localhost:3000/archives/1');
  });
  after(() => {
    cy.contains('Archiv editieren').click();
    cy.get('#archive-form-name').clear().type('Herbert-Ahrens-Bilderarchiv');
    cy.get('.jodit-react-container').clear();
    cy.get('[data-testid="DeleteIcon"]').first().click();
    cy.get('[data-testid="DeleteIcon"]').first().click();
    cy.contains('Änderungen speichern').click();
    logout();
  });

  it('shows the first archive name and no edit button', () => {
    cy.contains('Herbert-Ahrens-Bilderarchiv');
    cy.get('.archive-edit-button').should('not.exist');
  });
  it('shows an edit button upon login', () => {
    login();
    cy.get('.archive-edit-button').contains('Archiv editieren');
  });
  it('redirects to the archive edit page after pressing on the edit button', () => {
    cy.contains('Archiv editieren').click();
    cy.url().should('eq', 'http://localhost:3000/archives/1/edit');
  });
  it('successfully edits the archive name and long description', () => {
    cy.get('#archive-form-name').should('be.visible').clear();
    cy.get('#archive-form-name')
      .should('be.visible')
      .clear()
      .type('Herbert-Ahrens-Testarchiv')
      .should('have.value', 'Herbert-Ahrens-Testarchiv');
    cy.get('.jodit-react-container')
      .should('have.value', '')
      .type('Testbeschreibung')
      .contains('Testbeschreibung');
    cy.get('#archive-form-logo').should('be.visible').selectFile('public/logo512.png');
    cy.get('img').should('be.visible');
  });
  it('successfully adds, removes and edits a link', () => {
    cy.contains('Link hinzufügen').click();
    cy.get('#archive-form-title').should('be.visible').type('Test-Link 1');
    cy.get('#archive-form-url').should('be.visible').type('test1.de');
    cy.get('.archive-link-entry').within(() => {
      return cy.get('[data-testid="SaveIcon"]').click();
    });
    cy.contains('Link hinzufügen').click();
    cy.get('#archive-form-title').should('be.visible').type('Test-Link 2');
    cy.get('#archive-form-url').should('be.visible').type('test2.de');
    cy.get('.archive-link-entry')
      .first()
      .within(() => {
        return cy.get('[data-testid="EditIcon"]').click();
      });
    cy.get('#archive-form-title').should('be.visible').type(' Edit');
    cy.contains('Link hinzufügen').click();
    cy.get('#archive-form-title').should('be.visible').type('Test-Link 3');
    cy.get('#archive-form-url').should('be.visible').type('test3.de');
    cy.get('.archive-link-entry')
      .eq(1)
      .within(() => {
        return cy.get(`[data-testid="DeleteIcon"]`).click();
      });
    cy.contains('Test-Link 1 Edit');
    cy.contains('Test-Link 2').should('not.exist');
    cy.get('[data-testid="SaveIcon"]').eq(1).click();
    cy.contains('Test-Link 3');
  });
  it('successfully posts the form data', () => {
    cy.contains('Änderungen speichern').click();
    cy.contains('Änderungen gespeichert');
    cy.wait('@gqlupdateArchiveMutation', { timeout: 30000 });
    cy.contains('Zum Archiv').click();
    cy.contains('Herbert-Ahrens-Bilderarchiv').should('not.exist');
    cy.contains('Herbert-Ahrens-Testarchiv');
    cy.contains('Testbeschreibung');
    cy.get('.archive-logo').should('be.visible');
    cy.contains('Test-Link 1 Edit');
    cy.contains('Test-Link 3');
  });
  it('successfully sets an image as showcase picture when pressing on the star button', () => {
    cy.get(`[data-testid="StarIcon"]`).first().click();
    cy.get('.archive-showcase');
  });
});
