import * as React from 'react';
import { RequestersTypeCellContainerProps } from './types';
import RequestersTypeCell from './RequestType';

const RequestersTypeContainer = ({
  requesters,
}: RequestersTypeCellContainerProps) => {
  return <RequestersTypeCell requesters={requesters} />;
};

export default RequestersTypeContainer;
