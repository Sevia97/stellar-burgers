import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TFeed, TOrder } from '@utils-types';

export type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
  wsConnected: boolean;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: true,
  error: null,
  wsConnected: false
};

export const feedSlice = createSlice({
  name: 'feed',
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
    },
    wsGetOrders: (
      state,
      action: PayloadAction<{
        orders: TOrder[];
        total: number;
        totalToday: number;
      }>
    ) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.loading = false;
    }
  }
});

export const {
  wsConnectionStart,
  wsConnectionSuccess,
  wsConnectionError,
  wsConnectionClosed,
  wsGetOrders
} = feedSlice.actions;

export const feedReducer = feedSlice.reducer;
