import * as React from 'react';
import { PolicyMenuCellProps } from './types';
import MenuButton from '../../../../../components/MenuButton';

const PolicyMenuCell = ({ options }: PolicyMenuCellProps) => {
  return (
    <div className="w-12 flex justify-center">
      <MenuButton options={options} />
    </div>
  );
};

export default PolicyMenuCell;
