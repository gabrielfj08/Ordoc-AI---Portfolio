import * as React from 'react';
import { MobileUserButtonContainerProps } from './types';
import MobileUserButton from './MobileUserButton';

const MobileUserButtonContainer = ({
  user,
}: MobileUserButtonContainerProps) => {
  return <MobileUserButton user={user} />;
};

export default MobileUserButtonContainer;
