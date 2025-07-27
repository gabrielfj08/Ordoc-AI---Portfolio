import * as React from 'react';
import { IndexProcedureTemplateDocumentsPayload } from '../../../../services/printer-flow/types';
import { ShowProcedureTemplateDocumentContainerProps } from './types';
import ShowProcedureTemplateDocument from './ProcedureTemplateDocument';

const ShowProcedureTemplateDocumentContainer = ({
  procedureTemplateDocument,
  procedureTemplate,
}: ShowProcedureTemplateDocumentContainerProps) => {
  const [params, setParams] =
    React.useState<IndexProcedureTemplateDocumentsPayload>({
      status: 'finished',
      order: 'name',
      direction: 'asc',
      page: 1,
      perPage: 10,
      q: '',
    });

  return (
    <ShowProcedureTemplateDocument
      params={params}
      setParams={setParams}
      procedureTemplate={procedureTemplate}
      procedureTemplateDocument={procedureTemplateDocument}
    />
  );
};

export default ShowProcedureTemplateDocumentContainer;
