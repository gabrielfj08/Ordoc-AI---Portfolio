import * as React from 'react';
import { FilterProcedureTemplateParams } from './types';
import ProcedureTemplate from './ProcedureTemplates';

const ProcedureTemplateContainer = ({}) => {
  const [params, setParams] = React.useState<FilterProcedureTemplateParams>({
    order: 'name',
    direction: 'asc',
    page: 1,
    perPage: 20,
    source: '',
    status: '',
    q: '',
    root: true,
  });

  return <ProcedureTemplate params={params} setParams={setParams} />;
};

export default ProcedureTemplateContainer;
