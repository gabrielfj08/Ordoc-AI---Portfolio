import * as React from 'react';
import MenuButton from './MenuButton';
import { MenuButtonContainerProps } from './types';

const MenuButtonContainer = ({ options }: MenuButtonContainerProps) => {
  return <MenuButton options={options} />;
};

export default MenuButtonContainer;
