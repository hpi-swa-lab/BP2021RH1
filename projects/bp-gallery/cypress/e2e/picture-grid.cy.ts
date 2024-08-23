import { urlIs } from '../utils/url-utils';
import { waitForAllImagesLoaded } from './helper';

describe('picture grid', () => {
  it('should render more pictures after scrolling', () => {
    cy.visit('/start');
    cy.contains('.picture-count', 'Mehr als 100 Bilder');
    cy.get('.collection-picture-display .picture-grid .picture-preview').should('have.length', 100);
    waitForAllImagesLoaded();

    cy.get('.App').find('[data-testid="scrollable-container"]').scrollTo('bottom');
    cy.contains('.picture-count', '107 Bilder');
    cy.get('.collection-picture-display .picture-grid .picture-preview').should('have.length', 107);
  });

  it('has a working back button after navigating between pictures', () => {
    cy.visit('/archives/1');
    cy.get('.overview-container .picture-preview').first().click();
    cy.url().should('contain', '/picture/');
    cy.get('.picture-navigation-buttons [data-testid="next"]').click();
    cy.get('.picture-navigation-buttons [data-testid="next"]').click();
    cy.contains('Zurück').click();
    urlIs('/archives/1');
  });
});
