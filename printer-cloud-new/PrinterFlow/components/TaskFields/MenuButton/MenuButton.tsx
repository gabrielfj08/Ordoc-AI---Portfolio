import * as React from 'react';
import { TaskFieldsMenuButtonProps } from './types';
import MenuButton from '../../../../components/MenuButton';

const TaskFieldsMenuButton = ({ options }: TaskFieldsMenuButtonProps) => {
  return (
    <div className="w-12 flex justify-center">
      <MenuButton options={options} />
    </div>
  );
};

export default TaskFieldsMenuButton;
