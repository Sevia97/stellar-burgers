import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSelector, useDispatch } from '../../services/store';
import { TTabMode, TIngredient } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { addIngredient } from '../../services/cart/cartSlice';
import { getIngredientsCounters } from '../../services/selectors';

export const BurgerIngredients: FC = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((store) => store.ingredients);
  const ingredientsCounters = useSelector(getIngredientsCounters);

  // Фильтруем
  const buns = items.filter((item) => item.type === 'bun');
  const mains = items.filter((item) => item.type === 'main');
  const sauces = items.filter((item) => item.type === 'sauce');

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });
  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });
  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Функция для добавления ингредиента
  const handleAddIngredient = (ingredient: TIngredient) => {
    console.log('Adding ingredient:', ingredient.name);
    dispatch(addIngredient(ingredient));
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
      onAddIngredient={handleAddIngredient}
      ingredientsCounters={ingredientsCounters}
    />
  );
};

export default BurgerIngredients;
