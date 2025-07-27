import * as React from 'react';
import { ShowSubjectDocumentContainerProps } from './types';
import { IndexProcedureTemplateDocumentsPayload } from '../../../../../services/printer-flow/types';
import ShowSubjectDocument from './UploadDocument';

const ShowSubjectDocumentContainer = ({
  procedureTemplate,
  procedureTemplateDocument,
}: ShowSubjectDocumentContainerProps) => {
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
    <ShowSubjectDocument
      params={params}
      setParams={setParams}
      procedureTemplate={procedureTemplate}
      procedureTemplateDocument={procedureTemplateDocument}
    />
  );
};

export default ShowSubjectDocumentContainer;
