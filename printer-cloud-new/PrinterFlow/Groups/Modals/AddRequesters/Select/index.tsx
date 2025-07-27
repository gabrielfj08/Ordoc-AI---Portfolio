import * as React from 'react';
import { AddRequestersSelectContainerProps } from './types';
import AddRequestersSelectSelect from './Select';

const AddRequestersSelectContainer = ({
  name,
  groupId,
}: AddRequestersSelectContainerProps) => {
  return <AddRequestersSelectSelect name={name} groupId={groupId} />;
};

export default AddRequestersSelectContainer;
