import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../hooks';
import { ResetPasswordPayload } from '../../services/flow-cidadao/types';
import { ExternalRequesterService } from '../../services/flow-cidadao';
import ResetPassword from './ResetPassword';

const ResetPasswordContainer = () => {
  const { subdomain } = useAuth();

  const mutation = useMutation((values: ResetPasswordPayload) => {
    return ExternalRequesterService.resetPassword(subdomain, values);
  });

  const handleSubmit = (values: ResetPasswordPayload) => {
    return mutation.mutateAsync(values);
  };

  return <ResetPassword handleSubmit={handleSubmit} />;
};

export default ResetPasswordContainer;
