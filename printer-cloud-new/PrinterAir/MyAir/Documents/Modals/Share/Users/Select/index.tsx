import * as React from 'react';
import { UserSelectContainerProps } from './types';
import SelectUser from './Select';

const UserSelectContainer = ({
  name,
  documentId,
}: UserSelectContainerProps) => {
  return <SelectUser name={name} documentId={documentId} />;
};

export default UserSelectContainer;
