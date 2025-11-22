import { FC } from 'react';
import { useSelector } from '../../services/store';
import { TIngredient } from '@utils-types';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { items } = useSelector((store) => store.ingredients);
  const ingredientData = items.find((item) => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};

export default IngredientDetails;
