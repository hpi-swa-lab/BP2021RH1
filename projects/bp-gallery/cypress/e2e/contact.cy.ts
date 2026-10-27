import { login, logout } from '../utils/login-utils';

const mailpit = 'http://mailpit:8025/api/v1/messages';

const setArchiveEmail = (email: string) => {
  cy.visit('/archives/1');
  login();
  cy.get('[data-cy="archive-edit"]').click();
  cy.get('#archive-form-email').scrollIntoView().clear();
  if (email) cy.get('#archive-form-email').type(email);
  cy.get('#archive-form-email').blur();
  cy.contains('Änderungen speichern').click();
  cy.contains('Änderungen gespeichert');
  logout();
};

describe('Contact form', () => {
  before(() => {
    setArchiveEmail('archiv@example.com');
    cy.request('DELETE', mailpit);
  });
  after(() => {
    setArchiveEmail('');
  });

  it('sends the message to the archive by email', () => {
    cy.visit('/contact');
    cy.contains('Herbert-Ahrens-Bilderarchiv');
    cy.contains('label', 'Name').find('input').type('Erika Muster');
    cy.contains('label', 'Ihre E-Mail').find('input').type('erika@example.com');
    cy.contains('label', 'Betreff').find('input').type('Frage zu Bild 1');
    cy.contains('label', 'Nachricht')
      .find('textarea:not([aria-hidden])')
      .type('Wer ist auf dem Bild zu sehen?');
    cy.contains('Anfrage versenden').click();
    cy.contains('Ihre Nachricht ist eingegangen.');

    cy.request(mailpit)
      .its('body.messages')
      .should('have.length', 1)
      .its(0)
      .should('deep.include', {
        Subject: 'Neue Nachricht über das Kontaktformular: Frage zu Bild 1',
      })
      .its('To.0.Address')
      .should('equal', 'archiv@example.com');
  });
});
