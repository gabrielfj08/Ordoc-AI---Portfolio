import * as React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { PolicyService, UserService } from '../../../../services';
import { queryClient } from '../../../../queryClient';
import {
  AddPoliciesUserContainerProps,
  AttachPolicyFormValues,
} from '../types';
import AddPoliciesUser from './AddPolicies';
import AddPoliciesUserSkeleton from './Skeleton';
import AddPoliciesUserError from './Error';

const AddPoliciesUserContainer = ({
  userId,
}: AddPoliciesUserContainerProps) => {
  const { token, subdomain } = useAuth();

  const {
    data: policiesData,
    isError: policiesIsError,
    isLoading: policiesIsLoading,
  } = useQuery({
    queryKey: ['policies', token, subdomain],
    queryFn: () => PolicyService.index(token, subdomain, { perPage: 1000 }),
  });

  const {
    data: currentPoliciesData,
    isError: currentIsError,
    isLoading: currentIsLoading,
  } = useQuery({
    queryKey: ['policies', { user_id: userId, subdomain, token }],
    queryFn: () =>
      PolicyService.index(token, subdomain, {
        user_id: userId,
        perPage: 1000,
      }),
  });

  const mutation = useMutation(
    (values: AttachPolicyFormValues) => {
      return UserService.addPolicy(token, subdomain, userId, values);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['users', userId, 'policies']);
      },
    }
  );
  if (policiesIsLoading || currentIsLoading) {
    return <AddPoliciesUserSkeleton />;
  }

  if (
    policiesIsError ||
    !policiesData ||
    currentIsError ||
    !currentPoliciesData
  ) {
    return <AddPoliciesUserError />;
  }

  const handleSubmit = (values: AttachPolicyFormValues) => {
    return mutation.mutateAsync({
      policyIds: values.policyIds,
    });
  };

  return (
    <AddPoliciesUser
      policies={policiesData.policies}
      currentPolicies={currentPoliciesData.policies}
      onSubmit={handleSubmit}
    />
  );
};

export default AddPoliciesUserContainer;
