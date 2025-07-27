import axios from 'axios';
import {
  ShowExternalRequesterAPIResponse,
  ResetPasswordAPIResponse,
  ResetPasswordPayload,
  CreateExternalRequesterAPIResponse,
  CreateExternalRequesterPayload,
  GenerateExternalOtpAPIResponse,
  GenerateExternalOtpPayload,
  UpdateExternalRequesterAPIResponse,
  UpdateExternalRequesterPayload,
  UpdatePasswordPayload,
  UpdatePasswordAPIResponse,
} from './types';

const createRequester = (
  subdomain: string,
  payload: CreateExternalRequesterPayload
): Promise<CreateExternalRequesterAPIResponse> => {
  return axios
    .post(`/api/v3/flowCidadao/external/requesters`, payload, {
      headers: { 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const showRequester = (
  token: string,
  subdomain: string,
  externalRequesterId: number
): Promise<ShowExternalRequesterAPIResponse> => {
  return axios
    .get(
      `/api/v3/flowCidadao/external/externalRequesters/${externalRequesterId}`,
      { headers: { token, 'X-Api-Subdomain': subdomain } }
    )
    .then((response) => response.data);
};

const generateExternalOtp = (
  subdomain: string,
  payload: GenerateExternalOtpPayload
): Promise<GenerateExternalOtpAPIResponse> => {
  return axios
    .post('/api/v3/flowCidadao/external/requesters/passwords', payload, {
      headers: { 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const me = (token: string, subdomain: string) => {
  return axios
    .get('/api/v3/flowCidadao/external/externalRequesters/me', {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const resetPassword = (
  subdomain: string,
  payload: ResetPasswordPayload
): Promise<ResetPasswordAPIResponse> => {
  return axios
    .put(`/api/v3/flowCidadao/external/requesters/passwords`, payload, {
      headers: { 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const updateRequester = (
  token: string,
  subdomain: string,
  externalRequesterId: number,
  payload: UpdateExternalRequesterPayload
): Promise<UpdateExternalRequesterAPIResponse> => {
  return axios
    .put(
      `/api/v3/flowCidadao/external/externalRequesters/${externalRequesterId}`,
      payload,
      { headers: { token, 'X-Api-Subdomain': subdomain } }
    )
    .then((response) => response.data);
};

const updatePassword = (
  token: string,
  subdomain: string,
  externalRequesterId: number,
  payload: UpdatePasswordPayload
): Promise<UpdatePasswordAPIResponse> => {
  return axios
    .put(
      `/api/v3/flowCidadao/external/externalRequesters/${externalRequesterId}/updatePassword`,
      payload,
      { headers: { token, 'X-Api-Subdomain': subdomain } }
    )
    .then((response) => response.data);
};

export const ExternalRequesterService = {
  createRequester,
  showRequester,
  generateExternalOtp,
  me,
  resetPassword,
  updateRequester,
  updatePassword,
};
