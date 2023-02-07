import { urlIs } from '../utils/url-utils';

describe('Navigation to Show More View from Discover View', () => {
  beforeEach(() => {
    cy.visit('/discover');
  });

  it('works for "Unsere Bilder"', () => {
    cy.get('.carousel-container:first').contains('Mehr anzeigen').click();
    urlIs('/show-more/0/pictures');
  });

  it('works for "Wissen Sie mehr über diese Bilder?"', () => {
    cy.get('.carousel-container:eq(1)').contains('Mehr anzeigen').click();
    urlIs('/show-more/0/pictures/Fragezeichen');
  });

  it('works for "Jahrzehnte"', () => {
    cy.get('.carousel-container:eq(2)').contains('Mehr anzeigen').click();
    urlIs('/show-more/0/date');
  });

  it('works for single decades', () => {
    for (let i = 0; i < 6; i++) {
      cy.get(
        `.carousel-container:eq(2) .carousel-collection-grid-container .items .item:eq(${i})`
      ).click();
      urlIs(`/show-more/0/date/${i + 4}`);
      cy.go(-1); // is a bit faster using cy.go(-1) instead of cy.visit('/discover)
    }
  });

  it('works for "Orte"', () => {
    cy.get('.carousel-container:eq(3)').contains('Mehr anzeigen').click();
    urlIs('/show-more/0/location');
  });

  it('works for single locations', () => {
    // IDs of the six locations shown in carousel
    const targetIDs = [7, 8, 9, 10, 11, 13];
    // itterate over hte six locations shown in carousel
    for (let i = 0; i < 6; i++) {
      cy.get(
        `.carousel-container:eq(3) .carousel-collection-grid-container .items .item:eq(${i})`
      ).click();
      urlIs(`/show-more/0/location/${targetIDs[i]}`);
      cy.go(-1); // is a bit faster using cy.go(-1) instead of cy.visit('/discover)
    }
  });

  it('works for "Unsere Kategorien"', () => {
    cy.get('.carousel-container:eq(4)').contains('Mehr anzeigen').click();
    urlIs('/show-more/0/keyword');
  });

  it('works for single keywords', () => {
    // IDs of the sic keywords shown in carousel
    const targetIDs = [9, 10, 11, 13, 14, 15];
    // itterate over the six keywords shown in carousel
    for (let i = 0; i < 6; i++) {
      cy.get(
        `.carousel-container:eq(4) .carousel-collection-grid-container .items .item:eq(${i})`
      ).click();
      urlIs(`/show-more/0/keyword/${targetIDs[i]}`);
      cy.go(-1); // is a bit faster using cy.go(-1) instead of cy.visit('/discover)
    }
  });
});

describe('Navigation to Show More View from Archive View', () => {
  beforeEach(() => {
    cy.visit('/archives/1');
  });

  it('works for "Unsere Bilder"', () => {
    cy.get('.carousel-container:first').contains('Mehr anzeigen').click();
    urlIs('/show-more/1/pictures');
  });

  it('works for "Unsere Kategorien"', () => {
    cy.get('.carousel-container:eq(1)').contains('Mehr anzeigen').click();
    urlIs('/show-more/1/keyword');
  });

  it('works for single keywords', () => {
    // IDs of the sic keywords shown in carousel
    const targetIDs = [9, 10, 11, 13, 14, 15];
    // itterate over the six keywords shown in carousel
    for (let i = 0; i < 6; i++) {
      cy.get(
        `.carousel-container:eq(1) .carousel-collection-grid-container .items .item:eq(${i})`
      ).click();
      urlIs(`/show-more/1/keyword/${targetIDs[i]}`);
      cy.go(-1); // is a bit faster using cy.go(-1) instead of cy.visit('/discover)
    }
  });
});

