import axios from 'axios';
import { toQueryString } from '../../utils';
import {
  ActivateTaskTemplateAPIResponse,
  CreateTaskTemplateAPIResponse,
  CreateTaskTemplatePayload,
  DeactivateTaskTemplateAPIResponse,
  DeactivateTaskTemplatePayload,
  IndexTaskTemplatesAPIResponse,
  IndexTaskTemplatesPayload,
  ShowTaskTemplateAPIResponse,
  UpdateTaskTemplateAPIResponse,
  UpdateTaskTemplatePayload,
} from './types';

const activate = (
  token: string,
  subdomain: string,
  taskTemplateId: number
): Promise<ActivateTaskTemplateAPIResponse> => {
  return axios
    .put(
      `/api/v3/printerFlow/taskTemplates/${taskTemplateId}/activate`,
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
  payload: CreateTaskTemplatePayload
): Promise<CreateTaskTemplateAPIResponse> => {
  return axios
    .post(`/api/v3/printerFlow/taskTemplates`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const deactivate = (
  token: string,
  subdomain: string,
  taskTemplateId: number,
  payload: DeactivateTaskTemplatePayload
): Promise<DeactivateTaskTemplateAPIResponse> => {
  return axios
    .put(
      `/api/v3/printerFlow/taskTemplates/${taskTemplateId}/deactivate`,
      payload,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const index = (
  token: string,
  subdomain: string,
  params: IndexTaskTemplatesPayload
): Promise<IndexTaskTemplatesAPIResponse> => {
  return axios
    .get(`/api/v3/printerFlow/taskTemplates?${toQueryString(params)}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const show = (
  token: string,
  subdomain: string,
  taskTemplateId: number
): Promise<ShowTaskTemplateAPIResponse> => {
  return axios
    .get(`/api/v3/printerFlow/taskTemplates/${taskTemplateId}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const update = (
  token: string,
  subdomain: string,
  taskTemplateId: number,
  payload: UpdateTaskTemplatePayload
): Promise<UpdateTaskTemplateAPIResponse> => {
  return axios
    .put(`/api/v3/printerFlow/taskTemplates/${taskTemplateId}`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

export const TaskTemplateService = {
  activate,
  create,
  deactivate,
  index,
  show,
  update,
};
