import * as React from 'react';
import { LayoutHeaderProps } from './types';

// eslint-disable-next-line react/display-name
const Header = ({ children, className }: LayoutHeaderProps) => {
  const headerClassName = `${className}  flex sm:border-b sm:border-lightGray h-fit w-full sm:h-28 items-center`;
  return <header className={headerClassName}>{children}</header>;
};

export default Header;
