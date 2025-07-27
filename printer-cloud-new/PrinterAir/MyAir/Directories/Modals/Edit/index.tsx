import * as React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../../../hooks';
import { DirectoryService } from '../../../../../services/printer-air';
import { getSubdomain } from '../../../../../utils';
import {
  UpdateDirectoryAPIResponse,
  UpdateDirectoryPayload,
} from '../../../../../services/printer-air/types';
import {
  EditDirectoryFormValues,
  EditDirectoryContainerModalProps,
} from './types';
import EditDirectoryModal from './Edit';

const EditDirectoryContainerModal = ({
  organizationId,
  directoryId,
  name,
  description,
}: EditDirectoryContainerModalProps) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (payload: UpdateDirectoryPayload) =>
      DirectoryService.update(
        token,
        getSubdomain(),
        organizationId,
        directoryId,
        payload
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['directories', {}]);
      },
    }
  );

  const handleSubmit = (
    values: EditDirectoryFormValues
  ): Promise<UpdateDirectoryAPIResponse> => {
    return mutation.mutateAsync({ ...values });
  };

  return (
    <EditDirectoryModal
      onSubmit={handleSubmit}
      name={name}
      description={description}
    />
  );
};

export default EditDirectoryContainerModal;
