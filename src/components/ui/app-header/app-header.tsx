import React, { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();

  const isConstructorActive = location.pathname === '/';
  const isFeedActive = location.pathname.startsWith('/feed');
  const isProfileActive = location.pathname.startsWith('/profile');

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          {/* Конструктор */}
          <Link to='/' className={`${styles.link} pl-5 pr-5 pt-4 pb-4`}>
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default ml-2 mr-10 ${isConstructorActive ? styles.link_active : ''}`}
            >
              Конструктор
            </p>
          </Link>

          {/* Лента заказов */}
          <Link to='/feed' className={`${styles.link} pl-5 pr-5 pt-4 pb-4`}>
            <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default ml-2 ${isFeedActive ? styles.link_active : ''}`}
            >
              Лента заказов
            </p>
          </Link>
        </div>

        {/* Логотип */}
        <div className={styles.logo}>
          <Link to='/'>
            <Logo className='' />
          </Link>
        </div>

        {/* Личный кабинет */}
        <div className={styles.link_position_last}>
          <Link to='/profile' className={`${styles.link} pl-5 pr-5 pt-4 pb-4`}>
            <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default ml-2 ${isProfileActive ? styles.link_active : ''}`}
            >
              {userName || 'Личный кабинет'}
            </p>
          </Link>
        </div>
      </nav>
    </header>
  );
};
