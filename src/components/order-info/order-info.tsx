import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const orderNumber = parseInt(number || '0');

  const feedOrders = useSelector((store) => store.feed.orders);
  const orderHistory = useSelector((store) => store.orderHistory.orders);
  const currentOrder = useSelector((store) => store.order.currentOrder);
  const ingredients = useSelector((store) => store.ingredients.items);

  const orderData = useMemo(() => {
    // Проверяем currentOrder по номеру
    if (currentOrder && currentOrder.number === orderNumber) {
      return currentOrder;
    }

    const feedOrder = feedOrders.find((order) => order.number === orderNumber);
    if (feedOrder) {
      return feedOrder;
    }

    const historyOrder = orderHistory.find(
      (order) => order.number === orderNumber
    );
    if (historyOrder) {
      return historyOrder;
    }

    return null;
  }, [currentOrder, feedOrders, orderHistory, orderNumber]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return (
      <div className='pt-30 pl-10 pr-10'>
        <Preloader />
        <p className='text text_type_main-default text_color_inactive mt-4'>
          Загрузка информации о заказе #{orderNumber}...
        </p>
      </div>
    );
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};

export default OrderInfo;
