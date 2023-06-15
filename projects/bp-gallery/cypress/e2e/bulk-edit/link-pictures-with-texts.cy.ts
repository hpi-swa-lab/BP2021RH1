// ignore entire suite while #431 is unresolved
/*

import { login, logout } from '../../utils/login-utils';
import { bulkEdit, selectPictures } from './helper';

const textsForSinglePictureToMultipleTexts = ['30', '31', '32'];
const textForSingleTextToMultiplePictures = '33';
const textsForMultipleTextsToMultiplePictures = ['34', '35'];
const textsForMultiplePicturesToMultipleTexts = ['36', '37', '38'];
const allTexts = [
  ...textsForSinglePictureToMultipleTexts,
  textForSingleTextToMultiplePictures,
  ...textsForMultipleTextsToMultiplePictures,
  ...textsForMultiplePicturesToMultipleTexts,
];
const pictureForSinglePictureToMultipleTexts = '40';
const picturesForSingleTextToMultiplePictures = ['41', '42', '43'];
const picturesForMultipleTextsToMultiplePictures = ['44', '45', '46'];
const picturesForMultiplePicturesToMultipleTexts = ['47', '48'];

describe('bulk edit link pictures with texts', () => {
  before(() => {
    cy.visit('/');
    login();
  });
  after(() => {
    cy.visit('/');
    logout();
  });

  it('marks multiple pictures as texts', () => {
    cy.visit('/start');
    selectPictures(...allTexts);
    bulkEdit();
    cy.contains('Verlinkte Texte');
    cy.contains('button', 'Als Text markieren').find('[data-testid="CheckBoxOutlineBlankIcon"]');
    cy.contains('Als Text markieren').click();
    cy.contains('button', 'Als Text markieren').find('[data-testid="CheckBoxIcon"]');
    cy.contains('Verlinkte Bilder');
    for (const text of allTexts) {
      cy.visit(`/picture/${text}`);
      cy.contains('Verlinkte Bilder');
    }
  });

  it('links a picture to multiple texts', () => {
    const picture = pictureForSinglePictureToMultipleTexts;
    cy.visit(`/picture/${picture}`);
    cy.get('.clipboard-editor-open').click();
    cy.contains('.clipboard-editor', 'Keine Bilder');
    cy.contains('.clipboard-editor button', 'Aktuelles Bild kopieren').click();
    cy.get(`.clipboard-editor #picture-preview-for-${picture}`);
    cy.contains('.clipboard-editor', 'Keine Bilder').should('not.exist');

    const texts = textsForSinglePictureToMultipleTexts;
    cy.visit('/start');
    selectPictures(...texts);
    bulkEdit();
    cy.contains(
      '.picture-info-field[data-type="links"] button',
      `Ein kopiertes Bild einfügen`
    ).scrollIntoView();
    cy.contains('Lädt...').should('not.exist');
    cy.contains(
      '.picture-info-field[data-type="links"] button',
      `Ein kopiertes Bild einfügen`
    ).click();

    cy.get(`.picture-info-field[data-type="links"] #picture-preview-for-${picture}`);
    for (const text of texts) {
      cy.visit(`/picture/${text}`);
      cy.get(`.picture-info-field[data-type="links"] #picture-preview-for-${picture}`);
    }

    cy.visit(`/picture/${picture}`);
    for (const text of texts) {
      cy.get(`.picture-info-field[data-type="links"] #picture-preview-for-${text}`);
    }

    cy.get('.clipboard-editor-open').click();
    cy.contains('.clipboard-editor button', 'Ablage leeren').click();
    cy.contains('.clipboard-editor', 'Keine Bilder');
  });

  it('links a text to multiple pictures', () => {
    const text = textForSingleTextToMultiplePictures;
    cy.visit(`/picture/${text}`);
    cy.get('.clipboard-editor-open').click();
    cy.contains('.clipboard-editor', 'Keine Bilder');
    cy.contains('.clipboard-editor button', 'Aktuellen Text kopieren').click();
    cy.get(`.clipboard-editor #picture-preview-for-${text}`);
    cy.contains('.clipboard-editor', 'Keine Bilder').should('not.exist');

    const pictures = picturesForSingleTextToMultiplePictures;
    cy.visit('/start');
    selectPictures(...pictures);
    bulkEdit();
    cy.contains(
      '.picture-info-field[data-type="links"] button',
      'Einen kopierten Text einfügen'
    ).scrollIntoView();
    cy.contains('Lädt...').should('not.exist');
    cy.contains(
      '.picture-info-field[data-type="links"] button',
      'Einen kopierten Text einfügen'
    ).click();

    cy.get(`.picture-info-field[data-type="links"] #picture-preview-for-${text}`);
    for (const picture of pictures) {
      cy.visit(`/picture/${picture}`);
      cy.get(`.picture-info-field[data-type="links"] #picture-preview-for-${text}`);
    }

    cy.visit(`/picture/${text}`);
    for (const picture of pictures) {
      cy.get(`.picture-info-field[data-type="links"] #picture-preview-for-${picture}`);
    }

    cy.get('.clipboard-editor-open').click();
    cy.contains('.clipboard-editor button', 'Ablage leeren').click();
    cy.contains('.clipboard-editor', 'Keine Bilder');
  });

  it('links multiple texts to multiple pictures', () => {
    const texts = textsForMultipleTextsToMultiplePictures;
    cy.visit('/start');
    selectPictures(...texts);
    bulkEdit();
    cy.get('.clipboard-editor-open').click();
    cy.contains('.clipboard-editor', 'Keine Bilder');
    cy.contains('.clipboard-editor button', 'Aktuelle Texte kopieren').click();
    for (const text of texts) {
      cy.get(`.clipboard-editor #picture-preview-for-${text}`);
    }
    cy.contains('.clipboard-editor', 'Keine Bilder').should('not.exist');

    const pictures = picturesForMultipleTextsToMultiplePictures;
    cy.visit('/start');
    selectPictures(...pictures);
    bulkEdit();
    cy.contains(
      '.picture-info-field[data-type="links"] button',
      `${texts.length} kopierte Texte einfügen`
    ).scrollIntoView();
    cy.contains('Lädt...').should('not.exist');
    cy.contains(
      '.picture-info-field[data-type="links"] button',
      `${texts.length} kopierte Texte einfügen`
    ).click();

    for (const text of texts) {
      cy.get(`.picture-info-field[data-type="links"] #picture-preview-for-${text}`);
    }
    for (const picture of pictures) {
      cy.visit(`/picture/${picture}`);
      for (const text of texts) {
        cy.get(`.picture-info-field[data-type="links"] #picture-preview-for-${text}`);
      }
    }

    for (const text of texts) {
      cy.visit(`/picture/${text}`);
      for (const picture of pictures) {
        cy.get(`.picture-info-field[data-type="links"] #picture-preview-for-${picture}`);
      }
    }

    cy.get('.clipboard-editor-open').click();
    cy.contains('.clipboard-editor button', 'Ablage leeren').click();
    cy.contains('.clipboard-editor', 'Keine Bilder');
  });

  it('links multiple pictures to multiple texts', () => {
    const pictures = picturesForMultiplePicturesToMultipleTexts;
    cy.visit('/start');
    selectPictures(...pictures);
    bulkEdit();
    cy.get('.clipboard-editor-open').click();
    cy.contains('.clipboard-editor', 'Keine Bilder');
    cy.contains('.clipboard-editor button', 'Aktuelle Bilder kopieren').click();
    for (const picture of pictures) {
      cy.get(`.clipboard-editor #picture-preview-for-${picture}`);
    }
    cy.contains('.clipboard-editor', 'Keine Bilder').should('not.exist');

    const texts = textsForMultiplePicturesToMultipleTexts;
    cy.visit('/start');
    selectPictures(...texts);
    bulkEdit();
    cy.contains(
      '.picture-info-field[data-type="links"] button',
      `${pictures.length} kopierte Bilder einfügen`
    ).scrollIntoView();
    cy.contains('Lädt...').should('not.exist');
    cy.contains(
      '.picture-info-field[data-type="links"] button',
      `${pictures.length} kopierte Bilder einfügen`
    ).click();

    for (const picture of pictures) {
      cy.get(`.picture-info-field[data-type="links"] #picture-preview-for-${picture}`);
    }
    for (const text of texts) {
      cy.visit(`/picture/${text}`);
      for (const picture of pictures) {
        cy.get(`.picture-info-field[data-type="links"] #picture-preview-for-${picture}`);
      }
    }

    for (const picture of pictures) {
      cy.visit(`/picture/${picture}`);
      for (const text of texts) {
        cy.get(`.picture-info-field[data-type="links"] #picture-preview-for-${text}`);
      }
    }

    cy.get('.clipboard-editor-open').click();
    cy.contains('.clipboard-editor button', 'Ablage leeren').click();
    cy.contains('.clipboard-editor', 'Keine Bilder');
  });

  it('prevents marking texts as pictures when links are present', () => {
    cy.visit('/start');
    selectPictures(...allTexts);
    bulkEdit();
    cy.contains('Verlinkte Bilder');
    cy.contains('button', 'Als Text markieren').find('[data-testid="CheckBoxIcon"]');
    cy.contains('Als Text markieren').click();
    cy.contains('Es sind noch Bilder verlinkt');
    cy.contains('O.K.').click();
    cy.contains('button', 'Als Text markieren').find('[data-testid="CheckBoxIcon"]');
  });

  it('removes links from linking a text to multiple pictures', () => {
    const pictures = picturesForSingleTextToMultiplePictures;
    cy.visit('/start');
    selectPictures(...pictures);
    bulkEdit();
    cy.contains('Lädt...').should('not.exist');
    const text = textForSingleTextToMultiplePictures;
    cy.get(`#picture-preview-for-${text} [data-testid="LinkOffIcon"]`).click();
    cy.contains('Lädt...').should('not.exist');
    cy.get('.picture-info-field[data-type="links"] .picture-preview').should('not.exist');
    for (const picture of pictures) {
      cy.visit(`/picture/${picture}`);
      cy.get('.picture-info-field[data-type="links"]');
      cy.contains('Lädt...').should('not.exist');
      cy.get('.picture-info-field[data-type="links"] .picture-preview').should('not.exist');
    }
    cy.visit(`/picture/${text}`);
    cy.get('.picture-info-field[data-type="links"]');
    cy.contains('Lädt...').should('not.exist');
    cy.get('.picture-info-field[data-type="links"] .picture-preview').should('not.exist');
  });

  it('removes links from linking a picture to multiple texts', () => {
    const texts = textsForSinglePictureToMultipleTexts;
    cy.visit('/start');
    selectPictures(...texts);
    bulkEdit();
    cy.contains('Lädt...').should('not.exist');
    const picture = pictureForSinglePictureToMultipleTexts;
    cy.get(`#picture-preview-for-${picture} [data-testid="LinkOffIcon"]`).click();
    cy.contains('Lädt...').should('not.exist');
    cy.get('.picture-info-field[data-type="links"] .picture-preview').should('not.exist');
    for (const text of texts) {
      cy.visit(`/picture/${text}`);
      cy.get('.picture-info-field[data-type="links"]');
      cy.contains('Lädt...').should('not.exist');
      cy.get('.picture-info-field[data-type="links"] .picture-preview').should('not.exist');
    }
    cy.visit(`/picture/${picture}`);
    cy.get('.picture-info-field[data-type="links"]');
    cy.contains('Lädt...').should('not.exist');
    cy.get('.picture-info-field[data-type="links"] .picture-preview').should('not.exist');
  });

  it('removes links from linking multiple texts to multiple pictures', () => {
    const pictures = picturesForMultipleTextsToMultiplePictures;
    cy.visit('/start');
    selectPictures(...pictures);
    bulkEdit();
    cy.contains('Lädt...').should('not.exist');
    cy.contains('Alle Links entfernen').click();
    cy.contains('Bestätigen').click();
    cy.contains('Lädt...').should('not.exist');
    cy.get('.picture-info-field[data-type="links"] .picture-preview').should('not.exist');
    for (const picture of pictures) {
      cy.visit(`/picture/${picture}`);
      cy.get('.picture-info-field[data-type="links"]');
      cy.contains('Lädt...').should('not.exist');
      cy.get('.picture-info-field[data-type="links"] .picture-preview').should('not.exist');
    }
    const texts = textsForMultipleTextsToMultiplePictures;
    for (const text of texts) {
      cy.visit(`/picture/${text}`);
      cy.get('.picture-info-field[data-type="links"]');
      cy.contains('Lädt...').should('not.exist');
      cy.get('.picture-info-field[data-type="links"] .picture-preview').should('not.exist');
    }
  });

  it('removes links from linking multiple pictures to multiple texts', () => {
    const texts = textsForMultiplePicturesToMultipleTexts;
    cy.visit('/start');
    selectPictures(...texts);
    bulkEdit();
    cy.contains('Lädt...').should('not.exist');
    cy.contains('Alle Links entfernen').click();
    cy.contains('Bestätigen').click();
    cy.contains('Lädt...').should('not.exist');
    cy.get('.picture-info-field[data-type="links"] .picture-preview').should('not.exist');
    for (const text of texts) {
      cy.visit(`/picture/${text}`);
      cy.get('.picture-info-field[data-type="links"]');
      cy.contains('Lädt...').should('not.exist');
      cy.get('.picture-info-field[data-type="links"] .picture-preview').should('not.exist');
    }
    const pictures = picturesForMultiplePicturesToMultipleTexts;
    for (const picture of pictures) {
      cy.visit(`/picture/${picture}`);
      cy.get('.picture-info-field[data-type="links"]');
      cy.contains('Lädt...').should('not.exist');
      cy.get('.picture-info-field[data-type="links"] .picture-preview').should('not.exist');
    }
  });

  it('marks multiple texts as pictures', () => {
    cy.visit('/start');
    selectPictures(...allTexts);
    bulkEdit();
    cy.contains('Verlinkte Bilder');
    cy.contains('button', 'Als Text markieren').find('[data-testid="CheckBoxIcon"]');
    cy.contains('Als Text markieren').click();
    cy.contains('button', 'Als Text markieren').find('[data-testid="CheckBoxOutlineBlankIcon"]');
    cy.contains('Verlinkte Texte');
    for (const text of allTexts) {
      cy.visit(`/picture/${text}`);
      cy.contains('Verlinkte Texte');
    }
  });
});

*/
