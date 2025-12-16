import {
  orderReducer,
  initialState,
  setOrder,
  clearOrder,
  setLoading,
  setError
} from '../orderSlice';
import { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: '1',
  ingredients: ['1', '2'],
  status: 'done',
  name: 'Test Order',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  number: 12345
};

describe('orderSlice', () => {
  describe('initial state', () => {
    it('should return initial state', () => {
      expect(orderReducer(undefined, { type: '' })).toEqual(initialState);
    });

    it('should have correct structure', () => {
      expect(initialState.currentOrder).toBeNull();
      expect(initialState.loading).toBe(false);
      expect(initialState.error).toBeNull();
    });
  });

  describe('setOrder reducer', () => {
    it('should set order', () => {
      const action = setOrder(mockOrder);
      const state = orderReducer(initialState, action);

      expect(state.currentOrder).toEqual(mockOrder);
    });

    it('should set order to null', () => {
      const stateWithOrder = { ...initialState, currentOrder: mockOrder };
      const action = setOrder(null);
      const state = orderReducer(stateWithOrder, action);

      expect(state.currentOrder).toBeNull();
    });
  });

  describe('clearOrder reducer', () => {
    it('should clear order', () => {
      const stateWithOrder = { ...initialState, currentOrder: mockOrder };
      const action = clearOrder();
      const state = orderReducer(stateWithOrder, action);

      expect(state.currentOrder).toBeNull();
    });
  });

  describe('setLoading reducer', () => {
    it('should set loading to true', () => {
      const action = setLoading(true);
      const state = orderReducer(initialState, action);

      expect(state.loading).toBe(true);
    });

    it('should set loading to false', () => {
      const stateWithLoading = { ...initialState, loading: true };
      const action = setLoading(false);
      const state = orderReducer(stateWithLoading, action);

      expect(state.loading).toBe(false);
    });
  });

  describe('setError reducer', () => {
    it('should set error message', () => {
      const action = setError('Ошибка создания заказа');
      const state = orderReducer(initialState, action);

      expect(state.error).toBe('Ошибка создания заказа');
    });

    it('should clear error', () => {
      const stateWithError = { ...initialState, error: 'Some error' };
      const action = setError(null);
      const state = orderReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });
  });
});
