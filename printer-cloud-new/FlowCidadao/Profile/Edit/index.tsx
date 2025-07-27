import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth, useExternalAuth } from '../../../hooks';
import { queryClient } from '../../../queryClient';
import { ExternalRequesterService } from '../../../services/flow-cidadao';
import {
  UpdateExternalRequesterAPIResponse,
  UpdateExternalRequesterPayload,
} from '../../../services/flow-cidadao/types';
import { EditProfileContainerProps, EditProfileFormValues } from './types';
import EditProfile from './Edit';

const EditProfileContainer = ({
  externalRequester,
  color,
  setType,
}: EditProfileContainerProps) => {
  const { subdomain } = useAuth();
  const { externalToken } = useExternalAuth();

  const mutation = useMutation(
    (payload: UpdateExternalRequesterPayload) =>
      ExternalRequesterService.updateRequester(
        externalToken as string,
        subdomain,
        externalRequester.id,
        payload
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'externalRequester',
          externalToken,
          subdomain,
          externalRequester.id,
        ]);
      },
    }
  );

  const handleSubmit = (
    values: EditProfileFormValues
  ): Promise<UpdateExternalRequesterAPIResponse> => {
    return mutation.mutateAsync({
      ...values,
    });
  };

  return (
    <EditProfile
      externalRequester={externalRequester}
      color={color}
      onSubmit={handleSubmit}
      setType={setType}
    />
  );
};

export default EditProfileContainer;
