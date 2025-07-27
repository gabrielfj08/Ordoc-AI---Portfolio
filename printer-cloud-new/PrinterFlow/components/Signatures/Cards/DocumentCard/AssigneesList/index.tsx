import * as React from 'react';
import { AssigneesListContainerProps } from './types';
import AssigneesList from './AssigneesList';

const AssigneesListContainer = ({ signature }: AssigneesListContainerProps) => {
  return <AssigneesList signature={signature} />;
};

export default AssigneesListContainer;
