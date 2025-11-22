import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TOrderState = {
  currentOrder: TOrder | null;
  loading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  currentOrder: null,
  loading: false,
  error: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    clearOrder: (state) => {
      state.currentOrder = null;
    },
    setLoading: (state, action: { payload: boolean }) => {
      state.loading = action.payload;
    }
  }
});

export const { setOrder, clearOrder, setLoading } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
