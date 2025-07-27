import * as React from 'react';
import { FilterProceduresParams } from '../types';
import ProceduresRunningTab from './ProceduresRunningTab';

const ProceduresRunningTabContainer = ({ userId }) => {
  const [params, setParams] = React.useState<FilterProceduresParams>({
    order: 'name',
    direction: 'asc',
    page: 1,
    perPage: 20,
    source: '',
    status: 'progress',
    priority: '',
    private: '',
    q: '',
    createdById: userId,
  });

  return <ProceduresRunningTab params={params} setParams={setParams} />;
};

export default ProceduresRunningTabContainer;
