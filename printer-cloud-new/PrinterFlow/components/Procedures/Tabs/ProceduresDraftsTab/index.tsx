import * as React from 'react';
import { FilterProceduresParams } from '../types';
import ProceduresDraftsTab from './ProceduresDraftsTab';

const ProceduresDraftsTabContainer = ({ userId }) => {
  const [params, setParams] = React.useState<FilterProceduresParams>({
    order: 'name',
    direction: 'asc',
    page: 1,
    perPage: 20,
    source: '',
    status: 'draft',
    priority: '',
    private: '',
    createdById: userId,
    q: '',
  });

  return <ProceduresDraftsTab params={params} setParams={setParams} />;
};

export default ProceduresDraftsTabContainer;
