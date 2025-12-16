import {
  orderHistoryReducer,
  initialState,
  fetchOrderHistory,
  wsConnectionStart,
  wsConnectionSuccess,
  wsConnectionError,
  wsConnectionClosed,
  wsGetOrders,
  closeConnection,
  clearError
} from '../orderHistorySlice';
import { TOrder } from '@utils-types';

const mockOrders: TOrder[] = [
  {
    _id: '1',
    ingredients: ['1', '2'],
    status: 'done',
    name: 'Order 1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    number: 12345
  },
  {
    _id: '2',
    ingredients: ['3'],
    status: 'pending',
    name: 'Order 2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    number: 12346
  }
];

describe('orderHistorySlice', () => {
  describe('initial state', () => {
    it('should return initial state', () => {
      expect(orderHistoryReducer(undefined, { type: '' })).toEqual(
        initialState
      );
    });

    it('should have correct structure', () => {
      expect(initialState.orders).toEqual([]);
      expect(initialState.loading).toBe(true);
      expect(initialState.error).toBeNull();
      expect(initialState.wsConnected).toBe(false);
    });
  });

  describe('fetchOrderHistory async thunk', () => {
    it('should handle pending', () => {
      const action = { type: fetchOrderHistory.pending.type };
      const state = orderHistoryReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled', () => {
      const action = {
        type: fetchOrderHistory.fulfilled.type,
        payload: { orders: mockOrders }
      };
      const state = orderHistoryReducer(initialState, action);

      expect(state.orders).toEqual([...mockOrders].reverse());
      expect(state.loading).toBe(false);
    });

    it('should handle rejected', () => {
      const error = 'Ошибка загрузки истории';
      const action = {
        type: fetchOrderHistory.rejected.type,
        payload: error
      };
      const state = orderHistoryReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(error);
    });
  });

  describe('wsConnectionStart', () => {
    it('should set loading to true and clear error', () => {
      const action = wsConnectionStart('ws://test-url');
      const state = orderHistoryReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('wsConnectionSuccess', () => {
    it('should set wsConnected to true', () => {
      const stateWithLoading = { ...initialState, loading: true };
      const action = wsConnectionSuccess();
      const state = orderHistoryReducer(stateWithLoading, action);

      expect(state.wsConnected).toBe(true);
      expect(state.loading).toBe(false);
    });
  });

  describe('wsConnectionError', () => {
    it('should set error and disconnect', () => {
      const error = 'Connection failed';
      const action = wsConnectionError(error);
      const state = orderHistoryReducer(initialState, action);

      expect(state.wsConnected).toBe(false);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(error);
    });
  });

  describe('wsConnectionClosed', () => {
    it('should reset connection state', () => {
      const connectedState = {
        ...initialState,
        wsConnected: true,
        loading: true,
        error: 'Some error'
      };
      const action = wsConnectionClosed();
      const state = orderHistoryReducer(connectedState, action);

      expect(state.wsConnected).toBe(false);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('wsGetOrders', () => {
    it('should set orders and reverse them', () => {
      const action = wsGetOrders({ orders: mockOrders });
      const state = orderHistoryReducer(initialState, action);

      expect(state.orders).toEqual([...mockOrders].reverse());
      expect(state.loading).toBe(false);
    });
  });

  describe('closeConnection', () => {
    it('should set wsConnected to false', () => {
      const connectedState = { ...initialState, wsConnected: true };
      const action = closeConnection();
      const state = orderHistoryReducer(connectedState, action);

      expect(state.wsConnected).toBe(false);
    });
  });

  describe('clearError', () => {
    it('should clear error', () => {
      const stateWithError = { ...initialState, error: 'Some error' };
      const action = clearError();
      const state = orderHistoryReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });
  });
});
console