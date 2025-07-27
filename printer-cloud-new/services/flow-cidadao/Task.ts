import axios from 'axios';
import { toQueryString } from '../../utils';
import {
  IndexExternalTasksParams,
  IndexExternalTasksAPIResponse,
  ShowExternalTaskAPIResponse,
  AcceptExternalTaskAPIResponse,
  RefuseExternalTaskPayload,
  RefuseExternalTaskAPIResponse,
  FinishExternalTaskAPIResponse,
} from './types';

const accept = (
  token: string,
  subdomain: string,
  taskId: number
): Promise<AcceptExternalTaskAPIResponse> => {
  return axios
    .put(
      `/api/v3/flowCidadao/external/tasks/${taskId}/accept`,
      {},
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const finish = (
  token: string,
  subdomain: string,
  taskId: number
): Promise<FinishExternalTaskAPIResponse> => {
  return axios
    .put(
      `/api/v3/flowCidadao/external/tasks/${taskId}/finish`,
      {},
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const index = (
  token: string,
  subdomain: string,
  params: IndexExternalTasksParams
): Promise<IndexExternalTasksAPIResponse> => {
  return axios
    .get(`/api/v3/flowCidadao/external/tasks?${toQueryString(params)}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const refuse = (
  token: string,
  subdomain: string,
  taskId: number,
  payload: RefuseExternalTaskPayload
): Promise<RefuseExternalTaskAPIResponse> => {
  return axios
    .put(`/api/v3/flowCidadao/external/tasks/${taskId}/refuse`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const show = (
  token: string,
  subdomain: string,
  taskId: number
): Promise<ShowExternalTaskAPIResponse> => {
  return axios
    .get(`/api/v3/flowCidadao/external/tasks/${taskId}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

export const ExternalTaskService = {
  accept,
  finish,
  index,
  refuse,
  show,
};
