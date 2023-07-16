import { login, logout } from '../../utils/login-utils';
import { bulkEdit, selectPictures, visitArchive1Pictures } from './helper';

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
    cy.visit('/picture/4');
    cy.contains('Yet another description');
    cy.visit('/picture/5');
    cy.contains('Yet another description');
    visitArchive1Pictures();
    selectPictures('4', '5');
    bulkEdit();
    cy.contains('Yet another description');
  });

  it('shows different descriptions as no description', () => {
    cy.visit('/picture/2');
    cy.contains('Yet another description');
    cy.visit('/picture/3');
    cy.contains('Keine Zeit bekannt').should('not.exist');
    cy.contains('Keine Beschreibung vorhanden');
    visitArchive1Pictures();
    selectPictures('2', '3');
    bulkEdit();
    cy.contains('Keine Zeit bekannt').should('not.exist');
    cy.contains('Keine Beschreibung vorhanden');
  });

  it('shows only the shared descriptions', () => {
    cy.visit('/picture/1');
    cy.contains('Yet another description');
    cy.contains('This is a description!');
    cy.visit('/picture/2');
    cy.contains('Yet another description');
    cy.contains('This is a description!').should('not.exist');
    visitArchive1Pictures();
    selectPictures('1', '2');
    bulkEdit();
    cy.contains('Yet another description');
    cy.contains('This is a description!').should('not.exist');
  });

  it('adds and deletes descriptions while leaving exclusive descriptions as they are', () => {
    cy.visit('/picture/1');
    cy.contains('Yet another description');
    cy.contains('This is a description!');
    cy.contains('Irgendwas cooles').should('not.exist');
    cy.visit('/picture/2');
    cy.contains('Yet another description');
    cy.contains('This is a description!').should('not.exist');
    cy.contains('Irgendwas cooles').should('not.exist');
    visitArchive1Pictures();
    selectPictures('1', '2');
    bulkEdit();
    cy.contains('.picture-info-field', 'Beschreibungen')
      .find('.MuiIconButton-root [data-testid="AddIcon"]')
      .click();
    cy.contains('.picture-info-field', 'Beschreibungen')
      .find('.jodit-wysiwyg:empty')
      .type('Irgendwas cooles');
    cy.contains('.field-title', 'Beschreibungen').click();
    cy.contains('[data-testid="save-status"]', 'Gespeichert.');

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
    bulkEdit();
    cy.contains('.description-wrapper', 'Irgendwas cooles')
      .find('.MuiIconButton-root [data-testid="DeleteIcon"]')
      .click();
    cy.contains('Bestätigen').click();
    cy.contains('[data-testid="save-status"]', 'Gespeichert.');
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
