import * as React from 'react';
import { TaskTemplateMenuCellProps } from './types';
import MenuButton from '../../../../../../components/MenuButton/MenuButton';

const TaskTemplateMenuCell = ({ options }: TaskTemplateMenuCellProps) => {
  return (
    <div className="flex justify-center items-center sm:space-x-8">
      <MenuButton options={options} />
    </div>
  );
};

export default TaskTemplateMenuCell;
