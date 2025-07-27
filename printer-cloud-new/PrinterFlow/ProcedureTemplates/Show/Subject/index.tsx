import * as React from 'react';
import router from 'next/router';
import { FilterProcedureTemplateParams } from '../../types';
import ShowProcedureTemplateSubject from './Subject';
import { ShowProcedureTemplateSubjectContainerProps } from './types';

const ShowProcedureTemplateSubjectContainer = ({
  procedureTemplate,
}: ShowProcedureTemplateSubjectContainerProps) => {
  const [params, setParams] = React.useState<FilterProcedureTemplateParams>({
    order: 'name',
    direction: 'asc',
    page: 1,
    perPage: 10,
    source: '',
    status: '',
    q: '',
    parentProcedureTemplateId: Number(router.query.procedureTemplateId),
    root: false,
  });

  return (
    <ShowProcedureTemplateSubject
      procedureTemplate={procedureTemplate}
      params={params}
      setParams={setParams}
    />
  );
};

export default ShowProcedureTemplateSubjectContainer;
