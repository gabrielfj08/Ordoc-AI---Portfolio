import * as React from 'react';
import { MenuCellProps } from './types';
import MenuButton from '../../../../MenuButton/MenuButton';

const MenuCell = ({ options }: MenuCellProps) => {
  return (
    <div className="flex items-center space-x-8">
      <MenuButton options={options} />
    </div>
  );
};

export default MenuCell;
