import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../hooks';
import { ExternalRequesterService } from '../../services/flow-cidadao';
import { CreateExternalRequesterAPIResponse } from '../../services/flow-cidadao/types';
import { NewExternalRequesterFormValues } from './types';
import NewExternalRequesterForm from './NewExternalRequester';

const NewExternalRequesterFormContainer = ({ secret }) => {
  const { subdomain } = useAuth();

  const mutation = useMutation((payload: NewExternalRequesterFormValues) => {
    return ExternalRequesterService.createRequester(subdomain, payload);
  });

  const handleSubmit = (
    values: NewExternalRequesterFormValues
  ): Promise<CreateExternalRequesterAPIResponse> => {
    return mutation.mutateAsync(values);
  };

  return <NewExternalRequesterForm onSubmit={handleSubmit} secret={secret} />;
};

export default NewExternalRequesterFormContainer;
