import { FC } from 'react';
import styles from './profile-orders.module.css';
import { ProfileOrdersUIProps } from './type';
import { ProfileMenu, OrdersList } from '@components';

export const ProfileOrdersUI: FC<ProfileOrdersUIProps> = ({ orders }) => (
  <main className={styles.container}>
    <div className={styles.sidebar}>
      <ProfileMenu />
    </div>

    <div className={styles.ordersSection}>
      <div className={styles.ordersContainer}>
        <OrdersList orders={orders} />
      </div>
    </div>
  </main>
);
