import './commands';

beforeEach(() => {
  cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
    'getIngredients'
  );

  // Или регулярное выражение (надёжнее)
  // cy.intercept('GET', /\/api\/ingredients$/, { fixture: 'ingredients.json' }).as('getIngredients');
});
