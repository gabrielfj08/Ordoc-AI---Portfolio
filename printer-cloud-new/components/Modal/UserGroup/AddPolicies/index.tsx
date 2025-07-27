import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '../../../../queryClient';
import { useAuth, useModal, useSnackbar } from '../../../../hooks';
import { PolicyService, UserGroupService } from '../../../../services';
import { AddPoliciesContainerProps } from '../types';
import AddPolicies from './AddPolicies';
import AddPoliciesSkeleton from './Skeleton';
import AddPoliciesError from './Error';

const AddPoliciesContainer = ({
  organization_id,
  group_id,
}: AddPoliciesContainerProps) => {
  const { token, subdomain } = useAuth();
  const { showSnackbar } = useSnackbar();
  const { closeModal } = useModal();

  const [buttonLoading, setButtonLoading] = React.useState(false);

  const loading = () => {
    setButtonLoading(true);
  };

  const loaded = () => {
    setButtonLoading(false);
  };

  const handleSubmit = (values: any) => {
    loading();
    UserGroupService.attachForUserGroup(token, subdomain, group_id, values)
      .then(() => {
        loaded();
        closeModal();
        showSnackbar(`Permissão adicionada com sucesso.`, 'success');
        {
          queryClient.invalidateQueries(['userGroups', group_id, 'policies']);
          queryClient.invalidateQueries(['userGroups', group_id, token]);
        }
      })
      .catch((error) => {
        showSnackbar(error.response.data.message, 'error');
      });
  };

  const {
    isError: userGroupPolicyIsError,
    isLoading: userGroupPolicyIsLoading,
    data: userGroupPolicyData,
  } = useQuery(
    [
      'printer_cloud/user_groups',
      { organization_id, subdomain, token, group_id },
    ],
    () =>
      PolicyService.index(token, subdomain, {
        page: 1,
        perPage: 1000,
        user_group_id: null,
        organization_id: organization_id,
        q: '',
        user_id: null,
        source: '',
        order: '',
        direction: '',
      })
  );

  const {
    isError: currentUserGroupPolicyIsError,
    isLoading: currentUserGroupPolicyIsLoading,
    data: currentUserGroupPolicyData,
  } = useQuery({
    queryKey: ['userPolicies', { groupId: group_id }, token, subdomain],
    queryFn: () =>
      PolicyService.index(token, subdomain, { user_group_id: group_id }),
  });

  if (currentUserGroupPolicyIsError || userGroupPolicyIsError) {
    return <AddPoliciesError />;
  }

  if (currentUserGroupPolicyIsLoading || userGroupPolicyIsLoading) {
    return <AddPoliciesSkeleton />;
  }

  return (
    <AddPolicies
      buttonLoading={buttonLoading}
      userGroupPolicies={userGroupPolicyData.policies}
      currentUserGroupPolicies={currentUserGroupPolicyData.policies}
      onSubmit={handleSubmit}
    />
  );
};

export default AddPoliciesContainer;
