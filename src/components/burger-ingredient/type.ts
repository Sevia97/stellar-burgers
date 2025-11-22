import { Location } from 'react-router-dom';
import { TIngredient } from '@utils-types';

export type TBurgerIngredientProps = {
  ingredient: TIngredient;
  count: number;
  onAdd: (ingredient: TIngredient) => void;
};

export type TBurgerIngredientUIProps = {
  ingredient: TIngredient;
  count: number;
  locationState: { background: Location };
  handleAdd: () => void;
};