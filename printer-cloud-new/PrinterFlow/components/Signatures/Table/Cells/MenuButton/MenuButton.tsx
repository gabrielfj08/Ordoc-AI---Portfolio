import * as React from 'react';
import MenuButton from '../../../../../../components/MenuButton';
import { MenuButtonCellProps } from '../../types';

const MenuButtonCell = ({ options }: MenuButtonCellProps) => {
  return (
    <div className="flex justify-center items-center space-x-8">
      <MenuButton options={options} />
    </div>
  );
};

export default MenuButtonCell;
