export const selectPictures = (...ids: string[]) => {
  for (const id of ids) {
    cy.get(`#picture-preview-for-${id} .adornment[title="Bild auswählen"]`).click();
  }
};
