import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth, useExternalAuth } from '../../../../../../hooks';
import { queryClient } from '../../../../../../queryClient';
import {
  AddExternalCommentModalContainerProps,
  AddExternalCommentaskFormValues,
} from './types';
import { ExternalTaskCommentService } from '../../../../../../services/flow-cidadao';
import { CreateExternalTaskCommentAPIResponse } from '../../../../../../services/flow-cidadao/types';
import AddExternalCommentModal from './AddComment';

const AddExternalCommentModalContainer = ({
  task,
  status,
  commentModalVisibility,
  setCommentModalVisibility,
}: AddExternalCommentModalContainerProps) => {
  const { subdomain } = useAuth();
  const { externalToken } = useExternalAuth();

  switch (status) {
    case 'started':
      const commentMutation = useMutation(
        (payload: AddExternalCommentaskFormValues) =>
          ExternalTaskCommentService.create(
            String(externalToken),
            subdomain,
            task.id,
            payload
          ),
        {
          onSuccess: () => {
            queryClient.invalidateQueries();
            queryClient.invalidateQueries([
              'taskExternalComments',
              externalToken,
              subdomain,
              task.id,
            ]);
          },
        }
      );

      const commentHandleSubmit = (
        values: AddExternalCommentaskFormValues
      ): Promise<CreateExternalTaskCommentAPIResponse> => {
        return commentMutation.mutateAsync({ ...values });
      };

      return (
        <AddExternalCommentModal
          onSubmit={commentHandleSubmit}
          setCommentModalVisibility={setCommentModalVisibility}
          commentModalVisibility={commentModalVisibility}
        />
      );

    default:
      return null;
  }
};

export default AddExternalCommentModalContainer;
