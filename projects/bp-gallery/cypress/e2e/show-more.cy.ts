describe('Show More View', () => {
  before(() => {
    cy.visit('/discover');
  });
  afterEach(() => {
    // leave show more view
    cy.contains('Zurück').click();
  });
  after(() => {});

  it('shows show more for "Unsere Bilder"', () => {
    // click show more button
    cy.get('.carousel-container:first').contains('Mehr anzeigen').click();

    // check for text in show more view
    cy.contains('Unsere Bilder');
    cy.contains('Hier finden Sie alle Bilder unseres Archivs');

    // check for images in show more view
    cy.contains('5 Bild(er)');
    cy.get('.picture-grid .row #picture-preview-for-5').should('exist');
    cy.get('.picture-grid .row #picture-preview-for-4').should('exist');
    cy.get('.picture-grid .row #picture-preview-for-3').should('exist');
    cy.get('.picture-grid .row #picture-preview-for-2').should('exist');
    cy.get('.picture-grid .row #picture-preview-for-1').should('exist');
  });

  it('shows show more for "Wissen Sie mehr über diese Bilder?"', () => {
    // click show more button
    cy.get('.carousel-container:eq(1)').contains('Mehr anzeigen').click();

    // check for text in show more view
    cy.contains('Fragezeichen');
    cy.contains('Fragezeichen Collection Testbeschreibung');

    // check for images in show more view
    cy.contains('4 Bild(er)');
    cy.get('.picture-grid .row #picture-preview-for-5').should('exist');
    cy.get('.picture-grid .row #picture-preview-for-4').should('exist');
    cy.get('.picture-grid .row #picture-preview-for-3').should('exist');
    cy.get('.picture-grid .row #picture-preview-for-2').should('exist');
  });

  it('shows show more view for "Jahrzehnte"', () => {
    // click show more button
    cy.get('.carousel-container:eq(2)').contains('Mehr anzeigen').click();

    // check for text in show more view
    cy.contains('Jahrzehnte');
    cy.contains('Hier finden Sie alle Bilder unseres Archivs aus den bestimmten Jahrzehnten.');

    // check for categories
    cy.get('.carousel-collection-grid-container .items .item:eq(0)').should(
      'contain.text',
      'FRÜHER'
    );
    cy.get('.carousel-collection-grid-container .items .item:eq(1)').should('contain.text', '50ER');
    cy.get('.carousel-collection-grid-container .items .item:eq(2)').should('contain.text', '60ER');
    cy.get('.carousel-collection-grid-container .items .item:eq(3)').should('contain.text', '70ER');
    cy.get('.carousel-collection-grid-container .items .item:eq(4)').should('contain.text', '80ER');
    cy.get('.carousel-collection-grid-container .items .item:eq(5)').should('contain.text', '90ER');

    // check for images in show more view
    cy.contains('5 Bild(er)');
    cy.get('.picture-grid .row #picture-preview-for-5').should('exist');
    cy.get('.picture-grid .row #picture-preview-for-4').should('exist');
    cy.get('.picture-grid .row #picture-preview-for-3').should('exist');
    cy.get('.picture-grid .row #picture-preview-for-2').should('exist');
    cy.get('.picture-grid .row #picture-preview-for-1').should('exist');

    // check if navigation to single decade works
    cy.get('.carousel-collection-grid-container .items').contains('70ER').click();

    // check text on show more view
    cy.contains('1970er');

    // contains no images
    cy.contains('2 Bild(er)');
    cy.get('.picture-grid .row #picture-preview-for-5').should('exist');
    cy.get('.picture-grid .row #picture-preview-for-4').should('exist');

    // leave show more view
    cy.contains('Zurück').click();
  });

  it('shows show more view for "Orte', () => {
    // click show more button
    cy.get('.carousel-container:eq(3)').contains('Mehr anzeigen').click();

    // check for text in show more view
    cy.contains('Orte');
    cy.contains('Hier finden Sie alle Orte unseres Archivs');

    // check for categories in show more view
    cy.get('.carousel-collection-grid-container .items')
      .should('contain.text', 'VERIFIZIERTER TESTORT 1')
      .and('contain.text', 'VERIFIZIERTER TESTORT 2')
      .and('contain.text', 'VERIFIZIERTER TESTORT 3')
      .and('contain.text', 'VERIFIZIERTER TESTORT 4')
      .and('contain.text', 'VERIFIZIERTER TESTORT 5')
      .and('contain.text', 'VERIFIZIERTER TESTORT 6')
      .and('contain.text', 'VERIFIZIERTER TESTORT 7');

    // check for images in show more view
    cy.contains('5 Bild(er)');
    cy.get('.picture-grid .row #picture-preview-for-5').should('exist');
    cy.get('.picture-grid .row #picture-preview-for-4').should('exist');
    cy.get('.picture-grid .row #picture-preview-for-3').should('exist');
    cy.get('.picture-grid .row #picture-preview-for-2').should('exist');
    cy.get('.picture-grid .row #picture-preview-for-1').should('exist');

    // check if navigation to single decade works
    cy.get('.carousel-collection-grid-container .items')
      .contains('VERIFIZIERTER TESTORT 3')
      .click();

    // check text on show more view
    cy.contains('Verifizierter Testort 3');

    // contains no images
    cy.contains('1 Bild(er)');
    cy.get('.picture-grid .row #picture-preview-for-4').should('exist');

    // leave show more view
    cy.contains('Zurück').click();
  });

  it('shows show more view for "Unsere Kategorien"', () => {
    // click show more button
    cy.get('.carousel-container:eq(4)').contains('Mehr anzeigen').click();

    // check for text in show more view
    cy.contains('Unsere Kategorien');
    cy.contains('Hier finden Sie alle thematischen Kategorien unseres Archivs');

    // check for categories in show more view
    cy.get('.carousel-collection-grid-container .items')
      .and('contain.text', 'VERIFIZIERTES TESTSCHLAGWORT 2')
      .and('contain.text', 'VERIFIZIERTES TESTSCHLAGWORT 3')
      .and('contain.text', 'VERIFIZIERTES TESTSCHLAGWORT 4')
      .and('contain.text', 'VERIFIZIERTES TESTSCHLAGWORT 5')
      .and('contain.text', 'VERIFIZIERTES TESTSCHLAGWORT 6')
      .and('contain.text', 'VERIFIZIERTES TESTSCHLAGWORT 7');

    // check for images in show more view
    cy.contains('5 Bild(er)');
    cy.get('.picture-grid .row #picture-preview-for-5').should('exist');
    cy.get('.picture-grid .row #picture-preview-for-4').should('exist');
    cy.get('.picture-grid .row #picture-preview-for-3').should('exist');
    cy.get('.picture-grid .row #picture-preview-for-2').should('exist');
    cy.get('.picture-grid .row #picture-preview-for-1').should('exist');

    // check if navigation to single decade works
    cy.get('.carousel-collection-grid-container .items')
      .contains('VERIFIZIERTES TESTSCHLAGWORT 4')
      .click();

    // check text on show more view
    cy.contains('Verifiziertes Testschlagwort 4');

    // contains no images
    cy.contains('1 Bild(er)');
    cy.get('.picture-grid .row #picture-preview-for-4').should('exist');

    // leave show more view
    cy.contains('Zurück').click();
  });

  it('shows show more view for "Früher" (empty)', () => {
    // click show more button
    cy.get('.carousel-container:eq(2)').contains('FRÜHER').click();

    // check text on show more view
    cy.contains('Früher');

    // contains no images
    cy.contains('Keine Bilder');
    cy.get('.picture-grid').should('contain.not.class', 'picture-preview');
  });

  it('shows show more view for "70er" (not empty)', () => {
    // click show more button
    cy.get('.carousel-container:eq(2)').contains('70ER').click();

    // check text on show more view
    cy.contains('1970er');

    // contains no images
    cy.contains('2 Bild(er)');
    cy.get('.picture-grid .row #picture-preview-for-5').should('exist');
    cy.get('.picture-grid .row #picture-preview-for-4').should('exist');
  });

  it('shows show more view for special location "Verifizierter Testort 3"', () => {
    // click show more button
    cy.get('.carousel-container:eq(3)').contains('VERIFIZIERTER TESTORT 3').click();

    // check text on show more view
    cy.contains('Verifizierter Testort 3');

    // contains no images
    cy.contains('1 Bild(er)');
    cy.get('.picture-grid .row #picture-preview-for-4').should('exist');
  });

  it('shows show more view for special location "Verifiziertes Testschlagwort 4"', () => {
    // click show more button
    cy.get('.carousel-container:eq(4)').contains('VERIFIZIERTES TESTSCHLAGWORT 4').click();

    // check text on show more view
    cy.contains('Verifiziertes Testschlagwort 4');

    // contains no images
    cy.contains('1 Bild(er)');
    cy.get('.picture-grid .row #picture-preview-for-4').should('exist');
  });

  it('shows show more for "Unsere Bilder" from archive view', () => {
    // got to archive view for archive 1
    cy.visit('/archives/1');

    // click show more button
    cy.get('.carousel-container:first').contains('Mehr anzeigen').click();

    // check for text in show more view
    cy.contains('Unsere Bilder');
    cy.contains('Hier finden Sie alle Bilder unseres Archivs');

    // check for images in show more view
    cy.contains('5 Bild(er)');
    cy.get('.picture-grid .row #picture-preview-for-5').should('exist');
    cy.get('.picture-grid .row #picture-preview-for-4').should('exist');
    cy.get('.picture-grid .row #picture-preview-for-3').should('exist');
    cy.get('.picture-grid .row #picture-preview-for-2').should('exist');
    cy.get('.picture-grid .row #picture-preview-for-1').should('exist');
  });

  it('shows show more view for "Unsere Kategorien" from archive view', () => {
    // click show more button
    cy.get('.carousel-container:eq(1)').contains('Mehr anzeigen').click();

    // check for text in show more view
    cy.contains('Unsere Kategorien');
    cy.contains('Hier finden Sie alle thematischen Kategorien unseres Archivs');

    // check for categories in show more view
    cy.get('.carousel-collection-grid-container .items')
      .and('contain.text', 'VERIFIZIERTES TESTSCHLAGWORT 2')
      .and('contain.text', 'VERIFIZIERTES TESTSCHLAGWORT 3')
      .and('contain.text', 'VERIFIZIERTES TESTSCHLAGWORT 4')
      .and('contain.text', 'VERIFIZIERTES TESTSCHLAGWORT 5')
      .and('contain.text', 'VERIFIZIERTES TESTSCHLAGWORT 6')
      .and('contain.text', 'VERIFIZIERTES TESTSCHLAGWORT 7');

    // check for images in show more view
    cy.contains('5 Bild(er)');
    cy.get('.picture-grid .row #picture-preview-for-5').should('exist');
    cy.get('.picture-grid .row #picture-preview-for-4').should('exist');
    cy.get('.picture-grid .row #picture-preview-for-3').should('exist');
    cy.get('.picture-grid .row #picture-preview-for-2').should('exist');
    cy.get('.picture-grid .row #picture-preview-for-1').should('exist');
  });
});
