import { login, logout } from '../utils/login-utils';

const checkTextDisplay = ({ prefix = '', pictureId = '2', textId = '1' } = {}) => {
  cy.contains('Nur Bilder anzeigen');
  cy.get(`${prefix} #picture-preview-for-${pictureId}`);
  cy.get(`${prefix} #picture-preview-for-${textId}`).should('not.exist');
  cy.contains('Nur Bilder anzeigen').click();
  cy.contains('Bilder und Texte anzeigen').click();
  cy.get(`${prefix} #picture-preview-for-${pictureId}`);
  cy.get(`${prefix} #picture-preview-for-${textId}`);
  cy.contains('Bilder und Texte anzeigen').click();
  cy.contains('Nur Texte anzeigen').click();
  cy.get(`${prefix} #picture-preview-for-${pictureId}`).should('not.exist');
  cy.get(`${prefix} #picture-preview-for-${textId}`);
};

describe('link pictures with texts', () => {
  before(() => {
    cy.visit('/browse');
    login();
  });
  after(() => {
    cy.visit('/browse');
    logout();
  });

  it('mark picture as text', () => {
    cy.visit('/picture/1');
    cy.contains('Verlinkte Texte');
    cy.contains('button', 'Als Text markieren').find('[data-testid="CheckBoxOutlineBlankIcon"]');
    cy.contains('Als Text markieren').click();
    cy.contains('button', 'Als Text markieren').find('[data-testid="CheckBoxIcon"]');
    cy.contains('Verlinkte Bilder');
  });

  it('texts are shown only when explicitly asked for in search', () => {
    cy.visit('/search');
    cy.get('.search-bar-container').find('input').type('Yet another description{enter}');
    checkTextDisplay();
  });

  it('texts are shown only when explicitly asked for in archives view picture overview', () => {
    cy.visit('/archives/1');
    // always shows pictures only
    cy.get('#picture-preview-for-2');
    cy.get('#picture-preview-for-1').should('not.exist');
  });

  it('texts are shown only when explicitly asked for in archives view show more', () => {
    cy.visit('/archives/1/show-more/pictures');
    checkTextDisplay();
  });

  it('texts are shown only when explicitly asked for in start view', () => {
    cy.visit('/start');
    checkTextDisplay({ prefix: '.browse-container', pictureId: '25' });
  });

  it('texts are shown only when explicitly asked for in archives view keywords show more', () => {
    cy.visit('/archives/1/show-more/keyword');
    checkTextDisplay();
  });

  it('texts are shown only when explicitly asked for in archives view single keyword show more', () => {
    cy.visit('/archives/1/show-more/keyword/9');
    checkTextDisplay();
  });

  it('texts do not reduce the number of fetched pictures', () => {
    cy.visit('/');
    logout();
    cy.visit('/start');
    cy.contains('Mehr als 100 Bilder');
    login();
  });

  it('link a picture to a text', () => {
    cy.visit('/picture/2');
    cy.get('.clipboard-editor-open').should('have.attr', 'title', 'Kopierte Links').click();
    cy.contains('.clipboard-editor', 'Keine Bilder');
    cy.contains('.clipboard-editor button', 'Aktuelles Bild kopieren').click();
    cy.get('.clipboard-editor #picture-preview-for-2');
    cy.contains('.clipboard-editor', 'Keine Bilder').should('not.exist');

    cy.visit('/picture/1');
    cy.contains(
      '.picture-info-field[data-type="links"] button',
      'Ein kopiertes Bild einfügen'
    ).scrollIntoView();
    cy.contains('Lädt...').should('not.exist');
    cy.contains(
      '.picture-info-field[data-type="links"] button',
      'Ein kopiertes Bild einfügen'
    ).click();
    cy.get('.picture-info-field[data-type="links"] #picture-preview-for-2');

    cy.visit('/picture/2');
    cy.get('.picture-info-field[data-type="links"] #picture-preview-for-1');
  });

  it('clipboard is cleared in new session', () => {
    cy.window().then(window => window.sessionStorage.clear());
    cy.visit('/');
    login();
    cy.visit('/picture/1');
    cy.get('.clipboard-editor-open').click();
    cy.contains('.clipboard-editor', 'Keine Bilder');
  });

  it('link a text to a picture', () => {
    cy.visit('/picture/1');
    cy.get('.clipboard-editor-open').click();
    cy.contains('.clipboard-editor', 'Keine Bilder');
    cy.contains('.clipboard-editor button', 'Aktuellen Text kopieren').click();
    cy.get('.clipboard-editor #picture-preview-for-1');
    cy.contains('.clipboard-editor', 'Keine Bilder').should('not.exist');

    cy.visit('/picture/3');
    cy.contains(
      '.picture-info-field[data-type="links"] button',
      'Einen kopierten Text einfügen'
    ).scrollIntoView();
    cy.contains('Lädt...').should('not.exist');
    cy.contains(
      '.picture-info-field[data-type="links"] button',
      'Einen kopierten Text einfügen'
    ).click();
    cy.get('.picture-info-field[data-type="links"] #picture-preview-for-1');

    cy.visit('/picture/1');
    cy.get('.picture-info-field[data-type="links"] #picture-preview-for-3');
  });

  it('linked pictures and texts are shown when not logged in', () => {
    cy.visit('/');
    logout();
    cy.visit('/picture/1');
    cy.contains('Verlinkte Bilder');
    cy.get('.picture-info-field[data-type="links"] #picture-preview-for-2');
    cy.get('.picture-info-field[data-type="links"] #picture-preview-for-3');
    cy.visit('/picture/2');
    cy.contains('Verlinkte Texte');
    cy.get('.picture-info-field[data-type="links"] #picture-preview-for-1');
    cy.visit('/picture/3');
    cy.contains('Verlinkte Texte');
    cy.get('.picture-info-field[data-type="links"] #picture-preview-for-1');
    cy.visit('/');
    login();
  });

  it('cleanup', () => {
    cy.visit('/picture/1');
    cy.get('.clipboard-editor-open').click();
    cy.contains('.clipboard-editor button', 'Ablage leeren').click();
    cy.contains('.clipboard-editor', 'Keine Bilder');
    cy.get('.picture-info-field[data-type="links"] .picture-preview');
    cy.contains('.picture-info-field[data-type="links"] button', 'Alle Links entfernen').click();
    cy.get('button').contains('Bestätigen').click();
    cy.get('.picture-info-field[data-type="links"] .picture-preview').should('not.exist');
    cy.contains('Als Text markieren').click();
    cy.contains('button', 'Als Text markieren').find('[data-testid="CheckBoxOutlineBlankIcon"]');
    cy.contains('Verlinkte Texte');
    cy.visit('/picture/2');
    cy.get('.picture-info-field[data-type="links"] .picture-preview').should('not.exist');
    cy.visit('/picture/3');
    cy.get('.picture-info-field[data-type="links"] .picture-preview').should('not.exist');
  });
});
