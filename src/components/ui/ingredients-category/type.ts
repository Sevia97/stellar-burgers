import { RefObject } from 'react';
import { TIngredient } from '@utils-types';

export type TIngredientsCategoryUIProps = {
  title: string;
  titleRef: RefObject<HTMLHeadingElement>;
  ingredients: TIngredient[];
  ingredientsCounters: { [key: string]: number };
  onAddIngredient: (ingredient: TIngredient) => void;
};