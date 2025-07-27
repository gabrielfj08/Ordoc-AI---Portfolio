import * as React from 'react';
import MenuButton from '../../../../../../components/MenuButton/MenuButton';
import { MenuCellProps } from './types';

const MenuCell = ({ options }: MenuCellProps) => {
  return (
    <div className="flex justify-center items-center sm:space-x-8">
      <MenuButton options={options} />
    </div>
  );
};

export default MenuCell;
