import { login, logout } from '../utils/login-utils';

describe('Picture View called via link', () => {
  before(() => {
    cy.visit('http://localhost:3000/picture/1');
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
    cy.url().should('equal', 'http://localhost:3000/start');
  });
});

describe('Picture View called via link as a curator', () => {
  before(() => {
    cy.visit('http://localhost:3000/');
    login();
    cy.get('.MuiSnackbar-root').contains('Erfolgreich eingeloggt').should('exist');
    cy.visit('localhost:3000/picture/1');
  });
  after(() => {
    cy.visit('http://localhost:3000/');
    logout();
  });

  it('should show a picture-info-field for each type in the picture sidebar', () => {
    const pictureInfoFields = [
      'date',
      'description',
      'person',
      'location',
      'keywords',
      'collections',
      'archive',
    ];

    cy.get('.picture-sidebar .quick-access-buttons').click();
    cy.get('.picture-info-field').should('have.length', pictureInfoFields.length);
  });
});
