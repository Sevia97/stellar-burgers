/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      dragIngredientToConstructor(ingredientName: string): Chainable<Element>;
      createOrder(): Chainable<Element>;
    }
  }
}

Cypress.Commands.add('dragIngredientToConstructor', (ingredientName: string) => {
  cy.contains(ingredientName).parent().trigger('dragstart');
  cy.get('[data-testid="constructor-drop-area"]').trigger('drop');
});

Cypress.Commands.add('createOrder', () => {
  cy.intercept('POST', 'https://norma.education-services.ru/api/orders', {
    statusCode: 200,
    fixture: 'order.json',
  }).as('createOrder');

  cy.get('button').contains('Оформить заказ').click();
  cy.wait('@createOrder');
});

export {};