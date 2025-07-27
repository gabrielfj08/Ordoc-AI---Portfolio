import * as React from 'react';
import { DesktopUserButtonContainerProps } from './types';
import DesktopUserButton from './DesktopUserButton';

const DesktopUserButtonContainer = ({
  user,
}: DesktopUserButtonContainerProps) => {
  return <DesktopUserButton user={user} />;
};

export default DesktopUserButtonContainer;
