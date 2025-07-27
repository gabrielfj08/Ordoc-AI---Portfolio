import axios from 'axios';
import { toQueryString } from '../../utils';
import {
  CountSignaturesByStatusAPIResponse,
  CreateSignatureAPIResponse,
  CreateSignaturePayload,
  IndexSignaturesAPIResponse,
  IndexSignaturesPayload,
  RefuseSignatureAPIResponse,
  RefuseSignaturePayload,
  ShowSignatureAPIResponse,
  SignSignatureAPIResponse,
  DeleteSignatureAPIResponse,
} from './types';

const create = (
  token: string,
  subdomain: string,
  payload: CreateSignaturePayload
): Promise<CreateSignatureAPIResponse> => {
  return axios.post(`/api/v3/printerFlow/signatures`, payload, {
    headers: { token, 'X-Api-Subdomain': subdomain },
  });
};

const countByStatus = (
  token: string,
  subdomain: string
): Promise<CountSignaturesByStatusAPIResponse> => {
  return axios
    .get(`/api/v3/printerFlow/signatures/countByStatus`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const deleteSignature = (
  token: string,
  subdomain: string,
  signatureId: number
): Promise<DeleteSignatureAPIResponse> => {
  return axios
    .delete(`/api/v3/printerFlow/signatures/${signatureId}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const index = (
  token: string,
  subdomain: string,
  payload: IndexSignaturesPayload
): Promise<IndexSignaturesAPIResponse> => {
  return axios
    .get(`/api/v3/printerFlow/signatures?${toQueryString(payload)}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const refuse = (
  token: string,
  subdomain: string,
  signatureId: number,
  payload: RefuseSignaturePayload
): Promise<RefuseSignatureAPIResponse> => {
  return axios
    .put(`/api/v3/printerFlow/signatures/${signatureId}/refuse`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const sign = (
  token: string,
  subdomain: string,
  signatureId: number
): Promise<SignSignatureAPIResponse> => {
  return axios
    .put(
      `/api/v3/printerFlow/signatures/${signatureId}/sign`,
      {},
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const show = (
  token: string,
  subdomain: string,
  signatureId: number
): Promise<ShowSignatureAPIResponse> => {
  return axios
    .get(`/api/v3/printerFlow/signatures/${signatureId}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

export const SignatureService = {
  create,
  countByStatus,
  deleteSignature,
  index,
  refuse,
  sign,
  show,
};
