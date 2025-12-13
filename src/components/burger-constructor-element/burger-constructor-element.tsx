import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems, onRemove, onMoveUp, onMoveDown }) => {
    const handleMoveDown = () => {
      console.log('Move down:', index);
      onMoveDown();
    };

    const handleMoveUp = () => {
      console.log('Move up:', index);
      onMoveUp();
    };

    const handleClose = () => {
      console.log('Close ingredient:', ingredient.name);
      onRemove();
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
