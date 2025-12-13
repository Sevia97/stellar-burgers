import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { fetchIngredients } from '../../services/ingredients/ingredientsSlice';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((store) => store.ingredients);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  // Добавьте отладочный вывод
  console.log('ConstructorPage - ingredients state:', {
    itemsCount: items?.length,
    loading,
    error
  });

  if (loading) {
    return <Preloader />;
  }

  // Добавьте обработку ошибок
  if (error) {
    return (
      <main className={styles.containerMain}>
        <h1
          className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
        >
          Соберите бургер
        </h1>
        <div className={`${styles.main} pl-5 pr-5`}>
          <div className='text text_type_main-default text_color_error'>
            Ошибка загрузки ингредиентов: {error}
            <button
              onClick={() => dispatch(fetchIngredients())}
              className='ml-4 text text_type_main-default'
            >
              Повторить
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Проверьте что items - массив и не пустой
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <main className={styles.containerMain}>
        <h1
          className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
        >
          Соберите бургер
        </h1>
        <div className={`${styles.main} pl-5 pr-5`}>
          <div className='text text_type_main-default text_color_inactive'>
            Ингредиенты не найдены
            <button
              onClick={() => dispatch(fetchIngredients())}
              className='ml-4 text text_type_main-default'
            >
              Обновить
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};

export default ConstructorPage;
