import { forwardRef } from 'react';
import { TIngredientsCategoryProps } from './type';
import { IngredientsCategoryUI } from '../ui/ingredients-category';

export const IngredientsCategory = forwardRef<
  HTMLDivElement,
  TIngredientsCategoryProps
>(
  (
    { title, titleRef, ingredients, onAddIngredient, ingredientsCounters },
    ref
  ) => (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      onAddIngredient={onAddIngredient}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  )
);

IngredientsCategory.displayName = 'IngredientsCategory';
