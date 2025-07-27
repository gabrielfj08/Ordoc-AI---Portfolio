import * as React from 'react';
import { RequesterStatusCellContainerProps } from './types';
import RequesterStatusCell from './Status';

const RequesterStatusCellContainer = ({
  requesters,
}: RequesterStatusCellContainerProps) => {
  return <RequesterStatusCell requesters={requesters} />;
};

export default RequesterStatusCellContainer;
