import { login, logout } from '../utils/login-utils';

describe('bulk edit', () => {
  before(() => {
    cy.visit('http://localhost:3000/latest/');
    login();
  });
  after(() => {
    cy.wait(1000);
    logout();
  });

  it('select multiple photos manually', () => {
    cy.wait(500);
    cy.get('.picture-preview')
      .eq(0)
      .within(() => {
        cy.get('.adornment.bottom-left').click();
      });
    cy.get('.picture-preview')
      .eq(1)
      .within(() => {
        cy.get('.adornment.bottom-left').click();
      });
    cy.get('.picture-preview')
      .eq(2)
      .within(() => {
        cy.get('.adornment.bottom-left').click();
      });
    cy.get('.picture-preview')
      .eq(0)
      .within(() => {
        cy.get('[data-testid="CheckBoxIcon"]').should('exist');
      });
    cy.get('.picture-preview')
      .eq(1)
      .within(() => {
        cy.get('[data-testid="CheckBoxIcon"]').should('exist');
      });
    cy.get('.picture-preview')
      .eq(2)
      .within(() => {
        cy.get('[data-testid="CheckBoxIcon"]').should('exist');
      });
  });
});
