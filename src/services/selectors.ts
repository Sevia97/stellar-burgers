import { createSelector } from 'reselect';
import { RootState } from './store';

// Селекторы первого уровня
const getCart = (state: RootState) => state.cart;
const getIngredientsState = (state: RootState) => state.ingredients.items;

// Мемоизированный селектор: constructorItems
export const getConstructorItems = createSelector([getCart], (cart) => ({
  bun: cart.bun,
  ingredients: cart.ingredients
}));

// Мемоизированный селектор: цена
export const getTotalPrice = createSelector(
  [getCart, getIngredientsState],
  (cart, ingredients) => {
    const bunPrice = cart.bun ? cart.bun.price * 2 : 0;
    const ingredientsPrice = cart.ingredients.reduce(
      (acc, item) => acc + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }
);

// Мемоизированный селектор: счётчики ингредиентов

export const getIngredientsCounters = createSelector([getCart], (cart) => {
  const counters: { [key: string]: number } = {};
  cart.ingredients.forEach((item) => {
    counters[item._id] = (counters[item._id] || 0) + 1;
  });
  if (cart.bun) {
    counters[cart.bun._id] = 2;
  }
  return counters;
});

// Селектор для ленты заказов
const feedSelector = (state: RootState) => state.feed;

export const getFeeds = createSelector([feedSelector], (feed) => ({
  orders: feed.orders,
  total: feed.total,
  totalToday: feed.totalToday,
  loading: feed.loading
}));
