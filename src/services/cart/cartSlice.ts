import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '../../utils/types';
import { v4 as uuidv4 } from 'uuid';

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
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const item = action.payload;
        if (item.type === 'bun') {
          state.bun = item;
        } else {
          state.ingredients.push(item);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      })
    },
    removeIngredient: (state, action: PayloadAction<number>) => {
      state.ingredients.splice(action.payload, 1);
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
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
