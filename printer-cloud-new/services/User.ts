import axios from 'axios';
import { buildParams } from '../utils';
import {
  ActivateUserAPIResponse,
  BaseUser,
  AddUserGroupPayload,
  CreateUserAPIResponse,
  CreateUserPayload,
  DeactivateUserAPIResponse,
  GenerateOtpAPIResponse,
  GenerateOtpPayload,
  IndexUsersAPIResponse,
  IndexUsersParams,
  MeAPIResponse,
  PutAddUserGroupPropsAPIResponse,
  ResetPasswordAPIResponse,
  ResetPasswordPayload,
  SendRandomPasswordAPIResponse,
  SendRandomPasswordPayload,
  ShowUserAPIResponse,
  ShowUserByOtpAPIResponse,
  UpdatePasswordAPIResponse,
  UpdatePasswordPayload,
  UpdateUserAPIResponse,
  UpdateUserPayload,
} from './types';

const activate = (
  token: string,
  subdomain: string,
  id: number
): Promise<ActivateUserAPIResponse> => {
  return axios.put(
    `/api/v3/printer_cloud/users/${id}/activate`,
    {},
    {
      headers: { token, 'X-Api-Subdomain': subdomain },
    }
  );
};

const deactivate = (
  token: string,
  subdomain: string,
  id: number
): Promise<DeactivateUserAPIResponse> => {
  return axios.put(
    `/api/v3/printer_cloud/users/${id}/deactivate`,
    {},
    {
      headers: { token, 'X-Api-Subdomain': subdomain },
    }
  );
};

const addPolicy = (
  token: string,
  subdomain: string,
  user_id: number | null,
  policy_ids: Object
): Promise<BaseUser> => {
  return axios.put(
    `/api/v3/printer_cloud/users/${user_id}/attach_policy`,
    policy_ids,
    {
      headers: { token, 'X-Api-Subdomain': subdomain },
    }
  );
};

const addUserGroup = (
  token: string,
  subdomain: string,
  id: number,
  payload: AddUserGroupPayload
): Promise<PutAddUserGroupPropsAPIResponse> => {
  return axios
    .put(`/api/v3/printer_cloud/users/${id}/add_user_groups`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const confirmAccount = (
  subdomain: string,
  confirmation_token: string | string[]
) => {
  return axios.get(
    `api/confirm-account?confirmation_token=${confirmation_token}`,
    { headers: { 'X-Api-Subdomain': subdomain } }
  );
};

const create = (
  token: string,
  subdomain: string,
  payload: CreateUserPayload
): Promise<CreateUserAPIResponse> => {
  return axios.post('/api/v3/printer_cloud/users', payload, {
    headers: { token, 'X-Api-Subdomain': subdomain },
  });
};

const deleteUser = (
  token: string,
  subdomain: string,
  user_id: number | null
) => {
  return axios.delete(`/api/v3/printer_cloud/users/${user_id}`, {
    headers: { token, 'X-Api-Subdomain': subdomain },
  });
};

const generateOtp = (
  subdomain: string,
  payload: GenerateOtpPayload
): Promise<GenerateOtpAPIResponse> => {
  return axios
    .post(`/api/v3/printer_cloud/users/password`, payload, {
      headers: { 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const index = (
  token: string,
  subdomain: string,
  params: IndexUsersParams
): Promise<IndexUsersAPIResponse> => {
  return axios
    .get(`/api/v3/printer_cloud/users?${buildParams(params)}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const me = (token: string, subdomain: string): Promise<MeAPIResponse> => {
  return axios
    .get('/api/me', { headers: { token, 'X-Api-Subdomain': subdomain } })
    .then((response) => response.data);
};

const removePolicy = (
  token: string,
  subdomain: string,
  user_id: number | null,
  policy_id: number | null
) => {
  return axios.put(
    `/api/v3/printer_cloud/users/${user_id}/detach_policy`,
    { policy_id },
    {
      headers: { token, 'X-Api-Subdomain': subdomain },
    }
  );
};

const resetPassword = (
  subdomain: string,
  payload: ResetPasswordPayload
): Promise<ResetPasswordAPIResponse> => {
  return axios
    .put(`/api/v3/printer_cloud/users/password`, payload, {
      headers: { 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const sendRandomPassword = (
  token: string,
  subdomain: string,
  userId: number,
  payload: SendRandomPasswordPayload
): Promise<SendRandomPasswordAPIResponse> => {
  return axios
    .patch(
      `/api/v3/printer_cloud/users/${userId}/send_random_password`,
      payload,
      { headers: { token, 'X-Api-Subdomain': subdomain } }
    )
    .then((response) => response.data);
};

const show = (
  token: string,
  subdomain: string,
  userId: number
): Promise<ShowUserAPIResponse> => {
  return axios
    .get(`/api/v3/printer_cloud/users/${userId}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const showUserByOtp = (
  subdomain: string,
  oneTimePassword: string
): Promise<ShowUserByOtpAPIResponse> => {
  return axios
    .get(`/api/v3/printer_cloud/users/password/${oneTimePassword}`, {
      headers: { 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const update = (
  token: string,
  subdomain: string,
  userId: number,
  data: UpdateUserPayload
): Promise<UpdateUserAPIResponse> => {
  return axios
    .put(`/api/v3/printer_cloud/users/${userId}`, data, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const updatePassword = (
  token: string,
  subdomain: string,
  userId: number,
  payload: UpdatePasswordPayload
): Promise<UpdatePasswordAPIResponse> => {
  return axios.put(
    `/api/v3/printer_cloud/users/${userId}/update_password`,
    payload,
    { headers: { token, 'X-Api-Subdomain': subdomain } }
  );
};

export const UserService = {
  activate,
  addPolicy,
  addUserGroup,
  confirmAccount,
  create,
  deactivate,
  deleteUser,
  generateOtp,
  index,
  me,
  removePolicy,
  resetPassword,
  sendRandomPassword,
  show,
  showUserByOtp,
  update,
  updatePassword,
};
