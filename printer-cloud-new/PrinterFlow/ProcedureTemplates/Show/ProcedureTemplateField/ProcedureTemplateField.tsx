import * as React from 'react';
import { Button } from 'printer-ui';
import { ShowProcedureTemplateFieldProps } from './types';
import Pagination from '../../../../components/Pagination/Pagination';
import NewField from '../../../components/ProcedureTemplates/NewField';
import Field from '../../../components/ProcedureTemplates/Field';

const ShowProcedureTemplateField = ({
  fields,
  totalDocs,
  page,
  procedureTemplate,
  setPage,
}: ShowProcedureTemplateFieldProps) => {
  const docsPerPage = 3;

  const [hidden, setHidden] = React.useState<string>('hidden');

  return (
    <div className="mt-2 items-center p-4 rounded-lg bg-lighterGray">
      <div className="flex mb-4 space-x-2 justify-between items-center">
        <Button
          type="submit"
          color="info"
          label="Novo campo"
          onClick={() => setHidden('block')}
          disabled={procedureTemplate.status === 'inactive' ? true : false}
        >
          <Button.Icon name="plus" alt="plus" color="white" stroke fill />
        </Button>
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={Math.ceil(totalDocs / docsPerPage)}
          totalObjects={totalDocs}
          objectsPerPage={docsPerPage}
        />
      </div>
      <div className="space-y-4">
        <div className={hidden}>
          <NewField
            procedureTemplateId={procedureTemplate.id}
            setHidden={setHidden}
          />
        </div>
        {fields.map((field) => (
          <Field
            key={field.id}
            field={field}
            procedureTemplate={procedureTemplate}
          />
        ))}
      </div>
    </div>
  );
};

export default ShowProcedureTemplateField;
