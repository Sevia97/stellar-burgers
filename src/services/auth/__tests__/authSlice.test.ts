import {
  authReducer,
  initialState,
  loginUser,
  registerUser,
  getUser,
  updateUser,
  logoutUser,
  checkUserAuth,
  setUser,
  setAuthChecked
} from '../authSlice';
import { TUser } from '@utils-types';

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User',
};

describe('authSlice', () => {
  describe('initial state', () => {
    it('should return initial state', () => {
      expect(authReducer(undefined, { type: '' })).toEqual(initialState);
    });

    it('should have correct structure', () => {
      expect(initialState.user).toBeNull();
      expect(initialState.isAuthChecked).toBe(false);
      expect(initialState.isLoading).toBe(false);
      expect(initialState.error).toBeNull();
    });
  });

  describe('setUser reducer', () => {
    it('should set user', () => {
      const action = setUser(mockUser);
      const state = authReducer(initialState, action);

      expect(state.user).toEqual(mockUser);
    });

    it('should set user to null', () => {
      const stateWithUser = { ...initialState, user: mockUser };
      const action = setUser(null);
      const state = authReducer(stateWithUser, action);

      expect(state.user).toBeNull();
    });
  });

  describe('setAuthChecked reducer', () => {
    it('should set isAuthChecked to true', () => {
      const action = setAuthChecked(true);
      const state = authReducer(initialState, action);

      expect(state.isAuthChecked).toBe(true);
    });

    it('should set isAuthChecked to false', () => {
      const stateWithTrue = { ...initialState, isAuthChecked: true };
      const action = setAuthChecked(false);
      const state = authReducer(stateWithTrue, action);

      expect(state.isAuthChecked).toBe(false);
    });
  });

  describe('loginUser async thunk', () => {
    it('should handle pending', () => {
      const action = { type: loginUser.pending.type };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockUser
      };
      const state = authReducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle rejected', () => {
      const error = 'Неверный логин или пароль';
      const action = {
        type: loginUser.rejected.type,
        error: { message: error }
      };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(error);
      expect(state.user).toBeNull();
    });
  });

  describe('registerUser async thunk', () => {
    it('should handle pending', () => {
      const action = { type: registerUser.pending.type };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('should handle fulfilled', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockUser
      };
      const state = authReducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.isLoading).toBe(false);
    });

    it('should handle rejected', () => {
      const error = 'Пользователь с таким email уже существует';
      const action = {
        type: registerUser.rejected.type,
        error: { message: error }
      };
      const state = authReducer(initialState, action);

      expect(state.error).toBe(error);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('getUser async thunk', () => {
    it('should set user on fulfilled', () => {
      const action = {
        type: getUser.fulfilled.type,
        payload: mockUser
      };
      const state = authReducer(initialState, action);

      expect(state.user).toEqual(mockUser);
    });

    it('should set user to null on rejected', () => {
      const stateWithUser = { ...initialState, user: mockUser };
      const action = { type: getUser.rejected.type };
      const state = authReducer(stateWithUser, action);

      expect(state.user).toBeNull();
    });
  });

  describe('updateUser async thunk', () => {
    it('should update user on fulfilled', () => {
      const updatedUser: TUser = { ...mockUser, name: 'New Name' };
      const action = {
        type: updateUser.fulfilled.type,
        payload: updatedUser
      };
      const state = authReducer(initialState, action);

      expect(state.user).toEqual(updatedUser);
    });

    it('should set error on rejected', () => {
      const error = 'Ошибка обновления';
      const action = {
        type: updateUser.rejected.type,
        error: { message: error }
      };
      const state = authReducer(initialState, action);

      expect(state.error).toBe(error);
    });
  });

  describe('logoutUser async thunk', () => {
    it('should clear user on fulfilled', () => {
      const stateWithUser = { ...initialState, user: mockUser };
      const action = { type: logoutUser.fulfilled.type };
      const state = authReducer(stateWithUser, action);

      expect(state.user).toBeNull();
    });
  });

  describe('checkUserAuth async thunk', () => {
    it('should set isAuthChecked to true on fulfilled', () => {
      const action = { type: checkUserAuth.fulfilled.type };
      const state = authReducer(initialState, action);

      expect(state.isAuthChecked).toBe(true);
    });
  });
});
