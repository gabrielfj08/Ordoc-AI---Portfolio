import * as React from 'react';
import { useAuth } from '../../../hooks';
import { useMutation } from '@tanstack/react-query';
import ChangePasswordForm from './ChangePasswordForm';
import {
  ResetPasswordAPIResponse,
  ResetPasswordPayload,
} from '../../../services/types';
import { UserService } from '../../../services';

const ChangePasswordFormContainer = () => {
  const { subdomain } = useAuth();

  const mutation = useMutation((payload: ResetPasswordPayload) => {
    return UserService.resetPassword(subdomain, payload);
  });

  const handleSubmit = (
    values: ResetPasswordPayload
  ): Promise<ResetPasswordAPIResponse> => {
    return mutation.mutateAsync(values);
  };

  return <ChangePasswordForm onSubmit={handleSubmit} />;
};

export default ChangePasswordFormContainer;
