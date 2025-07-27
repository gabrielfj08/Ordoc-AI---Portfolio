import * as React from 'react';
import { GroupsMenuButtonCellProps } from './types';
import MenuButton from '../../../../../../components/MenuButton';

const GroupsMenuButtonCell = ({ options }: GroupsMenuButtonCellProps) => {
  return (
    <div className="w-12 flex justify-center">
      <MenuButton options={options} />
    </div>
  );
};

export default GroupsMenuButtonCell;
