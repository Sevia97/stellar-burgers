import { FC, memo, forwardRef } from 'react';
import { BurgerIngredient } from '@components';
import { TIngredient } from '@utils-types';
import styles from './ingredients-category.module.css';

interface IngredientsCategoryProps {
  title: string;
  titleRef: React.RefObject<HTMLHeadingElement>;
  ingredients: TIngredient[];
  onAddIngredient: (ingredient: TIngredient) => void;
  ingredientsCounters: { [key: string]: number }; // ✅
}

export const IngredientsCategoryUI = memo(
  forwardRef<HTMLDivElement, IngredientsCategoryProps>(
    (
      { title, titleRef, ingredients, onAddIngredient, ingredientsCounters },
      ref
    ) => (
      <div ref={ref} className={styles.category}>
        <h2 className={styles.title} ref={titleRef}>
          {title}
        </h2>
        <div className={styles.ingredients_grid}>
          {ingredients.map((ingredient) => (
            <BurgerIngredient
              key={ingredient._id}
              ingredient={ingredient}
              count={ingredientsCounters[ingredient._id] || 0}
              onAdd={onAddIngredient}
            />
          ))}
        </div>
      </div>
    )
  )
);

IngredientsCategoryUI.displayName = 'IngredientsCategoryUI';
