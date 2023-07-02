import { urlIs } from '../utils/url-utils';

describe('Navigation to Show More View from Discover View', () => {
  beforeEach(() => {
    cy.visit('/discover');
  });

  it('works for "Neuzugänge"', () => {
    cy.get('.overview-selection-container:contains(Neuzugänge)').contains('Mehr anzeigen').click();
    urlIs('/show-more/latest');
  });

  it('works for "Wissen Sie mehr über diese Bilder?"', () => {
    cy.get('.overview-container:contains(Wissen Sie mehr über diese Bilder?)')
      .contains('Mehr anzeigen')
      .click();
    urlIs('/show-more/pictures/Fragezeichen');
  });

  it('works for "Jahrzehnte"', () => {
    cy.get('.overview-container:contains(Jahrzehnte)').contains('Mehr anzeigen').click();
    urlIs('/show-more/date');
  });

  it('works for single decades', () => {
    for (let i = 0; i < 6; i++) {
      cy.get(
        `.overview-container:contains(Jahrzehnte) .overview-collection-grid-container .items .item:eq(${i})`
      ).click();
      urlIs(`/show-more/date/${i + 4}`);
      cy.go(-1); // is a bit faster using cy.go(-1) instead of cy.visit('/discover)
    }
  });

  it('works for "Orte"', () => {
    cy.get('.overview-selection-container:eq(1)').contains('Orte').click();
    cy.get('.overview-selection-container:contains(Orte)').contains('Mehr anzeigen').click();
    urlIs('/show-more/location');
  });

  it('works for single locations', () => {
    cy.get('.overview-selection-container:eq(1)').contains('Orte').click();
    // IDs of the six locations shown in tag overview
    const targetIDs = [7, 8, 9, 10, 11, 13];
    // iterate over the six locations shown in tag overview
    //for (const targetID of targetIDs) {
    targetIDs.forEach((targetID, index) => {
      cy.get(
        `.overview-selection-container:contains(Orte) .overview-collection-grid-container .items .item:eq(${index})`
      ).click();
      urlIs(`/show-more/location/${targetID}`);
      cy.go(-1); // is a bit faster using cy.go(-1) instead of cy.visit('/discover)
    });
  });

  it('works for "Unsere Kategorien"', () => {
    cy.contains('.overview-container', 'Unsere Kategorien').contains('Mehr anzeigen').click();
    urlIs('/show-more/keyword');
  });

  it('works for single keywords', () => {
    // IDs of the six keywords shown in tag overview
    const targetIDs = [9, 10, 11, 13, 14, 15];
    // iterate over the six keywords shown in tag overview
    targetIDs.forEach((targetID, index) => {
      cy.get(
        `.overview-container:contains(Unsere Kategorien) .overview-collection-grid-container .items .item:eq(${index})`
      ).click();
      urlIs(`/show-more/keyword/${targetID}`);
      cy.go(-1); // is a bit faster using cy.go(-1) instead of cy.visit('/discover)
    });
  });
});

describe('Navigation to Show More View from Archive View', () => {
  beforeEach(() => {
    cy.visit('/archives/1');
  });

  it('works for "Unsere Bilder"', () => {
    cy.get('.overview-selection-container:contains(Unsere Bilder)')
      .contains('Mehr anzeigen')
      .click();
    urlIs('/archives/1/show-more/pictures');
  });

  it('works for "Unsere Kategorien"', () => {
    cy.get('.overview-container:contains(Unsere Kategorien)').contains('Mehr anzeigen').click();
    urlIs('/archives/1/show-more/keyword');
  });

  it('works for single keywords', () => {
    // IDs of the six keywords shown in tag overview
    const targetIDs = [9, 10, 11, 13, 14, 15];
    // iterate over the six keywords shown in tag overview
    targetIDs.forEach((targetID, index) => {
      cy.get(
        `.overview-container:contains(Unsere Kategorien) .overview-collection-grid-container .items .item:eq(${index})`
      ).click();
      urlIs(`/archives/1/show-more/keyword/${targetID}`);
      cy.go(-1); // is a bit faster using cy.go(-1) instead of cy.visit('/discover)
    });
  });
});

