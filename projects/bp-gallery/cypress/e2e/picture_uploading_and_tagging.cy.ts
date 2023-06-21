import { login, logout } from '../utils/login-utils';

describe('picture uploading and tagging', () => {
  before(() => {
    cy.visit('/browse');
    login();
    cy.get('.nav-bar').contains('Mehr...').click();
    cy.get('.MuiPaper-root').contains('Collections').click();
    cy.contains('Collection hinzufügen').find('[data-testid="AddIcon"]').click();
    cy.contains('Neue Collection erstellen').click();
    cy.get('.MuiDialogContent-root').find('input').type('TestCollection');
    cy.get('.MuiButton-root').contains('Bestätigen').click();
    cy.get('.nav-bar').contains('Mehr...').click({ force: true });
    cy.get('.MuiPaper-root').contains('Uploads').click();
  });
  after(() => {
    cy.visit('/browse');
    cy.get('.nav-bar').contains('Mehr...').click();
    cy.get('.MuiPaper-root').contains('Schlagworte').click();
    cy.contains('.MuiDataGrid-row', 'TestSchlagwort').find('[data-testid="DeleteIcon"]').click();
    cy.get('.MuiButton-root').contains('Bestätigen').click();

    cy.get('.nav-bar').contains('Mehr...').click();
    cy.get('.MuiPaper-root').contains('Orte').click();
    cy.get('.location-entry-container:eq(2)').find('[data-testid="DeleteIcon"]').click();
    cy.get('.MuiButton-root').contains('Bestätigen').click();

    cy.get('.nav-bar').contains('Mehr...').click();
    cy.get('.MuiPaper-root').contains('Personen').click();
    cy.contains('.MuiDataGrid-row', 'TestPerson').find('[data-testid="DeleteIcon"]').click();
    cy.get('.MuiButton-root').contains('Bestätigen').click();

    cy.get('.nav-bar').contains('Mehr...').click();
    cy.get('.MuiPaper-root').contains('Collections').click();
    cy.contains('.panel-entry', 'TestCollection').find('[data-testid="DeleteIcon"]').click();

    logout();
  });

  it('uploading picture', () => {
    cy.get('.dropzone').selectFile('./cypress/testFiles/testbild.jpg', { action: 'drag-drop' });
    cy.get('.add-to-collection').click();
    cy.get('.MuiDialogContent-root').find('.MuiOutlinedInput-input').clear();
    cy.get('.MuiDialogContent-root')
      .find('.MuiOutlinedInput-input')
      .type('Herbert-Ahrens-Bilderarchiv');
    cy.get('.MuiAutocomplete-option').click();
    cy.get('.MuiButton-root').contains('Bestätigen').click();
  });

  it('tagging picture with year', () => {
    cy.get('[data-testid="scrollable-container"]').scrollTo('bottom', { ensureScrollable: false });
    cy.get('.picture-grid .picture-preview:last').click();
    cy.get('.date-indicator').click();
    cy.contains('.rdrInputRange', 'Jahr').find('input').clear();
    cy.contains('.rdrInputRange', 'Jahr').find('input').type('1000{esc}');
    cy.contains('.save-state', 'Gespeichert');
  });

  it('tagging picture with description', () => {
    cy.get('.add-button').click();
    cy.get('.description-wrapper').find('.jodit-container').type('Test');
    cy.get('.save-state:contains(Speichern ausstehend)').should('exist');
    cy.get('.picture-container img').click();
    cy.get('.save-state:contains(Gespeichert)').should('exist');
  });

  it('change picture description', () => {
    cy.get('.description-wrapper').find('.jodit-container').type('Beschreibung');
    cy.get('.save-state:contains(Speichern ausstehend)').should('exist');
    // regression test for https://github.com/hpi-swa-lab/BP2021RH1/issues/401
    cy.get('.picture-container img').click();
    cy.get('.save-state:contains(Gespeichert)').should('exist');
  });

  it('tagging picture with person tag', () => {
    cy.contains('.field-content', 'Personen').find('input').click();
    cy.contains('.field-content', 'Personen').find('input').clear();
    cy.contains('.field-content', 'Personen').find('input').type('TestPerson');
    cy.contains('TestPerson hinzufügen').click();
    cy.contains('.save-state', 'Gespeichert');
  });

  it('tagging picture with location tag', () => {
    cy.contains('.field-content', 'Orte').find('input').click();
    cy.contains('.field-content', 'Orte').find('input').clear();
    cy.contains('.field-content', 'Orte').find('input').type('TestOrt');
    cy.contains('TestOrt hinzufügen').click();
    cy.contains('.save-state', 'Gespeichert');
  });

  it('tagging picture with keyword tag', () => {
    cy.contains('.field-content', 'Schlagworte').find('input').click();
    cy.contains('.field-content', 'Schlagworte').find('input').clear();
    cy.contains('.field-content', 'Schlagworte').find('input').type('TestSchlagwort');
    cy.contains('TestSchlagwort hinzufügen').click();
    cy.contains('.save-state', 'Gespeichert');
  });

  it('tagging picture with collection', () => {
    cy.contains('.field-content', 'Collections').find('input').click();
    cy.contains('.field-content', 'Collections').find('input').clear();
    cy.contains('.field-content', 'Collections').find('input').type('TestCollection{enter}');
    cy.contains('.save-state', 'Gespeichert');
  });

  it('checking tags', () => {
    cy.visit('/browse/TestCollection');
    cy.get('[data-testid="scrollable-container"]').scrollTo('bottom', { ensureScrollable: false });

    cy.get('.picture-preview:last').click();

    cy.get('.picture-info-field').contains('1000').should('exist');
    cy.get('.picture-info-field').contains('TestBeschreibung').should('exist');
    cy.get('.picture-info-field').contains('TestPerson').should('exist');
    cy.get('.picture-info-field').contains('TestOrt').should('exist');
    cy.get('.picture-info-field').contains('TestSchlagwort').should('exist');
    cy.get('.picture-info-field').contains('TestCollection').should('exist');
    cy.get('.picture-info-field').contains('Herbert-Ahrens-Bilderarchiv').should('exist');
  });

  it('deleting picture', () => {
    cy.get('.picture-toolbar').find('[data-testid="ArrowBackIcon"]').click();
    cy.get('.picture-view').should('not.exist');
    cy.get('[data-testid="scrollable-container"]').scrollTo('bottom', { ensureScrollable: false });
    cy.get('.picture-preview:last').find('[data-testid=DeleteIcon]').click();
    cy.get('.MuiButton-root').contains('Bestätigen').click();
  });
});
