import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../../queryClient';
import { useAuth, useSessionGroupRequester } from '../../../../hooks';
import { ProcedureService } from '../../../../services/printer-flow';
import { CreateProcedurePayload } from '../../../../services/printer-flow/types';
import {
  NewProcedureInfoContainerProps,
  NewProcedureInfoFormValues,
} from './types';
import NewProcedureInfo from './Info';

const NewProcedureInfoContainer = ({
  requesters,
  procedureTemplates,
  setProcedureData,
}: NewProcedureInfoContainerProps) => {
  const { subdomain, token } = useAuth();
  const { sessionGroupRequester } = useSessionGroupRequester();

  if (!sessionGroupRequester) return null;

  const mutation = useMutation(
    (payload: CreateProcedurePayload) =>
      ProcedureService.create(
        token,
        subdomain,
        Number(sessionGroupRequester?.id),
        payload
      ),
    {
      onSuccess: (data: any) => {
        queryClient.invalidateQueries(['procedures']);
        setProcedureData(data.data);
      },
    }
  );

  const handleSubmit = (values: NewProcedureInfoFormValues) => {
    return mutation.mutateAsync(values);
  };

  return (
    <NewProcedureInfo
      onSubmit={handleSubmit}
      requesters={requesters}
      procedureTemplates={procedureTemplates}
    />
  );
};

export default NewProcedureInfoContainer;
