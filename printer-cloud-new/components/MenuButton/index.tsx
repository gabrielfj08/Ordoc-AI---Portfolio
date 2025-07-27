import * as React from 'react';
import { MenuButtonContainerProps } from './types';
import MenuButton from './MenuButton';

const MenuButtonContainer = ({ options }: MenuButtonContainerProps) => {
  return <MenuButton options={options} />;
};

export default MenuButtonContainer;
