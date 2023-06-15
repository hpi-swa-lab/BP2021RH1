import { clickBulkOperation } from '../helper';

export const selectPictures = (...ids: string[]) => {
  for (const id of ids) {
    cy.get(`#picture-preview-for-${id} .adornment[title="Bild auswählen"]`).click();
  }
};

export const bulkEdit = () => {
  clickBulkOperation('Mehrere Bilder editieren');
};

export const visitArchive1Pictures = () => {
  cy.visit('/archives/1');
  cy.contains('.overview-selection-container', 'Unsere Bilder').contains('Mehr anzeigen').click();
};
