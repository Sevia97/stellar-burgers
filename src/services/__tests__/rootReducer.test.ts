import { rootReducer } from '../root-reducer';
import { store } from '../store';

describe('rootReducer', () => {
  it('should return initial state when called with undefined', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' } as any);
    
    // Проверяем, что все ключи стора присутствуют
    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('cart');
    expect(initialState).toHaveProperty('order');
    expect(initialState).toHaveProperty('auth');
    expect(initialState).toHaveProperty('feed');
    expect(initialState).toHaveProperty('orderHistory');
  });

  it('should handle unknown action without errors', () => {
    const state = rootReducer(undefined, { type: 'SOME_UNKNOWN_ACTION' } as any);
    expect(state).toBeDefined();
    expect(typeof state).toBe('object');
  });

  it('should have correct initial structure', () => {
    const initialState = store.getState();
    
    expect(initialState.ingredients).toBeDefined();
    expect(initialState.cart).toBeDefined();
    expect(initialState.order).toBeDefined();
    expect(initialState.auth).toBeDefined();
    expect(initialState.feed).toBeDefined();
    expect(initialState.orderHistory).toBeDefined();
  });
});