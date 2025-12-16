describe('Burger Constructor Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');

    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: {
          email: 'test@example.com',
          name: 'Test User'
        }
      }
    }).as('getUser');

   cy.intercept('POST', '**/api/auth/token', {
      statusCode: 200,
      body: {
        success: true,
        accessToken: 'test-access-token'
      }
    }).as('refreshToken');

    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' });

    window.localStorage.setItem('accessToken', 'test-access-token');
    window.localStorage.setItem('refreshToken', 'test-refresh-token');

    cy.visit('http://localhost:4000');

    cy.wait('@getIngredients', { timeout: 10000 });
    cy.wait('@getUser');
  });

  afterEach(() => {
    // Очищаем токены
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('refreshToken');
  });

  // ПРОВЕРКА ЗАГРУЗКИ ИНГРЕДИЕНТОВ

  describe('Ingredients Loading', () => {
    it('should load and display ingredients', () => {
      cy.get('[data-testid="ingredient-item"]')
        .should('have.length.at.least', 3)
        .should('be.visible');

      cy.contains(
        '[data-testid="ingredient-item"]',
        'Краторная булка N-200i'
      ).within(() => {
        cy.get('[data-testid="ingredient-price"]').should('have.text', '1255');
      });

      cy.contains(
        '[data-testid="ingredient-item"]',
        'Биокотлета из марсианской Магнолии'
      ).within(() => {
        cy.get('[data-testid="ingredient-price"]').should('have.text', '424');
      });

      cy.contains('[data-testid="ingredient-item"]', 'Соус Spicy-X').within(
        () => {
          cy.get('[data-testid="ingredient-price"]').should('have.text', '90');
        }
      );
    });
  });

  // ДОБАВЛЕНИЕ ИНГРЕДИЕНТОВ В КОНСТРУКТОР

  describe('Adding Ingredients to Constructor', () => {
    it('should add bun to constructor', () => {
      cy.contains('[data-testid="ingredient-item"]', 'Краторная булка N-200i')
        .find('button')
        .should('contain', 'Добавить')
        .click();

      cy.get('[data-testid="constructor-bun-top"]')
        .should('contain', 'Краторная булка N-200i')
        .and('contain', '1255');

      cy.get('[data-testid="constructor-bun-bottom"]')
        .should('contain', 'Краторная булка N-200i')
        .and('contain', '1255');
    });

    it('should add main ingredient to constructor', () => {
      cy.contains(
        '[data-testid="ingredient-item"]',
        'Биокотлета из марсианской Магнолии'
      )
        .find('button')
        .should('contain', 'Добавить')
        .click();

      cy.get('[data-testid="constructor-filling"]')
        .should('contain', 'Биокотлета из марсианской Магнолии')
        .and('contain', '424');
    });

    it('should add sauce to constructor', () => {
      cy.contains('[data-testid="ingredient-item"]', 'Соус Spicy-X')
        .find('button')
        .should('contain', 'Добавить')
        .click();

      cy.get('[data-testid="constructor-filling"]')
        .should('contain', 'Соус Spicy-X')
        .and('contain', '90');
    });
  });

  // МОДАЛЬНОЕ ОКНО ИНГРЕДИЕНТА

  describe('Modal Windows', () => {
    it('should open ingredient modal on click', () => {
      cy.contains(
        '[data-testid="ingredient-item"]',
        'Краторная булка N-200i'
      ).click();

      cy.get('[data-testid="modal"]').should('be.visible');
      cy.get('[data-testid="modal-title"]').should(
        'contain',
        'Детали ингредиента'
      );
      cy.get('[data-testid="modal"]').should(
        'contain',
        'Краторная булка N-200i'
      );

      cy.get('[data-testid="modal"]').should('contain', 'Калории, ккал')
      cy.get('[data-testid="modal"]').should('contain', '420');

      cy.get('[data-testid="modal"]').should('contain', 'Белки, г');
      cy.get('[data-testid="modal"]').should('contain', '80');

      cy.get('[data-testid="modal"]').should('contain', 'Жиры, г');
      cy.get('[data-testid="modal"]').should('contain', '24');

      cy.get('[data-testid="modal"]').should('contain', 'Углеводы, г');
      cy.get('[data-testid="modal"]').should('contain', '53');
    });

    it('should close ingredient modal by close button', () => {
      cy.contains(
        '[data-testid="ingredient-item"]',
        'Краторная булка N-200i'
      ).click();
      cy.get('[data-testid="modal"]').should('be.visible');
      cy.get('[data-testid="modal-close"]').click();
      cy.get('[data-testid="modal"]').should('not.exist');
    });

    it('should close ingredient modal by overlay click', () => {
      cy.contains(
        '[data-testid="ingredient-item"]',
        'Краторная булка N-200i'
      ).click();
      cy.get('[data-testid="modal"]').should('be.visible');
      cy.get('[data-testid="modal-overlay"]').click({ force: true });
      cy.get('[data-testid="modal"]').should('not.exist');
    });
  });

  // ОФОРМЛЕНИЕ ЗАКАЗА

  describe('Order Creation', () => {
    beforeEach(() => {
      // Подменим запрос создания заказа
      cy.intercept('POST', 'https://norma.education-services.ru/api/orders', {
        fixture: 'order.json'
      }).as('createOrder');

      // Добавим ингредиенты
      cy.contains('[data-testid="ingredient-item"]', 'Краторная булка N-200i')
        .find('button')
        .should('contain', 'Добавить')
        .click();

      cy.contains(
        '[data-testid="ingredient-item"]',
        'Биокотлета из марсианской Магнолии'
      )
        .find('button')
        .click();

      cy.contains('[data-testid="ingredient-item"]', 'Соус Spicy-X')
        .find('button')
        .click();
    });

    it('should create order successfully', () => {
      const bunPrice = 1255;
      const mainPrice = 424;
      const saucePrice = 90;
      const expectedTotal = bunPrice * 2 + mainPrice + saucePrice;

      cy.get('[data-testid="order-cost"]').should('contain', expectedTotal);
      cy.get('button').contains('Оформить заказ').click();

      cy.wait('@createOrder');

      cy.get('[data-testid="modal"]').should('be.visible');
      cy.get('[data-testid="order-number"]').should('contain', '12345');

      cy.get('[data-testid="modal-close"]').click();
      cy.get('[data-testid="modal"]').should('not.exist');

      cy.get('[data-testid="constructor-bun-top"]').should('not.exist');
      cy.get('[data-testid="constructor-bun-bottom"]').should('not.exist');
      cy.get('[data-testid="constructor-filling"]').should('not.exist');
    });
  });
});
