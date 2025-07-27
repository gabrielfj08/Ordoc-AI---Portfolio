import * as React from 'react';
import StatusAssigneeDocumentCell from './Status';
import { CellsContainerProps } from '../../types';

const StatusAssigneeDocumentCellContainer = ({
  signature,
}: CellsContainerProps) => {
  return <StatusAssigneeDocumentCell signature={signature} />;
};
export default StatusAssigneeDocumentCellContainer;
