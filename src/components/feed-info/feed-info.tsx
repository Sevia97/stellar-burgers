import { FC, useMemo } from 'react';
import { useSelector } from '../../services/store';
import { getFeeds } from '../../services/selectors';
import { FeedInfoUI } from '../ui/feed-info';

export const FeedInfo: FC = () => {
  const { orders, total, totalToday } = useSelector(getFeeds);

  const { readyOrders, pendingOrders } = useMemo(() => {
    const ready: number[] = [];
    const pending: number[] = [];

    orders.forEach((order) => {
      if (order.status === 'done') {
        ready.push(order.number);
      } else if (order.status === 'pending') {
        pending.push(order.number);
      }
    });

    return {
      readyOrders: ready.slice(0, 10),
      pendingOrders: pending.slice(0, 10)
    };
  }, [orders]);

  return (
    <FeedInfoUI
      feed={{ total, totalToday }}
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
    />
  );
};

export default FeedInfo;
