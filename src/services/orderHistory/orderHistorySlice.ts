import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrderHistoryApi } from '../../utils/burger-api'; // Нужно создать этот метод в burger-api.ts

export type TOrderHistoryState = {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
  wsConnected: boolean;
};

export const initialState: TOrderHistoryState = {
  orders: [],
  loading: true,
  error: null,
  wsConnected: false
};

// Асинхронный action для загрузки истории заказов через HTTP API
export const fetchOrderHistory = createAsyncThunk(
  'orderHistory/fetchOrderHistory',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getOrderHistoryApi();
      return { orders };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Ошибка загрузки истории заказов'
      );
    }
  }
);

export const orderHistorySlice = createSlice({
  name: 'orderHistory',
  initialState,
  reducers: {
    wsConnectionStart: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    wsConnectionSuccess: (state) => {
      state.wsConnected = true;
      state.loading = false;
      state.error = null;
    },
    wsConnectionError: (state, action: PayloadAction<string>) => {
      state.wsConnected = false;
      state.loading = false;
      state.error = action.payload;
    },
    wsConnectionClosed: (state) => {
      state.wsConnected = false;
      state.loading = false;
      state.error = null;
    },
    wsGetOrders: (state, action: PayloadAction<{ orders: TOrder[] }>) => {
      state.orders = [...action.payload.orders].reverse();
      state.loading = false;
      state.error = null;
    },

    closeConnection: (state) => {
      state.wsConnected = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.orders = [...action.payload.orders].reverse();
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  wsConnectionStart,
  wsConnectionSuccess,
  wsConnectionError,
  wsConnectionClosed,
  wsGetOrders,
  closeConnection,
  clearError
} = orderHistorySlice.actions;
export const orderHistoryReducer = orderHistorySlice.reducer;
