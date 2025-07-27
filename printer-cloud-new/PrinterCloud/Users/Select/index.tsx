import * as React from 'react';
import { UserSelectContainerProps } from './types';
import SelectUser from './Select';

const UserSelectContainer = ({ name }: UserSelectContainerProps) => {
  return <SelectUser name={name} />;
};

export default UserSelectContainer;
