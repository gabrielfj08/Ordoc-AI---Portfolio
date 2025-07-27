import * as React from 'react';
import { FieldsMenuButtonProps } from './types';
import MenuButton from '../../../../../components/MenuButton';

const FieldsMenuButton = ({ options }: FieldsMenuButtonProps) => {
  return (
    <div className="w-12 flex justify-center">
      <MenuButton options={options} />
    </div>
  );
};

export default FieldsMenuButton;
