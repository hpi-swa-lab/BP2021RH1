import { login, logout } from '../utils/login-utils';

const selectPictures = (...ids: string[]) => {
  for (const id of ids) {
    cy.get(`#picture-preview-for-${id} .adornment[title="Bild auswählen"]`).click();
  }
};

describe('bulk edit', () => {
  before(() => {
    cy.visit('/latest/');
    login();
  });
  after(() => {
    logout();
  });

  it('deselect all if and only if something was changed', () => {
    cy.get('.picture-preview .adornment[title="Bild auswählen"]').eq(0).click();
    cy.get('.picture-preview .adornment[title="Bild auswählen"]').eq(1).click();
    cy.contains('Mehrere Bilder editieren').click();
    cy.contains('Zurück').click();
    cy.get('.picture-preview .adornment[title="Bild auswählen"]')
      .eq(0)
      .find('[data-testid="CheckBoxIcon"]');
    cy.get('.picture-preview .adornment[title="Bild auswählen"]')
      .eq(1)
      .find('[data-testid="CheckBoxIcon"]');
    cy.contains('Mehrere Bilder editieren').click();
    cy.contains('.picture-info-field', 'Personen').find('input').type('Simon');
    cy.contains('Simon Heraldson').click();
    cy.contains('.save-state', 'Gespeichert');
    cy.contains('.MuiChip-root', 'Simon Heraldson').find('[data-testid="CancelIcon"]').click(); // cleanup
    cy.contains('.save-state', 'Gespeichert');
    cy.contains('Zurück').click();
    cy.get('.picture-preview .adornment [data-testid="CheckBoxIcon"]').should('not.exist');
  });
});

describe('bulk edit dates', () => {
  before(() => {
    cy.visit('/');
    login();
  });
  after(() => {
    cy.visit('/');
    logout();
  });

  it('shows the same date as the date', () => {
    cy.visit('/archives/1');
    selectPictures('2', '3');
    cy.contains('Mehrere Bilder editieren').click();
    cy.contains('01.01.1961 - 31.01.2022');
  });

  it('shows different dates as no date', () => {
    cy.visit('/archives/1');
    selectPictures('2', '5');
    cy.contains('Mehrere Bilder editieren').click();
    cy.contains('Keine Zeit bekannt');
  });

  it('sets the date of different dates to the same, set date', () => {
    cy.visit('/archives/1');
    selectPictures('1', '5');
    cy.contains('Mehrere Bilder editieren').click();
    cy.contains('Keine Zeit bekannt').click();
    cy.get('.rdrDateInput').eq(0).clear();
    cy.get('.rdrDateInput').eq(0).type('20.04.1969{enter}{esc}');
    cy.contains('.save-state', 'Gespeichert.');
    cy.visit('/picture/5');
    cy.contains('20.04.1969').click();
    // cleanup
    cy.get('.rdrDateInput').eq(0).clear();
    cy.get('.rdrDateInput').eq(0).type('01.04.1970{enter}{esc}');
    cy.contains('.save-state', 'Gespeichert.');
    cy.contains('01.04.1970');

    cy.visit('/picture/1');
    cy.contains('20.04.1969').click();
    // cleanup
    cy.get('.rdrDateInput').eq(0).clear();
    cy.get('.rdrDateInput').eq(0).type('01.01.1961{enter}');
    cy.get('.rdrDateInput').eq(1).clear();
    cy.get('.rdrDateInput').eq(1).type('31.01.2022{enter}{esc}');
    cy.contains('.save-state', 'Gespeichert.');
    cy.contains('01.01.1961 - 31.01.2022');
  });
});

describe('bulk edit descriptions', () => {
  before(() => {
    cy.visit('/');
    login();
  });
  after(() => {
    cy.visit('/');
    logout();
  });

  it('shows the same description as the description', () => {
    cy.visit('/archives/1');
    selectPictures('4', '5');
    cy.contains('Mehrere Bilder editieren').click();
    cy.contains('Yet another description');
  });

  it('shows different descriptions as no description', () => {
    cy.visit('/archives/1');
    selectPictures('2', '3');
    cy.contains('Mehrere Bilder editieren').click();
    cy.contains('Keine Beschreibung vorhanden');
  });

  it('shows only the shared descriptions', () => {
    cy.visit('/archives/1');
    selectPictures('1', '2');
    cy.contains('Mehrere Bilder editieren').click();
    cy.contains('Yet another description');
    cy.contains('This is a description!').should('not.exist');
  });

  it('adds and deletes descriptions while leaving exclusive descriptions as they are', () => {
    cy.visit('/archives/1');
    selectPictures('1', '2');
    cy.contains('Mehrere Bilder editieren').click();
    cy.contains('.picture-info-field', 'Beschreibungen')
      .contains('.MuiIconButton-root', 'add')
      .click();
    cy.contains('.picture-info-field', 'Beschreibungen')
      .find('.jodit-wysiwyg:empty')
      .type('Irgendwas cooles');
    cy.contains('.field-title', 'Beschreibungen').click();
    cy.contains('.save-state', 'Gespeichert.');

    cy.visit('/picture/1');
    cy.contains('Yet another description');
    cy.contains('This is a description!');
    cy.contains('Irgendwas cooles');

    cy.visit('/picture/2');
    cy.contains('Yet another description');
    cy.contains('This is a description!').should('not.exist');
    cy.contains('Irgendwas cooles');

    cy.visit('/archives/1');
    selectPictures('1', '2');
    cy.contains('Mehrere Bilder editieren').click();
    cy.contains('.description-wrapper', 'Irgendwas cooles')
      .contains('.MuiIconButton-root', 'delete')
      .click();
    cy.contains('Bestätigen').click();
    cy.contains('.save-state', 'Gespeichert.');
    cy.contains('Yet another description');
    cy.contains('Irgendwas cooles').should('not.exist');

    cy.visit('/picture/1');
    cy.contains('Yet another description');
    cy.contains('This is a description!');
    cy.contains('Irgendwas cooles').should('not.exist');

    cy.visit('/picture/2');
    cy.contains('Yet another description');
    cy.contains('This is a description!').should('not.exist');
    cy.contains('Irgendwas cooles').should('not.exist');
  });
});
