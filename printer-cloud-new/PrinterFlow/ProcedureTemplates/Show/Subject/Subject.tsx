import * as React from 'react';
import router from 'next/router';
import { Button } from 'printer-ui';
import { ShowProcedureTemplateSubjectProps } from './types';
import Pagination from '../../../../components/Pagination/Pagination';
import SubjectsListField from '../../../components/ProcedureTemplates/Subjects/List';

const ShowProcedureTemplateSubject = ({
  params,
  procedureTemplate,
}: ShowProcedureTemplateSubjectProps) => {
  const [totalObjects, setTotalObjects] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const docsPerPage = 10;

  return (
    <>
      <div className="mt-2 items-center p-4 rounded-lg bg-lighterGray">
        <div className="flex justify-between mb-6">
          <Button
            type="submit"
            color="info"
            label="Novo assunto"
            onClick={() =>
              router.push(
                `/printer-flow/procedure-templates/${procedureTemplate.id}/subjects/new`
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
        <SubjectsListField
          params={{ ...params, page: page }}
          setTotalObjects={setTotalObjects}
          procedureTemplate={procedureTemplate}
        />
      </div>
    </>
  );
};

export default ShowProcedureTemplateSubject;
