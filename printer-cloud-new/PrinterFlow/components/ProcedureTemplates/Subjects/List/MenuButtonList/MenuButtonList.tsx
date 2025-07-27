import * as React from 'react';
import { MenuButtonListProps } from './types';
import MenuButton from '../../../../../../components/MenuButton/MenuButton';

const MenuButtonList = ({ options }: MenuButtonListProps) => {
  return (
    <div className="flex justify-center items-center sm:space-x-8">
      <MenuButton options={options} />
    </div>
  );
};

export default MenuButtonList;