describe('Global Show More View', () => {
  it('shows show more for "Neuzugänge"', () => {
    cy.visit('/show-more/latest');
    // check for text in show more view
    cy.contains('Neuzugänge');
    cy.contains(
      'Hier fließen die jüngsten 500 „Neuzugänge“ der Fotoarchive ein. Wer den schnellen Überblick haben möchte, welche Bilder aktuell gescannt und eingearbeitet wurden, ist hier richtig.'
    );

    // check for images in show more view
    cy.contains('Mehr als 100 Bilder');
    for (const id of [2, 3, 4, 5]) {
      cy.get(`.picture-grid .row #picture-preview-for-${id}`).should('exist');
    }
  });

  it('shows show more for "Wissen Sie mehr über diese Bilder?"', () => {
    cy.visit('/show-more/pictures/Fragezeichen');
    // check for text in show more view
    cy.contains('Fragezeichen');
    cy.contains('Fragezeichen Collection Testbeschreibung');

    // check for images in show more view
    cy.contains('4 Bilder');
    for (const id of [2, 3, 4, 5]) {
      cy.get(`.picture-grid .row #picture-preview-for-${id}`).should('exist');
    }
  });

  it('shows show more view for "Jahrzehnte"', () => {
    cy.visit('/show-more/date');
    // check for text in show more view
    cy.contains('Jahrzehnte');
    cy.contains('Hier finden Sie alle Bilder unseres Archivs aus den bestimmten Jahrzehnten.');

    // check for categories
    const targetTexts = ['FRÜHER', '50ER', '60ER', '70ER', '80ER', '90ER'];
    targetTexts.forEach((targetText, index) => {
      cy.get(`.overview-collection-grid-container .items .item:eq(${index})`).should(
        'contain.text',
        targetText
      );
    });

    // check for images in show more view
    cy.contains('Mehr als 100 Bilder');
    for (const id of [2, 3, 4, 5]) {
      cy.get(`.picture-grid .row #picture-preview-for-${id}`).should('exist');
    }
  });

  it('shows show more view for single decade "70er"', () => {
    cy.visit('/show-more/date/7');
    // check text on show more view
    cy.contains('1970er');

    // contains no images
    cy.contains('2 Bilder');
    for (const id of [4, 5]) {
      cy.get(`.picture-grid .row #picture-preview-for-${id}`).should('exist');
    }
  });

  it('shows show more view for "Orte', () => {
    cy.visit('/show-more/location');
    // check for text in show more view
    cy.contains('Orte');
    cy.contains('Hier finden Sie alle Orte unseres Archivs');

    // check for categories in show more view
    for (const num of [1, 2, 3, 4, 5, 6, 7]) {
      cy.get('.overview-collection-grid-container .items').should(
        'contain.text',
        `VERIFIZIERTER TESTORT ${num}`
      );
    }

    // check for images in show more view
    cy.contains('Mehr als 100 Bilder');
    for (const id of [2, 3, 4, 5]) {
      cy.get(`.picture-grid .row #picture-preview-for-${id}`).should('exist');
    }
  });

  it('shows show more for single location "Verifizierter Testort 3"', () => {
    cy.visit('/show-more/location/9');
    // check text on show more view
    cy.contains('Verifizierter Testort 3');

    cy.contains('1 Bild');
    cy.get('.picture-grid .row #picture-preview-for-4').should('exist');
  });

  it('shows show more view for "Unsere Kategorien"', () => {
    cy.visit('/show-more/keyword');
    // check for text in show more view
    cy.contains('Unsere Kategorien');
    cy.contains('Hier finden Sie alle thematischen Kategorien unseres Archivs');

    // check for categories in show more view
    for (const num of [2, 3, 4, 5, 6, 7]) {
      cy.get('.overview-collection-grid-container .items').should(
        'contain.text',
        `VERIFIZIERTES TESTSCHLAGWORT ${num}`
      );
    }

    // check for images in show more view
    cy.contains('Mehr als 100 Bilder');
    for (const id of [2, 3, 4, 5]) {
      cy.get(`.picture-grid .row #picture-preview-for-${id}`).should('exist');
    }
  });

  it('shows show more for single keyword "Verifiziertes Testschlagwort 4"', () => {
    cy.visit('/show-more/keyword/11');
    // check text on show more view
    cy.contains('Verifiziertes Testschlagwort 4');

    cy.contains('1 Bild');
    cy.get('.picture-grid .row #picture-preview-for-4').should('exist');
  });
});

describe('Archive Show More View', () => {
  it('shows show more for "Unsere Bilder"', () => {
    cy.visit('/archives/1/show-more/pictures');
    // check for text in show more view
    cy.contains('Unsere Bilder');
    cy.contains('Hier finden Sie alle Bilder dieses Archivs');

    // check for images in show more view
    cy.contains('5 Bilder');
    for (const id of [1, 2, 3, 4, 5]) {
      cy.get(`.picture-grid .row #picture-preview-for-${id}`).should('exist');
    }
  });

  it('shows show more view for "Unsere Kategorien"', () => {
    cy.visit('/archives/1/show-more/keyword');
    // check for text in show more view
    cy.contains('Unsere Kategorien');
    cy.contains('Hier finden Sie alle thematischen Kategorien unseres Archivs');

    // check for categories in show more view
    for (const num of [2, 3, 4, 5, 6, 7]) {
      cy.get('.overview-collection-grid-container .items').should(
        'contain.text',
        `VERIFIZIERTES TESTSCHLAGWORT ${num}`
      );
    }

    // check for images in show more view
    cy.contains('5 Bilder');
    for (const id of [1, 2, 3, 4, 5]) {
      cy.get(`.picture-grid .row #picture-preview-for-${id}`).should('exist');
    }
  });

  it('shows show more for single keyword "Verifiziertes Testschlagwort 4"', () => {
    cy.visit('/archives/1/show-more/keyword/11');
    // check text on show more view
    cy.contains('Verifiziertes Testschlagwort 4');

    cy.contains('1 Bild');
    cy.get('.picture-grid .row #picture-preview-for-4').should('exist');
  });
});
