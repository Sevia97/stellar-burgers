import {
  cartReducer,
  initialState,
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetCart,
  clearCart
} from '../cartSlice';
import { TIngredient } from '@utils-types';

const mockBun: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const mockMain: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

const mockSauce: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
};

describe('cart reducer', () => {
  describe('initial state', () => {
    it('should return initial state', () => {
      expect(cartReducer(undefined, { type: '' })).toEqual(initialState);
    });

    it('should have correct structure', () => {
      expect(initialState.bun).toBeNull();
      expect(initialState.ingredients).toEqual([]);
    });
  });

  describe('addIngredient action', () => {
    it('should add bun to cart with generated id', () => {
      const action = addIngredient(mockBun);
      const state = cartReducer(initialState, action);

      expect(state.bun).not.toBeNull();
      expect(state.bun).toHaveProperty('_id', mockBun._id);
      expect(state.bun).toHaveProperty('name', mockBun.name);
      expect(state.bun).toHaveProperty('type', 'bun');
      expect(state.bun).toHaveProperty('id');
      expect(typeof state.bun!.id).toBe('string');
      expect(state.bun!.id).toMatch(/^[0-9a-f-]{36}$/); // UUID формата
      expect(state.ingredients).toHaveLength(0);
    });

    it('should add main ingredient to cart with generated id', () => {
      const action = addIngredient(mockMain);
      const state = cartReducer(initialState, action);

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);

      const addedIngredient = state.ingredients[0];
      expect(addedIngredient).toHaveProperty('_id', mockMain._id);
      expect(addedIngredient).toHaveProperty('name', mockMain.name);
      expect(addedIngredient).toHaveProperty('type', 'main');
      expect(addedIngredient).toHaveProperty('id');
      expect(typeof addedIngredient.id).toBe('string');
    });

    it('should add sauce ingredient to cart', () => {
      const action = addIngredient(mockSauce);
      const state = cartReducer(initialState, action);

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);

      const addedIngredient = state.ingredients[0];
      expect(addedIngredient).toHaveProperty('_id', mockSauce._id);
      expect(addedIngredient).toHaveProperty('type', 'sauce');
      expect(addedIngredient).toHaveProperty('id');
    });

    it('should replace bun when adding new bun', () => {
      // Добавляем первую булку
      let state = cartReducer(initialState, addIngredient(mockBun));
      const firstBunId = state.bun!.id;

      // Добавляем другую булку
      const newBun: TIngredient = {
        ...mockBun,
        _id: 'new-bun-id',
        name: 'Новая булка'
      };
      state = cartReducer(state, addIngredient(newBun));

      expect(state.bun).toHaveProperty('_id', 'new-bun-id');
      expect(state.bun).toHaveProperty('name', 'Новая булка');
      expect(state.bun!.id).not.toBe(firstBunId);
    });

    it('should maintain separate id for each added ingredient', () => {
      const state1 = cartReducer(initialState, addIngredient(mockMain));
      const state2 = cartReducer(initialState, addIngredient(mockMain));

      // Два одинаковых ингредиента должны иметь разные id
      expect(state1.ingredients[0].id).not.toBe(state2.ingredients[0].id);
    });

    it('should handle adding multiple fillings', () => {
      let state = cartReducer(initialState, addIngredient(mockMain));
      state = cartReducer(state, addIngredient(mockSauce));
      state = cartReducer(state, addIngredient({ ...mockMain, _id: 'main2' }));

      expect(state.ingredients).toHaveLength(3);
      expect(state.ingredients[0]._id).toBe(mockMain._id);
      expect(state.ingredients[1]._id).toBe(mockSauce._id);
      expect(state.ingredients[2]._id).toBe('main2');
    });
  });

  describe('removeIngredient action', () => {
    it('should remove ingredient by index', () => {
      // Добавляем несколько ингредиентов
      let state = cartReducer(initialState, addIngredient(mockMain));
      state = cartReducer(state, addIngredient(mockSauce));

      expect(state.ingredients).toHaveLength(2);

      // Удаляем первый ингредиент (индекс 0)
      const action = removeIngredient(0);
      state = cartReducer(state, action);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toHaveProperty('_id', mockSauce._id);
    });

    it('should not remove anything if index is out of bounds', () => {
      let state = cartReducer(initialState, addIngredient(mockMain));
      const originalLength = state.ingredients.length;

      const action = removeIngredient(5); // Несуществующий индекс
      state = cartReducer(state, action);

      expect(state.ingredients).toHaveLength(originalLength);
    });

    it('should handle removing from empty array', () => {
      const action = removeIngredient(0);
      const state = cartReducer(initialState, action);

      expect(state.ingredients).toEqual([]);
    });

    it('should remove correct ingredient when multiple exist', () => {
      // Добавляем три ингредиента
      let state = cartReducer(initialState, addIngredient(mockMain));
      const ingredient2: TIngredient = { ...mockSauce, _id: 'sauce2' };
      const ingredient3: TIngredient = { ...mockMain, _id: 'main2' };

      state = cartReducer(state, addIngredient(ingredient2));
      state = cartReducer(state, addIngredient(ingredient3));

      expect(state.ingredients).toHaveLength(3);

      // Удаляем средний ингредиент (индекс 1)
      const action = removeIngredient(1);
      state = cartReducer(state, action);

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0]).toHaveProperty('_id', mockMain._id);
      expect(state.ingredients[1]).toHaveProperty('_id', 'main2');
    });
  });

  describe('moveIngredient action', () => {
    it('should move ingredient from beginning to end', () => {
      // Добавляем три ингредиента
      let state = cartReducer(initialState, addIngredient(mockMain));
      const ingredient2: TIngredient = { ...mockSauce, _id: 'sauce2' };
      const ingredient3: TIngredient = { ...mockMain, _id: 'main2' };

      state = cartReducer(state, addIngredient(ingredient2));
      state = cartReducer(state, addIngredient(ingredient3));

      const originalIds = state.ingredients.map((i) => i._id);

      // Перемещаем первый (индекс 0) в конец (индекс 2)
      const action = moveIngredient({ dragIndex: 0, hoverIndex: 2 });
      state = cartReducer(state, action);

      const newIds = state.ingredients.map((i) => i._id);

      // Первый уходит в конец
      expect(newIds).toEqual([
        originalIds[1], // sauce2
        originalIds[2], // main2
        originalIds[0] // 643d...
      ]);
    });

    it('should handle move with same indices', () => {
      let state = cartReducer(initialState, addIngredient(mockMain));
      state = cartReducer(state, addIngredient(mockSauce));

      const originalIds = state.ingredients.map((i) => i._id);

      const action = moveIngredient({ dragIndex: 0, hoverIndex: 0 });
      state = cartReducer(state, action);

      const newIds = state.ingredients.map((i) => i._id);

      expect(newIds).toEqual(originalIds);
    });

    it('should move ingredient up in list', () => {
      let state = cartReducer(initialState, addIngredient(mockMain));
      const ingredient2: TIngredient = { ...mockSauce, _id: 'sauce2' };
      const ingredient3: TIngredient = { ...mockMain, _id: 'main2' };

      state = cartReducer(state, addIngredient(ingredient2));
      state = cartReducer(state, addIngredient(ingredient3));

      const originalIds = state.ingredients.map((i) => i._id);

      const action = moveIngredient({ dragIndex: 2, hoverIndex: 0 });
      state = cartReducer(state, action);

      const newIds = state.ingredients.map((i) => i._id);

      expect(newIds[0]).toBe(originalIds[2]); 
      expect(newIds[1]).toBe(originalIds[0]); 
      expect(newIds[2]).toBe(originalIds[1]); 
    });

    it('should preserve ingredient ids when moving', () => {
      let state = cartReducer(initialState, addIngredient(mockMain));
      state = cartReducer(state, addIngredient(mockSauce));

      const originalIds = state.ingredients.map((i) => i.id);

      const action = moveIngredient({ dragIndex: 0, hoverIndex: 1 });
      state = cartReducer(state, action);

      const newIds = state.ingredients.map((i) => i.id);

      // Id должны сохраниться, только порядок измениться
      expect(new Set(newIds)).toEqual(new Set(originalIds));
    });

    it('should handle moving with negative indices gracefully', () => {
      let state = cartReducer(initialState, addIngredient(mockMain));
      state = cartReducer(state, addIngredient(mockSauce));

      const action = moveIngredient({ dragIndex: -1, hoverIndex: 1 });
      state = cartReducer(state, action);

      // Не должно измениться при невалидном индексе
      expect(state.ingredients).toHaveLength(2);
    });
  });

  describe('resetCart action', () => {
    it('should reset cart to initial state', () => {
      // Добавляем ингредиенты
      let state = cartReducer(initialState, addIngredient(mockBun));
      state = cartReducer(state, addIngredient(mockMain));
      state = cartReducer(state, addIngredient(mockSauce));

      expect(state.bun).not.toBeNull();
      expect(state.ingredients).toHaveLength(2);

      // Сбрасываем корзину
      state = cartReducer(state, resetCart());

      expect(state).toEqual(initialState);
      expect(state.bun).toBeNull();
      expect(state.ingredients).toEqual([]);
    });

    it('should work on already empty cart', () => {
      const state = cartReducer(initialState, resetCart());
      expect(state).toEqual(initialState);
    });
  });

  describe('clearCart action', () => {
    it('should clear cart to initial state', () => {
      // Добавляем ингредиенты
      let state = cartReducer(initialState, addIngredient(mockBun));
      state = cartReducer(state, addIngredient(mockMain));
      state = cartReducer(state, addIngredient(mockSauce));

      expect(state.bun).not.toBeNull();
      expect(state.ingredients).toHaveLength(2);

      // Очищаем корзину
      state = cartReducer(state, clearCart());

      expect(state).toEqual(initialState);
      expect(state.bun).toBeNull();
      expect(state.ingredients).toEqual([]);
    });

    it('clearCart should be equivalent to resetCart', () => {
      const stateWithReset = cartReducer(initialState, resetCart());
      const stateWithClear = cartReducer(initialState, clearCart());

      expect(stateWithReset).toEqual(stateWithClear);
    });
  });

  describe('combined actions', () => {
    it('should handle complex sequence of actions', () => {
      let state = initialState;

      // Добавляем булку
      state = cartReducer(state, addIngredient(mockBun));
      expect(state.bun).not.toBeNull();

      // Добавляем начинки
      state = cartReducer(state, addIngredient(mockMain));
      state = cartReducer(state, addIngredient(mockSauce));
      expect(state.ingredients).toHaveLength(2);

      // Перемещаем
      state = cartReducer(
        state,
        moveIngredient({ dragIndex: 0, hoverIndex: 1 })
      );
      expect(state.ingredients[0]._id).toBe(mockSauce._id);
      expect(state.ingredients[1]._id).toBe(mockMain._id);

      // Удаляем
      state = cartReducer(state, removeIngredient(0));
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe(mockMain._id);

      // Очищаем
      state = cartReducer(state, clearCart());
      expect(state).toEqual(initialState);
    });
  });
});
