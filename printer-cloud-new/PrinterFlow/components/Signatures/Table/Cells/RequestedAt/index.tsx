import * as React from 'react';
import { CellsContainerProps } from '../../types';
import RequestedAtCell from './RequestedAt';

const RequestedAtCellContainer = ({ signature }: CellsContainerProps) => {
  return <RequestedAtCell requestedAt={signature.createdAt} />;
};

export default RequestedAtCellContainer;
