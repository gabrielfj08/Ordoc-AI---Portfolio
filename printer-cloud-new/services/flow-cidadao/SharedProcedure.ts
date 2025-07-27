import axios from 'axios';
import { toQueryString } from '../../utils';
import {
  AcceptSharedProcedureAPIResponse,
  CreateSharedProcedureAPIResponse,
  CreateSharedProcedurePayload,
  DestroySharedProcedureAPIResponse,
  IndexSharedProceduresAPIResponse,
  IndexSharedProceduresParams,
  RefuseSharedProcedureAPIResponse,
  RefuseSharedProcedurePayload,
} from './types';

const accept = (
  token: string,
  subdomain: string,
  sharedProcedureId: number
): Promise<AcceptSharedProcedureAPIResponse> => {
  return axios
    .put(
      `/api/v3/flowCidadao/external/sharedProcedures/${sharedProcedureId}/accept`,
      {},
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const create = (
  token: string,
  subdomain: string,
  payload: CreateSharedProcedurePayload
): Promise<CreateSharedProcedureAPIResponse> => {
  return axios
    .post(`/api/v3/flowCidadao/external/sharedProcedures`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const destroy = (
  token: string,
  subdomain: string,
  sharedProcedureId: number
): Promise<DestroySharedProcedureAPIResponse> => {
  return axios
    .delete(
      `/api/v3/flowCidadao/external/sharedProcedures/${sharedProcedureId}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const index = (
  token: string,
  subdomain: string,
  params: IndexSharedProceduresParams
): Promise<IndexSharedProceduresAPIResponse> => {
  return axios
    .get(
      `/api/v3/flowCidadao/external/sharedProcedures?${toQueryString(params)}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const refuse = (
  token: string,
  subdomain: string,
  sharedProcedureId: number,
  payload: RefuseSharedProcedurePayload
): Promise<RefuseSharedProcedureAPIResponse> => {
  return axios
    .put(
      `/api/v3/flowCidadao/external/sharedProcedures/${sharedProcedureId}/refuse`,
      payload,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

export const ExternalSharedProceduresService = {
  accept,
  create,
  destroy,
  index,
  refuse,
};
