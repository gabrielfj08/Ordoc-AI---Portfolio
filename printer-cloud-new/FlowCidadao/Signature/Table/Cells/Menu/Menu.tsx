import * as React from 'react';
import { MenuSignatureCellProps } from './types';
import MenuButton from '../../../../components/MenuButton';

const MenuSignatureCell = ({ options }: MenuSignatureCellProps) => {
  return (
    <div className="w-12 flex items-end justify-end">
      <MenuButton options={options} />
    </div>
  );
};

export default MenuSignatureCell;
