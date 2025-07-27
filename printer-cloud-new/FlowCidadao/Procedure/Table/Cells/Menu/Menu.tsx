import * as React from 'react';
import { MenuProcedureCellProps } from './types';
import MenuButton from '../../../../components/MenuButton';

const MenuProcedureCell = ({ options }: MenuProcedureCellProps) => {
  return (
    <div className="sm:w-12 flex items-end justify-end">
      <MenuButton options={options} />
    </div>
  );
};

export default MenuProcedureCell;
