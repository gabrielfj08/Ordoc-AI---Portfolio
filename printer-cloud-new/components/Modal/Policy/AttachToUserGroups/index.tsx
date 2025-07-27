import * as React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../../queryClient';
import { useAuth } from '../../../../hooks';
import { PolicyService, UserGroupService } from '../../../../services';
import {
  AttachPolicyToUserGroupsFormValues,
  AttachToUserGroupsContainerProps,
} from './types';
import AttachToUserGroups from './AttachToUserGroups';
import AttachToUserGroupsSkeleton from './Skeleton';
import AttachToUserGroupsError from './Error';

const AttachToUserGroupsContainer = ({
  policy,
}: AttachToUserGroupsContainerProps) => {
  const { token, subdomain } = useAuth();

  const {
    data: userGroupsData,
    isError: userGroupsIsError,
    isLoading: userGroupsIsLoading,
  } = useQuery({
    queryKey: ['userGroups', token],
    queryFn: () => UserGroupService.indexV3(token, subdomain, {}),
  });

  const {
    data: currentUserGroupsData,
    isError: currentIsError,
    isLoading: currentIsLoading,
  } = useQuery({
    queryKey: ['userGroups', { policyId: policy.id }, token],
    queryFn: () =>
      UserGroupService.indexV3(token, subdomain, {
        policy_id: policy.id,
      }),
  });

  const mutation = useMutation(
    (values: AttachPolicyToUserGroupsFormValues) => {
      return PolicyService.attachToUserGroups(
        token,
        subdomain,
        policy.id,
        values
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'policies',
          policy.id,
          'userGroups',
          token,
        ]);
        queryClient.invalidateQueries(['policies', policy.id]);
      },
    }
  );

  if (userGroupsIsLoading || currentIsLoading) {
    return <AttachToUserGroupsSkeleton />;
  }

  if (
    userGroupsIsError ||
    !userGroupsData ||
    currentIsError ||
    !currentUserGroupsData
  ) {
    return <AttachToUserGroupsError />;
  }

  const handleSubmit = (values: AttachPolicyToUserGroupsFormValues) => {
    return mutation.mutateAsync(values);
  };

  return (
    <AttachToUserGroups
      userGroups={userGroupsData.userGroups}
      currentUserGroups={currentUserGroupsData.userGroups}
      onSubmit={handleSubmit}
    />
  );
};

export default AttachToUserGroupsContainer;
