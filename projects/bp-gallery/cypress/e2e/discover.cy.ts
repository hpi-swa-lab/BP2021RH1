describe('Discover View', () => {
  before(() => {
    //code für setup
    cy.visit('/discover');
  });
  after(() => {
    //code für break down
  });

  it('shows "Neuzugänge" picture overview', () => {
    // check for basic components (title, show more button)
    cy.get('.overview-selection-container:first')
      .children()
      .should('contain.text', 'Neuzugänge')
      .and('contain.text', 'Mehr anzeigen');

    // check if it contains rows with images
    cy.get(
      '.overview-container:first .overview-picture-grid-container div .picture-grid .row:has(.picture-preview)'
    ).should('exist');

    // check if contains at most 2 rows of images or 2 and one empty row
    cy.get(
      '.overview-container:first .overview-picture-grid-container div .picture-grid .row:has(.picture-preview)'
    ).should('have.length.lte', 2);
  });

  it('shows "Wissen Sie mehr über diese Bilder?" picture overview', () => {
    //check for basic components (title, show more button)
    cy.get('.overview-container:eq(1)')
      .children()
      .should('contain.text', 'Wissen Sie mehr über diese Bilder?')
      .and('contain.text', 'Mehr anzeigen');

    // check if it contains rows with images
    cy.get(
      '.overview-container:eq(1) .overview-picture-grid-container div .picture-grid .row:has(.picture-preview)'
    ).should('exist');

    // check if contains at most 1 row of images or 1 and one empty row
    cy.get(
      '.overview-container:eq(1) .overview-picture-grid-container div .picture-grid .row:has(.picture-preview)'
    ).should('have.length.lte', 1);

    // check if the correct images are displayed in the picture overview
    cy.get(
      '.overview-container:eq(1) .overview-picture-grid-container div .picture-grid .row:has(.picture-preview) #picture-preview-for-5'
    ).should('exist');
    cy.get(
      '.overview-container:eq(1) .overview-picture-grid-container div .picture-grid .row:has(.picture-preview) #picture-preview-for-4'
    ).should('exist');
    cy.get(
      '.overview-container:eq(1) .overview-picture-grid-container div .picture-grid .row:has(.picture-preview) #picture-preview-for-3'
    ).should('exist');
  });

  it('shows decades tag overview', () => {
    cy.get('.overview-selection-container:eq(1)').contains('Jahrzehnte').click();

    // check for basic components (title, show more button)
    cy.get('.overview-selection-container:eq(1)')
      .children()
      .should('contain.text', 'Jahrzehnte')
      .and('contain.text', 'Mehr anzeigen');

    // check if it contains all decades in correct order
    cy.get(
      '.overview-selection-container:eq(1) .overview-collection-grid-container .items .item:eq(0)'
    ).should('contain.text', 'FRÜHER');
    cy.get(
      '.overview-selection-container:eq(1) .overview-collection-grid-container .items .item:eq(1)'
    ).should('contain.text', '50ER');
    cy.get(
      '.overview-selection-container:eq(1) .overview-collection-grid-container .items .item:eq(2)'
    ).should('contain.text', '60ER');
    cy.get(
      '.overview-selection-container:eq(1) .overview-collection-grid-container .items .item:eq(3)'
    ).should('contain.text', '70ER');
    cy.get(
      '.overview-selection-container:eq(1) .overview-collection-grid-container .items .item:eq(4)'
    ).should('contain.text', '80ER');
    cy.get(
      '.overview-selection-container:eq(1) .overview-collection-grid-container .items .item:eq(5)'
    ).should('contain.text', '90ER');
  });

  it('shows "Orte" tag overview', () => {
    cy.get('.overview-selection-container:eq(2)').contains('Orte').click();
    // check for basic components (title, show more button)
    cy.get('.overview-selection-container:eq(2)')
      .children()
      .should('contain.text', 'Orte')
      .and('contain.text', 'Mehr anzeigen');

    // check if it contains first 6 verified locations
    cy.get('.overview-selection-container:eq(2) .overview-collection-grid-container .items')
      .should('contain.text', 'VERIFIZIERTER TESTORT 1')
      .and('contain.text', 'VERIFIZIERTER TESTORT 2')
      .and('contain.text', 'VERIFIZIERTER TESTORT 3')
      .and('contain.text', 'VERIFIZIERTER TESTORT 4')
      .and('contain.text', 'VERIFIZIERTER TESTORT 5')
      .and('contain.text', 'VERIFIZIERTER TESTORT 6');
  });

  it('shows "Unsere Kategorien" tag overview', () => {
    // check for basic components (title, show more button)
    cy.get('.overview-container:eq(3)')
      .children()
      .should('contain.text', 'Unsere Kategorien')
      .and('contain.text', 'Mehr anzeigen');

    // check if it contains first 6 verified locations
    cy.get('.overview-container:eq(3) .overview-collection-grid-container .items')
      .should('contain.text', 'VERIFIZIERTES TESTSCHLAGWORT 2')
      .and('contain.text', 'VERIFIZIERTES TESTSCHLAGWORT 3')
      .and('contain.text', 'VERIFIZIERTES TESTSCHLAGWORT 4')
      .and('contain.text', 'VERIFIZIERTES TESTSCHLAGWORT 5')
      .and('contain.text', 'VERIFIZIERTES TESTSCHLAGWORT 6')
      .and('contain.text', 'VERIFIZIERTES TESTSCHLAGWORT 7');
  });
});
