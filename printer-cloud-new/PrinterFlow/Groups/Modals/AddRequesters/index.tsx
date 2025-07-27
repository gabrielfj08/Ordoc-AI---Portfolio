import * as React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { GroupRequesterService } from '../../../../services/printer-flow';
import { BatchOperationService } from '../../../../services/printer-air';
import { AddRequestersToGroupAPIResponse } from '../../../../services/printer-flow/types';
import {
  AddRequestersContainerModalProps,
  AddRequestersFormValues,
} from './types';
import AddRequestersModal from './AddRequesters';

const AddRequestersContainerModal = ({
  groupId,
}: AddRequestersContainerModalProps) => {
  const { subdomain, token } = useAuth();
  const queryClient = useQueryClient();

  const poolingBatchOperation: any = (
    bachOperation: AddRequestersToGroupAPIResponse
  ) => {
    BatchOperationService.show(token, subdomain, bachOperation.id).then(
      (response) => {
        if (response.status === 'running') {
          setInterval(poolingBatchOperation(response), 2000);
        } else {
          queryClient.invalidateQueries();
        }
      }
    );
  };

  const mutation = useMutation(
    (values: AddRequestersFormValues) => {
      return GroupRequesterService.addRequestersToGroup(
        token,
        subdomain,
        groupId,
        values
      );
    },
    {
      onSuccess: (response) => {
        poolingBatchOperation(response);
      },
    }
  );

  const handleSubmit = (values: AddRequestersFormValues) => {
    return mutation.mutateAsync(values);
  };

  return <AddRequestersModal groupId={groupId} onSubmit={handleSubmit} />;
};

export default AddRequestersContainerModal;
