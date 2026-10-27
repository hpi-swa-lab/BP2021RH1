const mailpit = 'http://mailpit:8025/api/v1/messages';

const fillForm = (subject: string) => {
  cy.visit('/contact');
  cy.contains('Herbert-Ahrens-Bilderarchiv');
  cy.contains('label', 'Name').find('input').type('Erika Muster');
  cy.contains('label', 'Ihre E-Mail').find('input').type('erika@example.com');
  cy.contains('label', 'Betreff').find('input').type(subject);
  cy.contains('label', 'Nachricht')
    .find('textarea:not([aria-hidden])')
    .type('Wer ist auf dem Bild zu sehen?');
};

const expectRejected = () => {
  cy.contains('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
  cy.contains('label', 'Nachricht')
    .find('textarea:not([aria-hidden])')
    .should('have.value', 'Wer ist auf dem Bild zu sehen?');
  cy.request(mailpit).its('body.messages').should('have.length', 0);
};

describe('Contact form', () => {
  beforeEach(() => {
    cy.request('DELETE', mailpit);
    cy.clock(Date.now(), ['Date']);
  });

  it('sends the message to the archive by email', () => {
    fillForm('Frage zu Bild 1');
    // The server rejects messages sent within 3 seconds as automated
    cy.tick(3000);
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

  it('tags a random-looking subject but still sends it', () => {
    fillForm('aZLYEpmJitLYJWMqkMg');
    cy.tick(3000);
    cy.contains('Anfrage versenden').click();
    cy.contains('Ihre Nachricht ist eingegangen.');

    cy.request(mailpit)
      .its('body.messages')
      .should('have.length', 1)
      .its('0.Subject')
      .should(
        'equal',
        '[Spamverdacht] Neue Nachricht über das Kontaktformular: aZLYEpmJitLYJWMqkMg'
      );
  });

  it('rejects a message sent within 3 seconds and sends it on retry', () => {
    fillForm('Frage zu Bild 1');
    cy.contains('Anfrage versenden').click();
    expectRejected();

    cy.tick(3000);
    cy.contains('Anfrage versenden').click();
    cy.contains('Ihre Nachricht ist eingegangen.');
    cy.request(mailpit).its('body.messages').should('have.length', 1);
  });

  it('rejects a message with the hidden field filled in', () => {
    fillForm('Frage zu Bild 1');
    cy.get('input[name="contact_check"]').type('https://spam.example.com', { force: true });
    cy.tick(3000);
    cy.contains('Anfrage versenden').click();
    expectRejected();
  });
});
