import { login, logout } from '../utils/login-utils';

describe('bulk edit', () => {
  before(() => {
    cy.visit('/latest/');
    login();
  });
  after(() => {
    logout();
  });

  it('select multiple photos manually', () => {
    cy.get('.picture-preview').eq(0).find('.adornment.bottom-left').click();
    cy.get('.picture-preview').eq(1).find('.adornment.bottom-left').click();
    cy.get('.picture-preview').eq(2).find('.adornment.bottom-left').click();
    cy.get('.picture-preview').eq(0).find('[data-testid="CheckBoxIcon"]').should('exist');
    cy.get('.picture-preview').eq(1).find('[data-testid="CheckBoxIcon"]').should('exist');
    cy.get('.picture-preview').eq(2).find('[data-testid="CheckBoxIcon"]').should('exist');
  });
});