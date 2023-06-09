import { login, logout } from '../../utils/login-utils';
import { waitForCuratorPictureInfo } from '../helper';
import { selectPictures, visitArchive1Pictures } from './helper';

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
    visitArchive1Pictures();
    selectPictures('2', '3');
    cy.contains('Mehrere Bilder editieren').click();
    cy.contains('01.01.1961 - 31.01.2022');
  });

  it('shows different dates as no date', () => {
    visitArchive1Pictures();
    selectPictures('2', '5');
    cy.contains('Mehrere Bilder editieren').click();
    cy.contains('Keine Zeit bekannt');
  });

  it('sets the date of different dates to the same, set date', () => {
    visitArchive1Pictures();
    selectPictures('1', '5');
    cy.contains('Mehrere Bilder editieren').click();
    waitForCuratorPictureInfo();
    cy.contains('Keine Zeit bekannt').click();
    cy.get('.rdrDateInput').eq(0).clear();
    cy.get('.rdrDateInput').eq(0).type('20.04.1969{enter}{esc}');
    cy.contains('.save-state', 'Gespeichert.');
    cy.visit('/picture/5');
    waitForCuratorPictureInfo();
    cy.contains('20.04.1969').click();
    // cleanup
    cy.get('.rdrDateInput').eq(0).clear();
    cy.get('.rdrDateInput').eq(0).type('01.04.1970{enter}{esc}');
    cy.contains('.save-state', 'Gespeichert.');
    cy.contains('01.04.1970');

    cy.visit('/picture/1');
    waitForCuratorPictureInfo();
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
