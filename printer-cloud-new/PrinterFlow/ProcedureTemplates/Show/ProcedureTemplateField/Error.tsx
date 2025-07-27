import * as React from 'react';
import router from 'next/router';
import { Icon, Typography, Button } from 'printer-ui';
import { ShowProcedureTemplateFieldErrorProps } from './types';
import NewField from '../../../components/ProcedureTemplates/NewField';

const ShowProcedureTemplateFieldError = ({
  procedureTemplate,
}: ShowProcedureTemplateFieldErrorProps) => {
  const [hidden, setHidden] = React.useState<string>('hidden');

  if (!Number(router.query.procedureTemplateId)) return null;

  return (
    <div className="items-center p-4 rounded-lg bg-lighterGray">
      <div className="w-full justify-start flex">
        <Button
          type="submit"
          color="info"
          label="Novo campo"
          disabled={procedureTemplate.status === 'inactive' ? true : false}
        >
          <Button.Icon name="plus" alt="plus" color="white" stroke fill />
        </Button>
      </div>
      <div className={hidden}>
        <NewField
          procedureTemplateId={Number(router.query.procedureTemplateId)}
          setHidden={setHidden}
        />
      </div>
      {hidden === 'hidden' ? (
        <div className="w-full  bg-white flex items-center space-x-2 justify-center my-4 py-4">
          <Icon alt="alert" name="alert" color="error" stroke />
          <Typography variant="footnote1" color="gray" align="center">
            Erro! Não foi possível carregar a lista de campos do tipo de
            processo, tente novamente mais tarde.
          </Typography>
        </div>
      ) : null}
    </div>
  );
};

export default ShowProcedureTemplateFieldError;
