import * as React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../hooks';
import { PolicyService } from '../../../services';
import { getSubdomain } from '../../../utils';
import { NewPolicyContainerProps, NewPolicyFormValues } from './types';
import NewPolicy from './New';

const NewPolicyContainer = ({}: NewPolicyContainerProps) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (values: NewPolicyFormValues) =>
      PolicyService.create(token, getSubdomain(), {
        name: values.name,
        description: values.description,
        effect: values.effect,
        actionIds: values.actionIds.map((actionId) => Number(actionId)),
        resource: values.resource,
        service: values.service,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['policies', {}]);
      },
    }
  );

  const handleChange = (values: NewPolicyFormValues) => {
    return mutation.mutateAsync(values);
  };

  return <NewPolicy onSubmit={handleChange} />;
};

export default NewPolicyContainer;
