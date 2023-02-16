import { login, logout } from '../utils/login-utils';
import { urlIs } from '../utils/url-utils';

describe('Picture View called via link', () => {
  before(() => {
    cy.visit('/picture/1');
  });

  it('should display a toolbar', () => {
    cy.get('.picture-toolbar').should('be.visible');
  });

  it('should show picture information after opening the sidebar', () => {
    cy.get('.picture-sidebar').should('be.visible');
    cy.contains('Bad Harzburg');
    cy.get('.picture-sidebar .quick-access-buttons').click();
    cy.get('.picture-sidebar').should('not.be.visible');
  });

  it('should return to the homepage when pressing the back button', () => {
    cy.get('.picture-toolbar').find('button').first().click();
    urlIs('/start');
  });
});

describe('Picture View called via link as a curator', () => {
  before(() => {
    cy.visit('/');
    login();
    cy.get('.MuiSnackbar-root').contains('Erfolgreich eingeloggt').should('exist');
    cy.visit('localhost:3000/picture/1');
  });
  after(() => {
    cy.visit('/');
    logout();
  });

  it('should show a picture-info-field for each type in the picture sidebar', () => {
    const pictureInfoFields = [
      'date',
      'description',
      'person',
      'location',
      'keywords',
      'links',
      'collections',
      'archive',
    ];

    cy.get('.picture-sidebar .quick-access-buttons').click();
    cy.get('.picture-info-field').should('have.length', pictureInfoFields.length);
  });

  it('should have date estimate functionality', () => {
    cy.get('.date-indicator').click();
    cy.get('.date-range-picker .MuiCheckbox-root:not(.Mui-checked)');
    cy.get('.date-range-picker .MuiCheckbox-root').click();
    cy.get('.date-range-picker .MuiCheckbox-root.Mui-checked');
    cy.get('.date-range-picker .MuiCheckbox-root').click();
    cy.get('.date-range-picker .MuiCheckbox-root').type('{esc}');
  });
});

describe('Like Button', () => {
  before(() => {
    cy.visit('http://localhost:3000/picture/1');
  });

  it('increases the like counter when clicking the like Button', () => {
    cy.contains('Mag ich').contains('0');
    cy.contains('Mag ich').click();
    cy.contains('Mag ich').contains('1');
    cy.reload();
    cy.contains('Mag ich').contains('1');
  });

  it('decreases the like counter when clicking on an already liked picture', () => {
    cy.contains('Mag ich').contains('1');
    cy.contains('Mag ich').click();
    cy.contains('Mag ich').contains('0');
    cy.reload();
    cy.contains('Mag ich').contains('0');
  });
});
