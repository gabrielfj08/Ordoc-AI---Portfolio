import * as React from 'react';
import router from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '../../../../queryClient';
import { useAuth, useSnackbar } from '../../../../hooks';
import { PolicyService } from '../../../../services';
import { EditContainerProps, EditPolicyFormValues } from './types';
import EditPolicySkeleton from './Skeleton';
import ErrorEditPage from './Error';
import Edit from './Edit';
import UnauthorizedEditPage from './Unauthorized';

const EditContainer = ({ policyId }: EditContainerProps) => {
  const { token, subdomain } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [editpolicyError, setEditPolicyError] = React.useState<number>();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['policies', policyId, 'edit'],
    queryFn: () => PolicyService.show(token, subdomain, policyId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['policies', policyId, 'edit'],
      });
      refetch();
    },
    onError: (error: any) => {
      setEditPolicyError(error.response.status);
    },
  });

  if (isLoading) {
    return <EditPolicySkeleton />;
  }

  if (isError) {
    if (editpolicyError === 401) {
      return <UnauthorizedEditPage />;
    }
    return <ErrorEditPage />;
  }

  const handleSubmit = ({
    actionIds,
    description,
    effect,
    resource,
    service,
  }: EditPolicyFormValues) => {
    PolicyService.update(token, subdomain, policyId, {
      effect,
      description,
      actionIds,
      resource,
      service,
    })
      .then(() => {
        showSnackbar('Permissão alterada com sucesso.', 'success');
        router.push(`/printer-cloud/policies/${policyId}`);
      })
      .catch((error) => {
        showSnackbar(error.response.data.message, 'error');
      });
  };

  return (
    <div className=" sm:w-[28.925rem] px-4 sm:pl-0">
      <Edit policy={data} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditContainer;
