import * as React from 'react';
import { UsersMenuButtonCellProps } from './types';
import MenuButton from '../../../../../components/MenuButton';

const UsersMenuButtonCell = ({ options }: UsersMenuButtonCellProps) => {
  return (
    <div className="w-12 flex justify-center">
      <MenuButton options={options} />
    </div>
  );
};

export default UsersMenuButtonCell;
