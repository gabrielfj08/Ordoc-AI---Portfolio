import { Paper } from 'printer-ui';
import * as React from 'react';
import { OptionButtonProps } from './types';

const OptionButton = ({ children, className }: OptionButtonProps) => {
  return (
    <div
      className={`${className} px-4 py-3 shadow-default rounded-lg flex items-center justify-center w-full h-full`}
    >
      {children}
    </div>
  );
};

export default OptionButton;
