export const waitForAllImagesLoaded = () => {
  cy.get('img').should(images => {
    for (const image of Array.from(images)) {
      expect(image.naturalHeight).to.be.greaterThan(0);
    }
  });
};

export const waitForCuratorPictureInfo = () => {
  cy.get('[data-testid="save-status"]');
};

export const clickBulkOperation = (name: string) => {
  cy.get(`[title="${name}"]`).click();
};
