import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../hooks';
import { TaskTemplateService } from '../../../services/printer-flow';
import { queryClient } from '../../../queryClient';
import {
  CreateTaskTemplateAPIResponse,
  CreateTaskTemplatePayload,
} from '../../../services/printer-flow/types';
import { NewTaskTemplateFormValues } from './types';
import NewTaskTemplate from './New';

const NewTaskTemplateContainer = () => {
  const { subdomain, token } = useAuth();

  const mutation = useMutation(
    (payload: CreateTaskTemplatePayload) =>
      TaskTemplateService.create(token, subdomain, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['taskTemplates', token, subdomain]);
      },
    }
  );

  const handleSubmit = (
    values: NewTaskTemplateFormValues
  ): Promise<CreateTaskTemplateAPIResponse> => {
    return mutation.mutateAsync({ ...values });
  };

  return <NewTaskTemplate onSubmit={handleSubmit} />;
};

export default NewTaskTemplateContainer;
