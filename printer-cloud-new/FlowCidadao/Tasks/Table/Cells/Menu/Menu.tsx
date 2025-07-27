import * as React from 'react';
import { MenuProcedureCellProps } from './types';
import MenuButton from '../../../../components/MenuButton';

const MenuTaskCell = ({ options }: MenuProcedureCellProps) => {
  return (
    <div className="w-12 flex items-end justify-end">
      <MenuButton options={options} />
    </div>
  );
};

export default MenuTaskCell;
