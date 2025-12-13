import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { rootReducer } from './root-reducer';
import { socketMiddleware } from './middleware/socketMiddleware';
import {
  wsConnectionStart,
  wsConnectionSuccess,
  wsConnectionError,
  wsConnectionClosed,
  wsGetOrders
} from './feed/feedSlice';
import {
  wsConnectionStart as orderHistoryWsStart,
  wsConnectionSuccess as orderHistoryWsSuccess,
  wsConnectionError as orderHistoryWsError,
  wsConnectionClosed as orderHistoryWsClosed,
  wsGetOrders as orderHistoryWsGetOrders
} from './orderHistory/orderHistorySlice';

const feedMiddleware = socketMiddleware({
  wsInit: wsConnectionStart.type,
  onOpen: wsConnectionSuccess.type,
  onClose: wsConnectionClosed.type,
  onError: wsConnectionError.type,
  onMessage: wsGetOrders.type
});

const orderHistoryMiddleware = socketMiddleware({
  wsInit: orderHistoryWsStart.type,
  onOpen: orderHistoryWsSuccess.type,
  onClose: orderHistoryWsClosed.type,
  onError: orderHistoryWsError.type,
  onMessage: orderHistoryWsGetOrders.type
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(feedMiddleware)
      .concat(orderHistoryMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
