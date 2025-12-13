import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getOrderHistory } from '../../services/selectors';
import { fetchOrderHistory } from '../../services/orderHistory/orderHistorySlice';
import { Preloader } from '../../components/ui/preloader';
import { ProfileOrdersUI } from '../../components/ui/pages/profile-orders';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(getOrderHistory);
  const user = useSelector((store) => store.auth.user);

  useEffect(() => {
    if (user) {
      console.log('ProfileOrders: Fetching order history via HTTP API...');
      dispatch(fetchOrderHistory());
    }
  }, [dispatch, user]);

  if (loading && orders.length === 0) {
    return (
      <div className='pt-30 pl-10 pr-10'>
        <Preloader />
        <p className='text text_type_main-default text_color_inactive mt-4'>
          Загрузка вашей истории заказов...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text text_type_main-default text_color_error mt-10'>
        <h2 className='text text_type_main-medium mb-4'>
          Не удалось загрузить историю заказов
        </h2>
        <p>Ошибка: {error}</p>
        <button
          onClick={() => dispatch(fetchOrderHistory())}
          className='text text_type_main-default button mt-4'
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  console.log('ProfileOrders: User orders count:', orders.length);

  return <ProfileOrdersUI orders={orders} />;
};

export default ProfileOrders;
