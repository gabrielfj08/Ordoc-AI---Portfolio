import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth, useExternalAuth, useExternalSession } from '../../hooks';
import { UpdatePasswordPayload } from '../../services/flow-cidadao/types';
import { ExternalRequesterService } from '../../services/flow-cidadao';
import ChangePassword from './ChangePassword';

const ChangePasswordContainer = () => {
  const { subdomain } = useAuth();
  const { externalToken } = useExternalAuth();
  const { externalSession } = useExternalSession();

  const mutation = useMutation((values: UpdatePasswordPayload) => {
    return ExternalRequesterService.updatePassword(
      externalToken as string,
      subdomain,
      externalSession.user.id,
      values
    );
  });

  const handleSubmit = (values: UpdatePasswordPayload) => {
    return mutation.mutateAsync(values);
  };

  return <ChangePassword handleSubmit={handleSubmit} />;
};

export default ChangePasswordContainer;
