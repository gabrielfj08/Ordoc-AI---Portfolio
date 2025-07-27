import * as React from 'react';
import { FilterProceduresParams } from '../types';
import ProceduresArchivedTab from './ProceduresArchivedTab';

const ProceduresArchivedTabContainer = ({ userId }) => {
  const [params, setParams] = React.useState<FilterProceduresParams>({
    order: 'name',
    direction: 'asc',
    page: 1,
    perPage: 20,
    source: '',
    status: 'archived',
    priority: '',
    private: '',
    q: '',
    createdById: userId,
  });

  return <ProceduresArchivedTab params={params} setParams={setParams} />;
};

export default ProceduresArchivedTabContainer;
