import axios from 'axios';

type tokenType = null | string | undefined;

const changePassword = (subdomain: string, credentials: any) => {
  return axios.put('/api/change-password', credentials, {
    headers: { 'X-Api-Subdomain': subdomain },
  });
};

const expiredToken = (subdomain: string, email: any) => {
  return axios.post('/api/expired-token', email, {
    headers: { 'X-Api-Subdomain': subdomain },
  });
};

const healthcheck = (subdomain: string) => {
  return axios.get('/api/healthcheck', {
    headers: { 'X-Api-Subdomain': subdomain },
  });
};

const login = (subdomain: string, credentials: any) => {
  return axios.post('/api/login', credentials, {
    headers: { 'X-Api-Subdomain': subdomain },
  });
};

const newUser = (credentials: any) => {
  return axios.post('api/new-user', credentials);
};

const recaptcha = (token: tokenType, secret: string) => {
  return axios.post('/api/recaptcha', { token, secret });
};

const recoverPassword = (email: any) => {
  return axios.post('/api/recover-password', email);
};

const requestChangePsw = (subdomain: string, email: any) => {
  return axios.post('/api/request-change-password', email, {
    headers: { 'X-Api-Subdomain': subdomain },
  });
};

const unlockUser = (subdomain: string, credentials: any) => {
  return axios.post('/api/unlock-user', credentials);
};

const Auth = {
  changePassword,
  expiredToken,
  healthcheck,
  login,
  newUser,
  recaptcha,
  recoverPassword,
  requestChangePsw,
  unlockUser,
};

export default Auth;
