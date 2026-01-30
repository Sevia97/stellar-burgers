import {
  feedReducer,
  initialState,
  wsConnectionStart,
  wsConnectionSuccess,
  wsConnectionError,
  wsConnectionClosed,
  wsGetOrders,
  closeConnection
} from '../feedSlice';
import { TOrder } from '@utils-types';

const mockOrders: TOrder[] = [
  {
    _id: '1',
    ingredients: ['ing1', 'ing2'],
    status: 'done',
    name: 'Space флюоресцентный бургер',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    number: 12345
  },
  {
    _id: '2',
    ingredients: ['ing3'],
    status: 'pending',
    name: 'Spicy люминесцентный бургер',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    number: 12346
  }
];

describe('feed reducer', () => {
  it('should return initial state', () => {
    expect(feedReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('wsConnectionStart', () => {
    it('should set loading to true and clear error', () => {
      const stateWithError = { ...initialState, error: 'Some error' };
      const action = wsConnectionStart('ws://test-url');
      const state = feedReducer(stateWithError, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('wsConnectionSuccess', () => {
    it('should set wsConnected to true and loading to false', () => {
      const loadingState = { ...initialState, loading: true };
      const action = wsConnectionSuccess();
      const state = feedReducer(loadingState, action);

      expect(state.wsConnected).toBe(true);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('wsConnectionError', () => {
    it('should set error and reset connection state', () => {
      const connectedState = {
        ...initialState,
        wsConnected: true,
        loading: true
      };
      const errorMessage = 'Connection failed';
      const action = wsConnectionError(errorMessage);
      const state = feedReducer(connectedState, action);

      expect(state.wsConnected).toBe(false);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
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
      const state = feedReducer(connectedState, action);

      expect(state.wsConnected).toBe(false);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('wsGetOrders', () => {
    it('should set orders, totals and loading to false', () => {
      const loadingState = { ...initialState, loading: true };
      const action = wsGetOrders({
        orders: mockOrders,
        total: 100,
        totalToday: 10
      });
      const state = feedReducer(loadingState, action);

      expect(state.orders).toEqual(mockOrders);
      expect(state.total).toBe(100);
      expect(state.totalToday).toBe(10);
      expect(state.loading).toBe(false);
    });
  });

  describe('closeConnection', () => {
    it('should set wsConnected to false', () => {
      const connectedState = { ...initialState, wsConnected: true };
      const action = closeConnection();
      const state = feedReducer(connectedState, action);

      expect(state.wsConnected).toBe(false);
    });
  });
});
