import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../hooks';
import { ExternalRequesterService } from '../../services/flow-cidadao';
import { GenerateExternalOtpAPIResponse } from '../../services/flow-cidadao/types';
import { RecoverUnlockPasswordForms } from './types';
import RecoverUnlockPasswordForm from './RecoverUnlockPassword';

const RecoverUnlockPasswordFormContainer = ({ secret }) => {
  const { subdomain } = useAuth();

  const mutation = useMutation((payload: RecoverUnlockPasswordForms) => {
    return ExternalRequesterService.generateExternalOtp(subdomain, payload);
  });

  const handleSubmit = (
    values: RecoverUnlockPasswordForms
  ): Promise<GenerateExternalOtpAPIResponse> => {
    return mutation.mutateAsync(values);
  };

  return <RecoverUnlockPasswordForm onSubmit={handleSubmit} secret={secret} />;
};

export default RecoverUnlockPasswordFormContainer;
