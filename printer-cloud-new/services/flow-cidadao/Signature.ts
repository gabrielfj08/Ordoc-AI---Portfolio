import axios from 'axios';
import { toQueryString } from '../../utils';
import {
  IndexExternalSignaturesAPIResponse,
  IndexExternalSignatureParams,
  ShowExternalSignatureAPIResponse,
  SignExternalSignatureAPIResponse,
  RefuseExternalSignaturePayload,
  RefuseExternalSignatureAPIResponse,
} from './types';

const index = (
  token: string,
  subdomain: string,
  params: IndexExternalSignatureParams
): Promise<IndexExternalSignaturesAPIResponse> => {
  return axios
    .get(`/api/v3/flowCidadao/external/signatures?${toQueryString(params)}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const show = (
  token: string,
  subdomain: string,
  signatureId: number
): Promise<ShowExternalSignatureAPIResponse> => {
  return axios
    .get(`/api/v3/flowCidadao/external/signatures/${signatureId}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const sign = (
  token: string,
  subdomain: string,
  signatureId: number
): Promise<SignExternalSignatureAPIResponse> => {
  return axios
    .put(
      `/api/v3/flowCidadao/external/signatures/${signatureId}/sign`,
      {},
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const refuse = (
  token: string,
  subdomain: string,
  signatureId: number,
  payload: RefuseExternalSignaturePayload
): Promise<RefuseExternalSignatureAPIResponse> => {
  return axios
    .put(
      `/api/v3/flowCidadao/external/signatures/${signatureId}/refuse`,
      payload,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

export const ExternalSignatureService = {
  index,
  show,
  sign,
  refuse,
};
