import * as React from 'react';
import { FlowUserButtonProps } from './types';
import DesktopUserButton from './DesktopUserButton';
import MobileUserButton from './MobileUserButton';

const FlowUserButton = ({ user }: FlowUserButtonProps) => {
  return (
    <>
      <div className="hidden sm:flex">
        <DesktopUserButton user={user} />
      </div>

      <div className="sm:hidden h-16">
        <MobileUserButton user={user} />
      </div>
    </>
  );
};

export default FlowUserButton;
