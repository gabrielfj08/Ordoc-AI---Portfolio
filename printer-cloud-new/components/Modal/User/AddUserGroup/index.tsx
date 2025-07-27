import * as React from 'react';
import router from 'next/router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { UserGroupService, UserService } from '../../../../services';
import { AddUserGroupContainerProps, AddUserGroupFormValues } from './types';
import AddUserGroupSkeleton from './Skeleton';
import AddUserGroup from './AddUserGroup';
import AddUserGroupError from './Error';

const AddUserGroupContainer = ({ userGroups }: AddUserGroupContainerProps) => {
  const { token, subdomain } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: userGroupsData,
    isError: userGroupsIsError,
    isLoading: userGroupsIsLoading,
  } = useQuery({
    queryKey: ['userGroups', token, subdomain],
    queryFn: () =>
      UserGroupService.indexV3(token, subdomain, {
        perPage: 1000,
        status: 'active',
      }),
  });

  const {
    data: currentUserGroupsData,
    isError: currentIsError,
    isLoading: currentIsLoading,
  } = useQuery({
    queryKey: ['userGroup', { user_id: Number(router.query.id) }, token],
    queryFn: () =>
      UserGroupService.indexV3(token, subdomain, {
        user_id: Number(router.query.id),
        perPage: 1000,
        status: 'active',
      }),
  });

  const mutation = useMutation(
    (values: AddUserGroupFormValues) => {
      return UserService.addUserGroup(
        token,
        subdomain,
        Number(router.query.id),
        values
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'users',
          Number(router.query.id),
          'userGroups',
          token,
        ]);
      },
    }
  );
  if (userGroupsIsLoading || currentIsLoading) {
    return <AddUserGroupSkeleton />;
  }

  if (
    userGroupsIsError ||
    !userGroupsData ||
    currentIsError ||
    !currentUserGroupsData
  ) {
    return <AddUserGroupError />;
  }

  const handleSubmit = (values: AddUserGroupFormValues) => {
    return mutation.mutateAsync({
      userGroupIds: values.userGroupIds,
    });
  };

  return (
    <AddUserGroup
      userGroups={userGroupsData.userGroups}
      currentUserGroups={currentUserGroupsData.userGroups}
      onSubmit={handleSubmit}
    />
  );
};

export default AddUserGroupContainer;