describe('Global Show More View', () => {
  it('shows show more for "Unsere Bilder"', () => {
    cy.visit('/show-more/0/pictures');
    // check for text in show more view
    cy.contains('Unsere Bilder');
    cy.contains('Hier finden Sie alle Bilder unseres Archivs');

    // check for images in show more view
    cy.contains('5 Bild(er)');
    for (let i = 1; i <= 5; i++) {
      cy.get(`.picture-grid .row #picture-preview-for-${i}`).should('exist');
    }
  });

  it('shows show more for "Wissen Sie mehr über diese Bilder?"', () => {
    cy.visit('/show-more/0/pictures/Fragezeichen');
    // check for text in show more view
    cy.contains('Fragezeichen');
    cy.contains('Fragezeichen Collection Testbeschreibung');

    // check for images in show more view
    cy.contains('4 Bild(er)');
    for (let i = 2; i <= 5; i++) {
      cy.get(`.picture-grid .row #picture-preview-for-${i}`).should('exist');
    }
  });

  it('shows show more view for "Jahrzehnte"', () => {
    cy.visit('/show-more/0/date');
    // check for text in show more view
    cy.contains('Jahrzehnte');
    cy.contains('Hier finden Sie alle Bilder unseres Archivs aus den bestimmten Jahrzehnten.');

    // check for categories
    const targetTexts = ['FRÜHER', '50ER', '60ER', '70ER', '80ER', '90ER'];
    for (let i = 0; i < 6; i++) {
      cy.get(`.carousel-collection-grid-container .items .item:eq(${i})`).should(
        'contain.text',
        targetTexts[i]
      );
    }

    // check for images in show more view
    cy.contains('5 Bild(er)');
    for (let i = 1; i <= 5; i++) {
      cy.get(`.picture-grid .row #picture-preview-for-${i}`).should('exist');
    }
  });

  it('shows show more view for single decade "70er"', () => {
    cy.visit('/show-more/0/date/7');
    // check text on show more view
    cy.contains('1970er');

    // contains no images
    cy.contains('2 Bild(er)');
    for (let i = 4; i <= 5; i++) {
      cy.get(`.picture-grid .row #picture-preview-for-${i}`).should('exist');
    }
  });

  it('shows show more view for "Orte', () => {
    cy.visit('/show-more/0/location');
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
    for (let i = 1; i <= 5; i++) {
      cy.get(`.picture-grid .row #picture-preview-for-${i}`).should('exist');
    }
  });

  it('shows show more for single location "Verifizierter Testort 3"', () => {
    cy.visit('/show-more/0/location/9');
    // check text on show more view
    cy.contains('Verifizierter Testort 3');

    // contains no images
    cy.contains('1 Bild(er)');
    cy.get('.picture-grid .row #picture-preview-for-4').should('exist');
  });

  it('shows show more view for "Unsere Kategorien"', () => {
    cy.visit('/show-more/0/keyword');
    // check for text in show more view
    cy.contains('Unsere Kategorien');
    cy.contains('Hier finden Sie alle thematischen Kategorien unseres Archivs');

    // check for categories in show more view
    cy.get('.carousel-collection-grid-container .items')
      .should('contain.text', 'VERIFIZIERTES TESTSCHLAGWORT 2')
      .and('contain.text', 'VERIFIZIERTES TESTSCHLAGWORT 3')
      .and('contain.text', 'VERIFIZIERTES TESTSCHLAGWORT 4')
      .and('contain.text', 'VERIFIZIERTES TESTSCHLAGWORT 5')
      .and('contain.text', 'VERIFIZIERTES TESTSCHLAGWORT 6')
      .and('contain.text', 'VERIFIZIERTES TESTSCHLAGWORT 7');

    // check for images in show more view
    cy.contains('5 Bild(er)');
    for (let i = 1; i <= 5; i++) {
      cy.get(`.picture-grid .row #picture-preview-for-${i}`).should('exist');
    }
  });

  it('shows show more for single keyword "Verifiziertes Testschlagwort 4"', () => {
    cy.visit('/show-more/0/keyword/11');
    // check text on show more view
    cy.contains('Verifiziertes Testschlagwort 4');

    // contains no images
    cy.contains('1 Bild(er)');
    cy.get('.picture-grid .row #picture-preview-for-4').should('exist');
  });
});

describe('Archive Show More View', () => {
  it('shows show more for "Unsere Bilder"', () => {
    cy.visit('/show-more/1/pictures');
    // check for text in show more view
    cy.contains('Unsere Bilder');
    cy.contains('Hier finden Sie alle Bilder unseres Archivs');

    // check for images in show more view
    cy.contains('5 Bild(er)');
    for (let i = 1; i <= 5; i++) {
      cy.get(`.picture-grid .row #picture-preview-for-${i}`).should('exist');
    }
  });

  it('shows show more view for "Unsere Kategorien"', () => {
    cy.visit('/show-more/1/keyword');
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
    for (let i = 1; i <= 5; i++) {
      cy.get(`.picture-grid .row #picture-preview-for-${i}`).should('exist');
    }
  });

  it('shows show more for single keyword "Verifiziertes Testschlagwort 4"', () => {
    cy.visit('/show-more/1/keyword/11');
    // check text on show more view
    cy.contains('Verifiziertes Testschlagwort 4');

    // contains no images
    cy.contains('1 Bild(er)');
    cy.get('.picture-grid .row #picture-preview-for-4').should('exist');
  });
});
