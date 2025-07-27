import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../hooks';
import { LoginAPIResponse } from '../../services/flow-cidadao/types';
import { RequesterAuth } from '../../services/flow-cidadao';
import { LoginFormValues } from './types';
import LoginForm from './LoginForm';

const LoginFormContainer = ({ secret }) => {
  const { subdomain } = useAuth();

  const mutation = useMutation((values: LoginFormValues) => {
    return RequesterAuth.login(subdomain, values);
  });

  const handleSubmit = (values: LoginFormValues): Promise<LoginAPIResponse> => {
    return mutation.mutateAsync(values);
  };

  return <LoginForm onSubmit={handleSubmit} secret={secret} />;
};

export default LoginFormContainer;
