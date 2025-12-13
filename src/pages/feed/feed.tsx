import { FC, useEffect, useRef, useState } from 'react';
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
  const initialized = useRef(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Подключаемся только один раз при монтировании
    if (!initialized.current) {
      console.log('Feed: First mount, connecting WebSocket...');
      initialized.current = true;

      const wsUrl = 'wss://norma.education-services.ru/orders/all';
      dispatch(wsConnectionStart(wsUrl));
    }

    return () => {
      // Не закрываем соединение при обновлениях компонента
      console.log('Feed: Cleanup (not closing WebSocket)');
    };
  }, [dispatch]);

  const handleRefresh = () => {
    console.log('Feed: Manual refresh requested');
    setIsRefreshing(true);

    // Сначала закрываем соединение
    dispatch(closeConnection());

    // Даем время на корректное закрытие
    setTimeout(() => {
      const wsUrl = 'wss://norma.education-services.ru/orders/all';
      console.log('Feed: Starting new connection after refresh');
      dispatch(wsConnectionStart(wsUrl));
    }, 500);
  };

  // Сбрасываем флаг обновления когда данные загрузились
  useEffect(() => {
    if (isRefreshing && !loading && orders.length > 0) {
      setIsRefreshing(false);
    }
  }, [isRefreshing, loading, orders.length]);

  // Показываем полноэкранный прелоадер при загрузке или принудительном обновлении
  const showFullscreenLoader = (loading && orders.length === 0) || isRefreshing;

  if (showFullscreenLoader) {
    return (
      <div
        className='pt-30 pl-10 pr-10'
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Preloader />
        <p className='text text_type_main-default text_color_inactive mt-4'>
          {isRefreshing
            ? 'Обновление ленты заказов...'
            : 'Загрузка ленты заказов...'}
        </p>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div
        className='text text_type_main-default text_color_error mt-10'
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <h2 className='text text_type_main-medium mb-4'>
          Не удалось загрузить ленту заказов
        </h2>
        <p>Ошибка: {error}</p>
        <button
          onClick={handleRefresh}
          className='ml-4 text text_type_main-default button mt-4'
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
          disabled={isRefreshing}
        >
          {isRefreshing ? 'Обновление...' : 'Обновить'}
        </button>
      </div>

      <div className={styles.content}>
        <section className={styles.ordersSection}>
          <div className={styles.ordersContainer}>
            <OrdersList orders={orders} />
          </div>
        </section>

        <section className={styles.infoSection}>
          <FeedInfo />
        </section>
      </div>
    </main>
  );
};

export default Feed;
