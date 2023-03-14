import { login, logout } from '../../utils/login-utils';
import { selectPictures, visitArchive1Pictures } from './helper';

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
    visitArchive1Pictures();
    selectPictures('4', '5');
    cy.contains('Mehrere Bilder editieren').click();
    cy.contains('Yet another description');
  });

  it('shows different descriptions as no description', () => {
    visitArchive1Pictures();
    selectPictures('2', '3');
    cy.contains('Mehrere Bilder editieren').click();
    cy.contains('Keine Beschreibung vorhanden');
  });

  it('shows only the shared descriptions', () => {
    visitArchive1Pictures();
    selectPictures('1', '2');
    cy.contains('Mehrere Bilder editieren').click();
    cy.contains('Yet another description');
    cy.contains('This is a description!').should('not.exist');
  });

  it('adds and deletes descriptions while leaving exclusive descriptions as they are', () => {
    visitArchive1Pictures();
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

    visitArchive1Pictures();
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
