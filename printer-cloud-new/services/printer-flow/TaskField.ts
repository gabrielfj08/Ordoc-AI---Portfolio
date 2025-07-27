import axios from 'axios';
import { toQueryString } from '../../utils';
import {
  CreateTaskFieldAPIResponse,
  CreateTaskFieldPayload,
  DeleteTaskFieldAPIResponse,
  IndexTaskFieldsAPIResponse,
  IndexTaskFieldsPayload,
  ShowTaskFieldAPIResponse,
  UpdateTaskFieldAPIResponse,
  UpdateTaskFieldPayload,
} from './types';

const create = (
  token: string,
  subdomain: string,
  taskTemplateId: number,
  payload: CreateTaskFieldPayload
): Promise<CreateTaskFieldAPIResponse> => {
  return axios.post(
    `/api/v3/printerFlow/taskTemplates/${taskTemplateId}/taskFields`,
    payload,
    {
      headers: { token, 'X-Api-Subdomain': subdomain },
    }
  );
};

const deleteTaskField = (
  token: string,
  subdomain: string,
  taskTemplateId: number,
  taskFieldId: number
): Promise<DeleteTaskFieldAPIResponse> => {
  return axios
    .delete(
      `/api/v3/printerFlow/taskTemplates/${taskTemplateId}/taskFields/${taskFieldId}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const index = (
  token: string,
  subdomain: string,
  taskTemplateId: number,
  params: IndexTaskFieldsPayload
): Promise<IndexTaskFieldsAPIResponse> => {
  return axios
    .get(
      `/api/v3/printerFlow/taskTemplates/${taskTemplateId}/taskFields?${toQueryString(
        params
      )}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const show = (
  token: string,
  subdomain: string,
  taskTemplateId: number,
  taskFieldId: number
): Promise<ShowTaskFieldAPIResponse> => {
  return axios
    .get(
      `/api/v3/printerFlow/taskTemplates/${taskTemplateId}/taskFields/${taskFieldId}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const update = (
  token: string,
  subdomain: string,
  taskTemplateId: number,
  taskFieldId: number,
  payload: UpdateTaskFieldPayload
): Promise<UpdateTaskFieldAPIResponse> => {
  return axios
    .put(
      `/api/v3/printerFlow/taskTemplates/${taskTemplateId}/taskFields/${taskFieldId}`,
      payload,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

export const TaskFieldService = {
  create,
  deleteTaskField,
  index,
  show,
  update,
};
