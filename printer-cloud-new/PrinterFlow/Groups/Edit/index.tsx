import * as React from 'react';
import { queryClient } from '../../../queryClient';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../hooks';
import { GroupRequesterService } from '../../../services/printer-flow';
import {
  UpdateGroupRequesterAPIResponse,
  UpdateGroupRequesterPayload,
} from '../../../services/printer-flow/types';
import { EditGroupContainerProps, EditGroupFormValues } from './types';
import EditGroup from './Edit';

const EditGroupContainer = ({
  groupId,
  name,
  setUpdateGroup,
}: EditGroupContainerProps) => {
  const { subdomain, token } = useAuth();

  const mutation = useMutation(
    (payload: UpdateGroupRequesterPayload) =>
      GroupRequesterService.update(token, subdomain, groupId, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['groupRequester', subdomain, token, {}]),
          setUpdateGroup(false);
      },
    }
  );

  const handleSubmit = (
    values: EditGroupFormValues
  ): Promise<UpdateGroupRequesterAPIResponse> => {
    return mutation.mutateAsync({ ...values });
  };

  return <EditGroup onSubmit={handleSubmit} name={name} />;
};

export default EditGroupContainer;
