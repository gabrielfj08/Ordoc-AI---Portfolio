import * as React from 'react';
import { MenuCellProps } from './types';
import MenuButton from '../../../../../components/MenuButton/MenuButton';

const MenuCell = ({ options }: MenuCellProps) => {
  return <MenuButton options={options} />;
};

export default MenuCell;
