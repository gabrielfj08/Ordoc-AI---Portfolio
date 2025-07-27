import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth, useExternalAuth } from '../../hooks';
import { ExternalProcedureService } from '../../services/flow-cidadao';
import { CreateExternalProcedureAPIResponse } from '../../services/flow-cidadao/types';
import { NewExternalProcedureForms } from './types';
import NewExternalProcedures from './NewProcedure';

const NewExternalProceduresContainer = () => {
  const { externalToken } = useExternalAuth();
  const { subdomain } = useAuth();

  const mutation = useMutation(
    (procedureTemplateId: NewExternalProcedureForms) => {
      return ExternalProcedureService.create(
        externalToken as string,
        subdomain,
        procedureTemplateId
      );
    }
  );

  const handleSubmit = (
    values: NewExternalProcedureForms
  ): Promise<CreateExternalProcedureAPIResponse> => {
    return mutation.mutateAsync(values);
  };

  return <NewExternalProcedures onSubmit={handleSubmit} />;
};

export default NewExternalProceduresContainer;
