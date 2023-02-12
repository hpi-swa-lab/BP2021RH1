import { logout } from '../utils/login-utils';

describe('Login', () => {
  before(() => {
    cy.visit('/');
  });
  after(() => {
    logout();
  });

  it('should display a login button in the navigation bar which opens a dialog when clicked', () => {
    cy.get('.MuiDialog-container').should('not.exist');
    cy.get('.nav-bar').contains('Login');
    cy.get('.nav-bar').contains('Login').click();
    cy.get('.MuiDialog-container').should('be.visible');
  });

  it('should show an error when entering invalid login data', () => {
    cy.get('#username').should('be.visible').type('Wrong data');
    cy.get('#password').should('be.visible').type('Wrong data');
    cy.get('button[type="submit"]').should('be.visible').click();
    cy.get('.MuiAlert-root').should('be.visible');
  });

  it('should close the dialog on successful login', () => {
    cy.get('#username').should('be.visible').clear();
    cy.get('#username').type('testCurator');
    cy.get('#password').should('be.visible').clear();
    cy.get('#password').type('1234abc');
    cy.get('button[type="submit"]').should('be.visible').click();
    cy.get('.MuiDialog-container').should('not.exist');
  });

  it('should close the Mehr... Pop Up Menu', () => {
    cy.get('nav-element-title').should('not.exist');
  });

  it('should show the upload-area after logging in', () => {
    cy.get('.upload-area').should('exist');
  });
});
