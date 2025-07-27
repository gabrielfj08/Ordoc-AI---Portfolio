import * as React from 'react';
import { FilterProceduresParams } from '../types';
import ProceduresFinishedTab from './ProceduresFinishedTab';

const ProceduresFinishedTabContainer = ({ userId }) => {
  const [params, setParams] = React.useState<FilterProceduresParams>({
    order: 'name',
    direction: 'asc',
    page: 1,
    perPage: 20,
    source: '',
    status: 'finished',
    priority: '',
    private: '',
    q: '',
    createdById: userId,
  });

  return <ProceduresFinishedTab params={params} setParams={setParams} />;
};

export default ProceduresFinishedTabContainer;
