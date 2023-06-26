let oldPictureId = '';

describe('Geo View', () => {
  before(() => {
    //code für setup
    cy.visit('/geo');
  });
  after(() => {
    //code für break down
  });

  it('shows modal with button', () => {
    // check if it contains a modal
    cy.get('.modal')
      .children()
      .should('contain.text', 'Hilf uns Ortskoordinaten ausfindig zu machen!');

    // check if it contains a button
    cy.get('[data-testid="dont-show-again-button"]').click();

    //check if modal does not exist anymore
    cy.get('.modal').should('not.exist');
  });

  it('shows an image and a map', () => {
    //picture container contains a real image
    cy.get('.picture-container').children().should('have.attr', 'src').and('include', 'http://');

    //save the picture id of the image
    cy.get('[data-testid="geo-image"]')
      .invoke('attr', 'data-pictureId')
      .then(elem => {
        oldPictureId = elem ?? '';
      });

    // check if it contains a map
    cy.get('.map-container').should('exist');
  });

  it('shows a marker on click on the map', () => {
    //click on the map
    cy.get('.map-container').click();

    //check if a marker is displayed
    cy.get('.leaflet-marker-icon').should('exist');
  });

  it('shows guess complete when guess is submitted', () => {
    cy.get('[data-testid="submit-guess"]').click();

    cy.get('.guess-complete-text').should('exist');
  });

  it('shows new picture when guess is submitted', () => {
    cy.get('[data-testid="next-picture"]').click();

    cy.get('[data-testid="geo-image"]')
      .invoke('attr', 'data-pictureId')
      .then(elem => {
        expect(elem).to.not.equal(oldPictureId);
      });
  });

  it("shows completed guess when user don't know the location", () => {
    cy.get('[data-testid="dont-know"]').click();

    cy.get('.guess-complete-text').should('contain.text', 'Beim nächsten Bild weißt du es!');

    cy.get('[data-testid="next-picture"]').click();
  });

  it("shows directly the next picture when this isn't a picture", () => {
    cy.get('[data-testid="not-a-place"]').click();

    cy.get('[data-testid="next-picture"]').should('not.exist');
  });
});
