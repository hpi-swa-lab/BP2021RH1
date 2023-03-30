import { login, logout } from '../utils/login-utils';

const postComment = (name: string, comment: string) => {
  cy.get('input#name').scrollIntoView();
  cy.get('input#name').clear();
  cy.get('input#name').type(name);
  cy.get('textarea#text').clear();
  cy.get('textarea#text').type(comment);
  cy.get('.MuiButton-root').contains('Absenden').click();
};

const closeModal = (text: string, buttonText: string) => {
  cy.get('.MuiDialog-container').contains(text).should('be.visible');
  cy.get('.MuiButton-root').contains(buttonText).should('be.visible').click();
};

describe('Comment', () => {
  before(() => {
    cy.visit('/picture/1');
  });
  after(() => {
    cy.visit('/');
    login();
    cy.visit('/picture/1');
    cy.contains('.comment-container', 'Testkommentar').contains('button', 'Löschen').click();
    cy.contains('button', 'Bestätigen').click();
    cy.contains('Testkommentar').should('not.exist');
    cy.visit('/');
    logout();
  });

  it('adds a comment to picture 1', () => {
    cy.get('input#name').should('be.visible').clear();
    cy.get('input#name').type('Hans Hansen');
    cy.get('textarea#text').should('be.visible').clear();
    cy.get('textarea#text').type('Testkommentar1');
    cy.get('.MuiButton-root').contains('Absenden').should('be.visible').click();
    cy.get('.MuiDialog-container').contains('Danke für Ihren Kommentar!').should('be.visible');
    cy.get('.MuiButton-root').contains('O.K.').should('be.visible').click();

    cy.get('input#name').should('be.visible').clear();
    cy.get('input#name').type('Hans Hansen');
    cy.get('textarea#text').should('be.visible').clear();
    cy.get('textarea#text').type('Testkommentar2');
    cy.get('.MuiButton-root').contains('Absenden').should('be.visible').click();
    cy.get('.MuiDialog-container').contains('Danke für Ihren Kommentar!').should('be.visible');
    cy.get('.MuiButton-root').contains('O.K.').should('be.visible').click();
  });

  it('log in as curator and curate the new comments', () => {
    cy.get('.picture-toolbar').find('[data-testid="ArrowBackIcon"]').click();
    login();
    cy.get('.nav-bar').contains('Mehr...').click();
    cy.get('.MuiPaper-root').contains('Kommentare').click();

    cy.get('.comment-preview').contains('Testkommentar1').should('be.visible');
    cy.get('.comment-preview').contains('Testkommentar2').scrollIntoView();
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
    cy.visit('/picture/1');

    cy.contains('Testkommentar1').should('not.exist');
    cy.contains('Testkommentar2');
    cy.contains('button', 'Akzeptieren').should('not.exist');
    cy.contains('button', 'Bestätigen').should('not.exist');
  });

  it('is possible to to freely nest comments', () => {
    cy.get('#comments').click();
    postComment('Olaf Ober', 'Oberkommentar1');
    closeModal('Danke für Ihren Kommentar!', 'Verstanden');
    cy.contains('.comment-verification-container', 'Oberkommentar1')
      .contains('button', 'Akzeptieren')
      .click();
    cy.contains('.comment', 'Oberkommentar1').within(() => {
      cy.contains('button', 'Antworten').click();
      postComment('Hans Unter', 'Unterkommentar1');
      cy.contains('.comment', 'Unterkommentar1');
      cy.contains('.comment-verification-container', 'Unterkommentar1')
        .contains('button', 'Akzeptieren')
        .click();
      cy.contains('button', 'Antworten').click();
      postComment('Hans Unter', 'Unterkommentar2');
      cy.contains('.comment', 'Unterkommentar2');
      cy.contains('.comment', 'Unterkommentar1').within(() => {
        cy.contains('button', 'Antworten').click();
        postComment('Hans Unter', 'UnterUnterkommentar1');
        cy.contains('.comment', 'UnterUnterkommentar1');
      });
    });
  });

  it('deletes all descendants when deleting a comment and shows a warning', () => {
    cy.contains('.comment', 'Oberkommentar1').contains('button', 'Löschen').click();
    closeModal('Warnung', 'Bestätigen');
    cy.contains('Oberkommentar1').should('not.exist');
    cy.contains('Unterkommentar1').should('not.exist');
    cy.contains('Unterkommentar2').should('not.exist');
    cy.contains('UnterUnterkommentar1').should('not.exist');
  });

  it('is possible to edit a comment when logged in', () => {
    cy.contains('.comment', 'Testkommentar2').within(() => {
      cy.contains('button', 'Editieren').click();
      cy.get('.jodit-react-container').type('{backspace}');
      cy.contains('button', 'Editieren').click();
      cy.contains('Testkommentar2').should('not.exist');
      cy.contains('Testkommentar');
    });
  });

  it('doesnt show an edit or reply button to unauthorized users', () => {
    cy.visit('/');
    logout();
    cy.visit('/picture/1');
    cy.contains('Testkommentar1').should('not.exist');
    cy.contains('Testkommentar').should('be.visible');
    cy.contains('button', 'Antworten').should('be.visible');
    cy.contains('button', 'Editieren').should('not.exist');
    cy.contains('button', 'Löschen').should('not.exist');
  });
});
