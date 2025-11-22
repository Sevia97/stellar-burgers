import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export type TOrderHistoryState = {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
  wsConnected: boolean;
};

const initialState: TOrderHistoryState = {
  orders: [],
  loading: true,
  error: null,
  wsConnected: false
};

export const orderHistorySlice = createSlice({
  name: 'orderHistory',
  initialState,
  reducers: {
    wsConnectionStart: (state, action: PayloadAction<string>) => {
      state.wsConnected = true;
      state.error = null;
    },
    wsConnectionSuccess: (state) => {
      state.wsConnected = true;
      state.error = null;
    },
    wsConnectionError: (state, action: PayloadAction<string>) => {
      state.wsConnected = false;
      state.error = action.payload;
      state.loading = false;
    },
    wsConnectionClosed: (state) => {
      state.wsConnected = false;
      state.error = null;
    },
    wsGetOrders: (state, action: PayloadAction<TOrder[]>) => {
      state.orders = action.payload;
      state.loading = false;
    },
    setOrderHistory: (state, action: PayloadAction<TOrder[]>) => {
      state.orders = action.payload;
      state.loading = false;
    },
    setOrderHistoryError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setOrderHistoryLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  }
});

export const {
  setOrderHistory,
  setOrderHistoryError,
  setOrderHistoryLoading,
  wsConnectionStart,
  wsConnectionSuccess,
  wsConnectionError,
  wsConnectionClosed,
  wsGetOrders
} = orderHistorySlice.actions;
export const orderHistoryReducer = orderHistorySlice.reducer;
