import { 
  ingredientsReducer, 
  initialState, 
  fetchIngredients 
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
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
  },
  {
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
  }
];

describe('ingredients reducer', () => {
  describe('initial state', () => {
    it('should return initial state', () => {
      expect(ingredientsReducer(undefined, { type: '' })).toEqual(initialState);
    });

    it('should have correct structure', () => {
      expect(initialState.items).toEqual([]);
      expect(initialState.loading).toBe(false);
      expect(initialState.error).toBeNull();
    });
  });

  describe('fetchIngredients async thunk', () => {
    it('should handle pending action', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);
      
      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('should handle fulfilled action', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(initialState, action);
      
      expect(state).toEqual({
        items: mockIngredients,
        loading: false,
        error: null
      });
      
      expect(state.items).toHaveLength(2);
      expect(state.items[0].name).toBe('Краторная булка N-200i');
      expect(state.items[1].name).toBe('Биокотлета из марсианской Магнолии');
    });

    it('should handle rejected action', () => {
      const errorMessage = 'Failed to fetch ingredients';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const state = ingredientsReducer(initialState, action);
      
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: errorMessage
      });
    });

    it('should handle rejected action with payload', () => {
      const errorMessage = 'Network error';
      const action = {
        type: fetchIngredients.rejected.type,
        payload: errorMessage
      };
      const state = ingredientsReducer(initialState, action);
      
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: errorMessage
      });
    });
  });

  describe('state transitions', () => {
    it('should transition from loading to success correctly', () => {
      let state = ingredientsReducer(initialState, { type: fetchIngredients.pending.type });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      
      state = ingredientsReducer(state, {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      });
      
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.items).toEqual(mockIngredients);
    });

    it('should transition from loading to error correctly', () => {
      let state = ingredientsReducer(initialState, { type: fetchIngredients.pending.type });
      expect(state.loading).toBe(true);
      
      state = ingredientsReducer(state, {
        type: fetchIngredients.rejected.type,
        error: { message: 'Error' }
      });
      
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Error');
      expect(state.items).toEqual([]);
    });
  });
});