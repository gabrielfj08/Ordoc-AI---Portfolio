import axios from 'axios';
import { AuthCredentials, LoginAPIResponse } from './types';

type externalRequesterTokenType = null | string | undefined;

const login = (
  subdomain: string,
  credentials: AuthCredentials
): Promise<LoginAPIResponse> => {
  return axios.post(
    '/api/v3/flowCidadao/external/requesters/login',
    credentials,
    {
      headers: { 'X-Api-Subdomain': subdomain },
    }
  );
};

const recaptcha = (token: externalRequesterTokenType, secret: string) => {
  return axios.post('/api/recaptcha', { token, secret });
};

export const RequesterAuth = {
  login,
  recaptcha,
};
