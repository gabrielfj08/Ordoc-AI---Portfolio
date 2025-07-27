import axios from 'axios';
import { toQueryString } from '../../utils';
import {
  ActivateRequesterAPIResponse,
  DeactivateRequesterAPIResponse,
  DeactivateRequesterPayload,
  IndexRequestersAPIResponse,
  IndexRequestersPayload,
  ShowRequesterAPIResponse,
  UpdateRequesterAPIResponse,
  UpdateRequesterPayload,
} from './types';

const activate = (
  token: string,
  subdomain: string,
  id: number
): Promise<ActivateRequesterAPIResponse> => {
  return axios
    .put(
      `/api/v3/printerFlow/requesters/${id}/activate`,
      {},
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const deactivate = (
  token: string,
  subdomain: string,
  id: number,
  payload: DeactivateRequesterPayload
): Promise<DeactivateRequesterAPIResponse> => {
  return axios
    .put(`/api/v3/printerFlow/requesters/${id}/deactivate`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const index = (
  token: string,
  subdomain: string,
  payload: IndexRequestersPayload
): Promise<IndexRequestersAPIResponse> => {
  return axios
    .get(`/api/v3/printerFlow/requesters?${toQueryString(payload)}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const show = (
  token: string,
  subdomain: string,
  id: number
): Promise<ShowRequesterAPIResponse> => {
  return axios
    .get(`/api/v3/printerFlow/requesters/${id}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const update = (
  token: string,
  subdomain: string,
  id: number,
  payload: UpdateRequesterPayload
): Promise<UpdateRequesterAPIResponse> => {
  return axios
    .put(`/api/v3/printerFlow/requesters/${id}`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

export const RequesterService = {
  activate,
  deactivate,
  index,
  show,
  update,
};
