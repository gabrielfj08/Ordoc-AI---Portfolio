import * as React from 'react';
import { FilterTaskTemplateParams } from './types';
import TaskTemplates from './TaskTemplates';

const ProcedureTemplateContainer = () => {
  const [params, setParams] = React.useState<FilterTaskTemplateParams>({
    order: 'name',
    direction: 'asc',
    page: 1,
    perPage: 20,
    status: '',
    q: '',
  });

  return <TaskTemplates params={params} setParams={setParams} />;
};

export default ProcedureTemplateContainer;
