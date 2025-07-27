import * as React from 'react';
import { Button } from 'printer-ui';
import { ShowSubjectDocumentProps } from './types';
import Pagination from '../../../../../components/Pagination/Pagination';
import { useModal } from '../../../../../hooks';
import SubjectDocumentList from './DocumentList';
import NewProcedureTemplateDocument from './New';

const ShowSubjectDocument = ({
  procedureTemplate,
  procedureTemplateDocument,
  params,
}: ShowSubjectDocumentProps) => {
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
              <NewProcedureTemplateDocument
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
      <SubjectDocumentList
        params={{ ...params, page: page }}
        setTotalObjects={setTotalObjects}
        procedureTemplateDocuments={procedureTemplateDocument}
        procedureTemplate={procedureTemplate}
      />
    </div>
  );
};

export default ShowSubjectDocument;
