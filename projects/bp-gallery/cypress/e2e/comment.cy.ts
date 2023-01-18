import { login, logout } from '../utils/login-utils';

describe('Comment', () => {
  before(() => {
    cy.visit('http://localhost:3000/picture/1');
  });
  after(() => {
    cy.visit('http://localhost:3000');
    logout();
  });

  it('adds a comment to picture 1', () => {
    cy.get('input#name').should('be.visible').clear().type('Hans Hansen');
    cy.get('textarea#text').should('be.visible').clear().type('Testkommentar1');
    cy.get('.MuiButton-root').contains('Absenden').should('be.visible').click();
    cy.get('.MuiDialog-container').contains('Danke für Ihren Kommentar!').should('be.visible');
    cy.get('.MuiButton-root').contains('O.K.').should('be.visible').click();

    cy.get('input#name').should('be.visible').clear().type('Hans Hansen');
    cy.get('textarea#text').should('be.visible').clear().type('Testkommentar2');
    cy.get('.MuiButton-root').contains('Absenden').should('be.visible').click();
    cy.get('.MuiDialog-container').contains('Danke für Ihren Kommentar!').should('be.visible');
    cy.get('.MuiButton-root').contains('O.K.').should('be.visible').click();
  });

  it('log in as curator and curate the new comments', () => {
    cy.get('.MuiButton-root').contains('arrow_back').should('be.visible').click();
    login();
    cy.get('.nav-bar').contains('Mehr...').click();
    cy.get('.MuiPaper-root').contains('Kommentare').click();

    cy.get('.comment-preview').contains('Testkommentar1').should('be.visible');
    cy.get('.comment-preview').contains('Testkommentar2').should('be.visible').click();
    cy.get('#comments').click();

    cy.contains('.comment-verification-container', 'Testkommentar1')
      .contains('button', 'Ablehnen')
      .click();
    cy.get('button').contains('Bestätigen').click();

    cy.contains('.comment-verification-container', 'Testkommentar2')
      .contains('button', 'Akzeptieren')
      .click();

    // navigate again to close the CommentsVerificationView in the background
    cy.visit('http://localhost:3000/picture/1');

    cy.contains('Testkommentar1').should('not.exist');
    cy.contains('Testkommentar2').should('be.visible');
    cy.contains('button', 'Akzeptieren').should('not.exist');
    cy.contains('button', 'Bestätigen').should('not.exist');
  });

  it('log out and check comments visibility', () => {
    cy.visit('http://localhost:3000');
    logout();

    cy.visit('http://localhost:3000/picture/1');

    cy.contains('Testkommentar1').should('not.exist');
    cy.contains('Testkommentar2').should('be.visible');

    cy.visit('http://localhost:3000');
    login();
    cy.visit('http://localhost:3000/picture/1');
    cy.contains('.comment-container', 'Testkommentar2').contains('button', 'Löschen').click();
    cy.contains('button', 'Bestätigen').click();
  });
});
