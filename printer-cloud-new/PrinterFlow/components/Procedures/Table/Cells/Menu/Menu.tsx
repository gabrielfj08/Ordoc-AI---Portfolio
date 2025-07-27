import * as React from 'react';
import MenuButton from '../../../../../../components/MenuButton';
import { MenuCellProps } from './types';

const MenuCell = ({ options }: MenuCellProps) => {
  return (
    <div className="flex justify-center items-center space-x-8">
      <MenuButton options={options}></MenuButton>
    </div>
  );
};

export default MenuCell;
