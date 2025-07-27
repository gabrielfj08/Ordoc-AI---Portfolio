import * as React from 'react';
import { useAuth, useSnackbar } from '../../../hooks';
import { UserService } from '../../../services';
import { ShowUserByOtpAPIResponse } from '../../../services/types';
import { OneTimePasswordFormContainerProps } from './types';
import OneTimePasswordForm from './OneTimePassword';

const OneTimePasswordFormContainer = ({
  otpPayload,
}: OneTimePasswordFormContainerProps) => {
  const { subdomain } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [isLoading, setLoading] = React.useState(false);

  const loading = () => {
    setLoading(true);
  };

  const loaded = () => {
    setLoading(false);
  };

  const handleSubmit = (values: string): Promise<ShowUserByOtpAPIResponse> => {
    return UserService.showUserByOtp(subdomain, values);
  };

  const handleClick = () => {
    loading();
    UserService.generateOtp(subdomain, otpPayload)
      .then(() => {
        loaded();
        showSnackbar(
          `Código reenviado via ${otpPayload.notification} com sucesso!`,
          'success'
        );
      })
      .catch((err) => {
        loaded();
        showSnackbar(err.response.message, 'error');
      });
  };

  return (
    <OneTimePasswordForm
      onSubmit={handleSubmit}
      onClick={handleClick}
      isLoading={isLoading}
    />
  );
};

export default OneTimePasswordFormContainer;
