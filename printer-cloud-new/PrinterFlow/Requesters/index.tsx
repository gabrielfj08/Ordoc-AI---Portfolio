import * as React from 'react';
import { FilterRequesterParams } from './types';
import Requester from './Requesters';

const RequestersContainer = () => {
  const [params, setParams] = React.useState<FilterRequesterParams>({
    direction: 'asc',
    order: 'name',
    page: 1,
    perPage: 20,
    q: '',
    status: '',
    type: '',
  });

  return <Requester setParams={setParams} params={params} />;
};

export default RequestersContainer;
