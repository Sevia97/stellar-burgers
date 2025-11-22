import { createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '../../utils/types';

export type TConstructorIngredient = TIngredient & {
  id: string;
};

export type TCartState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TCartState = {
  bun: null,
  ingredients: []
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addIngredient: (state, action) => {
      const item = action.payload;
      const id = Math.random().toString(36).substr(2, 9);

      if (item.type === 'bun') {
        state.bun = item;
      } else {
        state.ingredients.push({ ...item, id });
      }
    },
    removeIngredient: (state, action) => {
      state.ingredients.splice(action.payload, 1);
    },
    moveIngredient: (state, action) => {
      const { dragIndex, hoverIndex } = action.payload;
      const temp = state.ingredients[dragIndex];
      state.ingredients[dragIndex] = state.ingredients[hoverIndex];
      state.ingredients[hoverIndex] = temp;
    },
    resetCart: () => initialState
  }
});

export const { addIngredient, removeIngredient, moveIngredient, resetCart } =
  cartSlice.actions;
export const cartReducer = cartSlice.reducer;
