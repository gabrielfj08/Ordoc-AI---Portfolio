import * as React from 'react';
import { Button } from 'printer-ui';
import { useModal } from '../../../../hooks';
import { ShowProcedureTemplateDocumentProps } from './types';
import Pagination from '../../../../components/Pagination/Pagination';
import NewProcedureTemplateDocumentModal from './New';
import DocumentList from './DocumentList';

const ShowProcedureTemplateDocument = ({
  procedureTemplate,
  procedureTemplateDocument,
  params,
}: ShowProcedureTemplateDocumentProps) => {
  const { openModal } = useModal();
  const [totalObjects, setTotalObjects] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const docsPerPage = 10;

  return (
    <div className="mt-2 items-center p-4 rounded-lg bg-lighterGray">
      <div className="flex justify-between mb-6">
        <Button
          type="submit"
          color="info"
          label="Novo anexo"
          onClick={() =>
            openModal(
              <NewProcedureTemplateDocumentModal
                procedureTemplateDocument={procedureTemplateDocument}
                procedureTemplate={procedureTemplate}
              />
            )
          }
          disabled={procedureTemplate.status === 'inactive' ? true : false}
        >
          <Button.Icon name="plus" alt="plus" color="white" stroke fill />
        </Button>
        <Pagination
          page={page}
          setPage={setPage}
          totalObjects={totalObjects}
          totalPages={Math.ceil(totalObjects / docsPerPage)}
          objectsPerPage={docsPerPage}
        />
      </div>
      <DocumentList
        params={{ ...params, page: page }}
        setTotalObjects={setTotalObjects}
        procedureTemplateDocuments={procedureTemplateDocument}
        procedureTemplate={procedureTemplate}
      />
    </div>
  );
};

export default ShowProcedureTemplateDocument;
