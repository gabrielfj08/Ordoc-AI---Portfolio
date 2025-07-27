import * as React from 'react';
import { UserSelectContainerProps } from './types';
import SelectUser from './Select';

const UserSelectContainer = ({
  name,
  directoryId,
}: UserSelectContainerProps) => {
  return <SelectUser name={name} directoryId={directoryId} />;
};

export default UserSelectContainer;
