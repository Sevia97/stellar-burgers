import { FC } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getConstructorItems, getTotalPrice } from '../../services/selectors';
import { useNavigate } from 'react-router-dom';

import { BurgerConstructorUI } from '../ui/burger-constructor';
import { setOrder, setLoading } from '../../services/order/orderSlice';
import {
  removeIngredient,
  moveIngredient,
  resetCart
} from '../../services/cart/cartSlice';
import { orderBurgerApi } from '../../utils/burger-api';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector(getConstructorItems);
  const price = useSelector(getTotalPrice);
  const orderRequest = useSelector((store) => store.order.loading);
  const orderModalData = useSelector((store) => store.order.currentOrder);
  const isAuthenticated = useSelector((store) => !!store.auth.user);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    // Проверка авторизации
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    dispatch(setLoading(true));

    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id)
    ];

    orderBurgerApi(ingredientsIds)
      .then((response) => {
        dispatch(setOrder(response.order));
        // Очищаем конструктор только при успешном ответе сервера
        dispatch(resetCart());
      })
      .catch((err) => {
        console.error('Ошибка:', err);
        alert('Не удалось оформить заказ');
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  const handleRemoveIngredient = (index: number) => {
    dispatch(removeIngredient(index));
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      dispatch(moveIngredient({ dragIndex: index, hoverIndex: index - 1 }));
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < constructorItems.ingredients.length - 1) {
      dispatch(moveIngredient({ dragIndex: index, hoverIndex: index + 1 }));
    }
  };

  const closeOrderModal = () => {
    dispatch(setOrder(null));
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      onRemoveIngredient={handleRemoveIngredient}
      onMoveUp={handleMoveUp}
      onMoveDown={handleMoveDown}
    />
  );
};

export default BurgerConstructor;
