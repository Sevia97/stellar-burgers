import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getFeeds } from '../../services/selectors';
import {
  wsConnectionStart,
  wsConnectionClosed
} from '../../services/feed/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector(getFeeds);

  useEffect(() => {
    dispatch(wsConnectionStart('wss://norma.nomoreparties.space/orders/all'));

    return () => {
      dispatch(wsConnectionClosed());
    };
  }, [dispatch]);

  if (loading || !orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(wsConnectionClosed());
        dispatch(
          wsConnectionStart('wss://norma.nomoreparties.space/orders/all')
        );
      }}
    />
  );
};

export default Feed;
