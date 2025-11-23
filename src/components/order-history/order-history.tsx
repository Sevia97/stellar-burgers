import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  wsConnectionStart,
  closeConnection
} from '../../services/orderHistory/orderHistorySlice';
import { getCookie } from '../../utils/cookie';
import { Preloader } from '../ui/preloader';
import { OrdersList } from '../orders-list/orders-list';

export const OrderHistory: FC = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orderHistory);
  const accessToken = getCookie('accessToken');

  useEffect(() => {
    if (accessToken) {
      const token = accessToken.replace('Bearer ', '');
      dispatch(
        wsConnectionStart(
          `wss://norma.education-services.ru/orders?token=${token}`
        )
      );
    }

    return () => {
      dispatch(closeConnection());
    };
  }, [dispatch, accessToken]);

  if (loading) {
    return <Preloader />;
  }

  return (
    <section className='pt-10'>
      <OrdersList orders={orders} />
    </section>
  );
};

export default OrderHistory;
