import { login, logout } from '../utils/login-utils';

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

  it('link a picture to a text', () => {
    cy.visit('/picture/2');
    cy.get('.clipboard-editor-open').click();
    cy.contains('.clipboard-editor', 'Keine Bilder');
    cy.contains('.clipboard-editor button', 'Aktuelles Bild kopieren').click();
    cy.get('.clipboard-editor #picture-preview-for-2');
    cy.contains('.clipboard-editor', 'Keine Bilder').should('not.exist');

    cy.visit('/picture/1');
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
    ).click();
    cy.get('.picture-info-field[data-type="links"] #picture-preview-for-1');

    cy.visit('/picture/1');
    cy.get('.picture-info-field[data-type="links"] #picture-preview-for-3');
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