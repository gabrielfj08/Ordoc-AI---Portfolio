import * as React from 'react';
import { RequestersCellContainerProps } from './types';
import RequestersCell from './Requesters';

const RequestersCellContainer = ({
  requesters,
}: RequestersCellContainerProps) => {
  return <RequestersCell requesters={requesters} />;
};

export default RequestersCellContainer;
