import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './ingredients/ingredientsSlice';
import { cartReducer } from './cart/cartSlice';
import { orderReducer } from './order/orderSlice';
import { feedReducer } from './feed/feedSlice';
import { authReducer } from './auth/authSlice';
import { orderHistoryReducer } from './orderHistory/orderHistorySlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  cart: cartReducer,
  order: orderReducer,
  feed: feedReducer,
  auth: authReducer,
  orderHistory: orderHistoryReducer
});
