import * as React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../../../hooks';
import { DirectoryService } from '../../../../../services/printer-air';
import {
  NewDirectoryFormValues,
  NewDirectoryModalContainerProps,
} from './types';
import {
  CreateDirectoryAPIResponse,
  CreateDirectoryPayload,
} from '../../../../../services/printer-air/types';
import NewDirectoryModal from './New';

const NewDirectoryModalContainer = ({
  organizationId,
  parentDirectoryId,
}: NewDirectoryModalContainerProps) => {
  const { subdomain, token } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (payload: CreateDirectoryPayload) =>
      DirectoryService.create(token, subdomain, organizationId, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['directories', {}]);
      },
    }
  );

  const handleSubmit = (
    values: NewDirectoryFormValues
  ): Promise<CreateDirectoryAPIResponse> => {
    return mutation.mutateAsync({ ...values, parentDirectoryId });
  };

  return <NewDirectoryModal onSubmit={handleSubmit} />;
};

export default NewDirectoryModalContainer;
