import * as React from 'react';
import { useAuth, useExternalAuth } from '../../../../hooks';
import { useMutation } from '@tanstack/react-query';
import { ExternalRequesterService } from '../../../../services/flow-cidadao';
import {
  UpdatePasswordPayload,
  UpdatePasswordAPIResponse,
} from '../../../../services/flow-cidadao/types';
import {
  ChangePasswordModalContainerProps,
  ChangePasswordFormValues,
} from './types';
import ChangePasswordModal from './ChangePassword';

const ChangePasswordModalContainer = ({
  externalRequesterId,
}: ChangePasswordModalContainerProps) => {
  const { externalToken } = useExternalAuth();
  const { subdomain } = useAuth();

  const mutation = useMutation((values: UpdatePasswordPayload) => {
    return ExternalRequesterService.updatePassword(
      externalToken as string,
      subdomain,
      externalRequesterId,
      values
    );
  });

  const handleSubmit = (
    values: ChangePasswordFormValues
  ): Promise<UpdatePasswordAPIResponse> => {
    return mutation.mutateAsync({ ...values });
  };

  return <ChangePasswordModal handleSubmit={handleSubmit} />;
};

export default ChangePasswordModalContainer;
