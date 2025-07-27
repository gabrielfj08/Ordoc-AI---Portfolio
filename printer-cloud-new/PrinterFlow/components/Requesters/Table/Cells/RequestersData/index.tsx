import * as React from 'react';
import { RequestersDataContainerCellProps } from './types';
import RequestersData from './RequestData';

const RequestersDataContainer = ({
  requesters,
}: RequestersDataContainerCellProps) => {
  return <RequestersData requesters={requesters} />;
};

export default RequestersDataContainer;
