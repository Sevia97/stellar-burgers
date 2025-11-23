import React, { FC, memo } from 'react';
import styles from './feed-info.module.css';
import { FeedInfoUIProps, HalfColumnProps, TColumnProps } from './type';

export const FeedInfoUI: FC<FeedInfoUIProps> = memo(
  ({ feed, readyOrders, pendingOrders }) => {
    const { total, totalToday } = feed;

    return (
      <div className={styles.container}>
        {/* Статистика готовности заказов */}
        <div className={styles.ready_stats}>
          <div className={styles.columns}>
            <HalfColumn
              orders={readyOrders}
              title={'Готовы'}
              textColor={'blue'}
            />
            <HalfColumn orders={pendingOrders} title={'В работе'} />
          </div>
        </div>

        {/* Общая статистика */}
        <div className={styles.general_stats}>
          <Column title={'Выполнено за все время'} content={total} />
          <Column title={'Выполнено за сегодня'} content={totalToday} />
        </div>
      </div>
    );
  }
);

const HalfColumn: FC<HalfColumnProps> = ({ orders, title, textColor }) => (
  <div className={styles.column}>
    <h3 className={`text text_type_main-medium ${styles.title}`}>{title}:</h3>
    <ul className={styles.list}>
      {orders.map((item, index) => (
        <li
          className={`text text_type_digits-default ${styles.list_item}`}
          style={{ color: textColor === 'blue' ? '#00cccc' : '#F2F2F3' }}
          key={index}
        >
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const Column: FC<TColumnProps> = ({ title, content }) => (
  <div className={styles.column_full}>
    <h3 className={`text text_type_main-medium ${styles.title}`}>{title}:</h3>
    <p className={`text text_type_digits-large ${styles.content}`}>{content}</p>
  </div>
);
