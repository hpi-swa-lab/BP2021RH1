import { login, logout } from '../utils/login-utils';

describe('picture uploading and tagging', () => {
  before(() => {
    cy.visit('http://localhost:3000/browse');
    login();
    cy.get('.nav-bar').contains('Mehr...').click();
    cy.get('.MuiPaper-root').contains('Collections').click();
    cy.get('span').contains('add').click();
    cy.get('span').contains('Neue Collection erstellen').click();
    cy.get('.MuiDialogContent-root').find('input').type('TestCollection');
    cy.get('.MuiButton-root').contains('Bestätigen').click();
    cy.get('.nav-bar').contains('Mehr...').click({ force: true });
    cy.get('.MuiPaper-root').contains('Uploads').click();
  });
  after(() => {
    cy.wait(1000);
    cy.visit('http://localhost:3000/browse');
    cy.get('.nav-bar').contains('Mehr...').click();
    cy.get('.MuiPaper-root').contains('Schlagworte').click().wait(1000);
    cy.contains('.MuiDataGrid-row', 'TestSchlagwort').find('[data-testid="DeleteIcon"]').click();
    cy.get('.MuiButton-root').contains('Bestätigen').click();

    cy.get('.nav-bar').contains('Mehr...').click();
    cy.get('.MuiPaper-root').contains('Orte').click().wait(1000);
    cy.contains('.MuiDataGrid-row', 'TestOrt').find('[data-testid="DeleteIcon"]').click();
    cy.get('.MuiButton-root').contains('Bestätigen').click();

    cy.get('.nav-bar').contains('Mehr...').click();
    cy.get('.MuiPaper-root').contains('Personen').click().wait(1000);
    cy.contains('.MuiDataGrid-row', 'TestPerson').find('[data-testid="DeleteIcon"]').click();
    cy.get('.MuiButton-root').contains('Bestätigen').click();

    cy.get('.nav-bar').contains('Mehr...').click();
    cy.get('.MuiPaper-root').contains('Collections').click().wait(1000);
    cy.contains('.panel-entry', 'TestCollection').find('[data-testid="DeleteIcon"]').click();

    logout();
  });

  it('uploading picture', () => {
    cy.get('div.dropzone').selectFile('./cypress/testFiles/testbild.jpg', { action: 'drag-drop' });
    cy.get('.add-to-collection').click();
    cy.get('.MuiDialogContent-root')
      .find('.MuiOutlinedInput-input')
      .clear()
      .type('Herbert-Ahrens-Bilderarchiv');
    cy.get('.MuiAutocomplete-option').click();
    cy.get('.MuiButton-root').contains('Bestätigen').click();
    cy.wait(3000);
  });

  it('tagging picture', () => {
    cy.get('.scrollable-container').scrollTo('bottom', { ensureScrollable: false });
    cy.get('.picture-preview:last').click();
    cy.get('.date-indicator').click();
    cy.get('span').contains('Jahr').siblings().clear().type('1000{esc}');
    cy.wait(500);

    cy.get('.add-button').click();
    cy.get('div')
      .contains('Beschreibungen')
      .siblings()
      .find('div.jodit-wysiwyg')
      .clear()
      .type('TestBeschreibung');

    cy.get('div')
      .contains('Personen')
      .parent()
      .find('input')
      .click()
      .wait(1000)
      .clear()
      .type('TestPerson');
    cy.contains('TestPerson hinzufügen').click();

    cy.get('div')
      .contains('Orte')
      .parent()
      .find('input')
      .click()
      .wait(1000)
      .clear()
      .type('TestOrt');
    cy.contains('TestOrt hinzufügen').click();

    cy.get('div')
      .contains('Schlagworte')
      .parent()
      .find('input')
      .click()
      .wait(1000)
      .clear()
      .type('TestSchlagwort');
    cy.contains('TestSchlagwort hinzufügen').click();

    cy.get('div')
      .contains('Collections')
      .parent()
      .find('input')
      .click()
      .wait(1000)
      .clear()
      .type('TestCollection{enter}');
  });

  it('checking tags and deleting picture', () => {
    cy.visit('http://localhost:3000/browse/TestCollection').wait(2000);
    cy.get('.scrollable-container').scrollTo('bottom', { ensureScrollable: false });

    cy.get('.picture-preview:last').click();

    cy.get('.picture-info-field').contains('1000').should('exist');
    cy.get('.picture-info-field').contains('TestBeschreibung').should('exist');
    cy.get('.picture-info-field').contains('TestPerson').should('exist');
    cy.get('.picture-info-field').contains('TestOrt').should('exist');
    cy.get('.picture-info-field').contains('TestSchlagwort').should('exist');
    cy.get('.picture-info-field').contains('TestCollection').should('exist');
    cy.get('.picture-info-field').contains('Herbert-Ahrens-Bilderarchiv').should('exist');

    cy.get('button').contains('arrow_back').click().wait(2000);
    cy.get('.scrollable-container').scrollTo('bottom', { ensureScrollable: false });
    cy.get('.picture-preview:last').find('[data-testid=DeleteIcon]').click();
    cy.get('.MuiButton-root').contains('Bestätigen').click();
  });
});
