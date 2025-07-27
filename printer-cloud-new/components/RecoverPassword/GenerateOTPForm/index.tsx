import { useMutation } from '@tanstack/react-query';
import * as React from 'react';
import { useAuth } from '../../../hooks';
import { UserService } from '../../../services';
import {
  GenerateOtpAPIResponse,
  GenerateOtpPayload,
} from '../../../services/types';
import { GenerateOTPFormContainerProps } from './types';
import GenerateOTPForm from './GenerateOTPForm';

const GenerateOTPFormContainer = ({
  setFormVisibility,
  setOtpPayload,
}: GenerateOTPFormContainerProps) => {
  const { subdomain } = useAuth();

  const mutation = useMutation((payload: GenerateOtpPayload) => {
    return UserService.generateOtp(subdomain, payload);
  });

  const handleSubmit = (
    values: GenerateOtpPayload
  ): Promise<GenerateOtpAPIResponse> => {
    return mutation.mutateAsync(values);
  };

  return (
    <GenerateOTPForm
      onSubmit={handleSubmit}
      setOtpPayload={setOtpPayload}
      setFormVisibility={setFormVisibility}
    />
  );
};

export default GenerateOTPFormContainer;
