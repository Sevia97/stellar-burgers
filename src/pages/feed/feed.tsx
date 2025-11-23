import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  wsConnectionStart,
  closeConnection
} from '../../services/feed/feedSlice';
import { getFeeds } from '../../services/selectors';
import { Preloader } from '../../components/ui/preloader';
import { OrdersList } from '../../components/orders-list/orders-list';
import { FeedInfo } from '../../components/feed-info/feed-info';
import styles from './feed.module.css';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(getFeeds);

  useEffect(() => {
    dispatch(wsConnectionStart('wss://norma.education-services.ru/orders/all'));

    return () => {
      dispatch(closeConnection());
    };
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(closeConnection());
    setTimeout(() => {
      dispatch(
        wsConnectionStart('wss://norma.education-services.ru/orders/all')
      );
    }, 100);
  };

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className='text text_type_main-default text_color_error mt-10'>
        Ошибка: {error}
        <button
          onClick={handleRefresh}
          className='ml-4 text text_type_main-default button'
        >
          Повторить попытку
        </button>
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className='text text_type_main-large'>Лента заказов</h1>
        <button
          onClick={handleRefresh}
          className='text text_type_main-default button'
        >
          Обновить
        </button>
      </div>

      <div className={styles.content}>
        {/* Левая колонка - лента заказов со скроллом */}
        <section className={styles.ordersSection}>
          <div className={styles.ordersContainer}>
            <OrdersList orders={orders} />
          </div>
        </section>

        {/* Правая колонка - статистика */}
        <section className={styles.infoSection}>
          <FeedInfo />
        </section>
      </div>
    </main>
  );
};

export default Feed;
