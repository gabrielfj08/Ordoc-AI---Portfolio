import axios from 'axios';
import { toQueryString } from '../../utils';
import {
  AcceptTaskAPIResponse,
  CreateTaskAPIResponse,
  CreateTaskPayload,
  DeleteTaskAPIResponse,
  IndexTasksAPIResponse,
  IndexTaskPayload,
  FinishTaskAPIResponse,
  RefuseTaskAPIResponse,
  RefuseTaskPayload,
  ResetTaskAssigneePayload,
  ResetTaskAssigneeAPIResponse,
  SetAssigneePayload,
  SetAssigneeTaskAPIResponse,
  ShowTaskAPIResponse,
  UpdateTaskAPIResponse,
  UpdateTaskPayload,
} from './types';

const accept = (
  token: string,
  subdomain: string,
  taskId: number
): Promise<AcceptTaskAPIResponse> => {
  return axios
    .put(
      `/api/v3/printerFlow/tasks/${taskId}/accept`,
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
  payload: CreateTaskPayload
): Promise<CreateTaskAPIResponse> => {
  return axios.post(`/api/v3/printerFlow/tasks`, payload, {
    headers: { token, 'X-Api-Subdomain': subdomain },
  });
};

const deleteTask = (
  token: string,
  subdomain: string,
  taskId: number
): Promise<DeleteTaskAPIResponse> => {
  return axios
    .delete(`/api/v3/printerFlow/tasks/${taskId}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const finish = (
  token: string,
  subdomain: string,
  taskId: number
): Promise<FinishTaskAPIResponse> => {
  return axios
    .put(
      `/api/v3/printerFlow/tasks/${taskId}/finish`,
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
  params: IndexTaskPayload
): Promise<IndexTasksAPIResponse> => {
  return axios
    .get(`/api/v3/printerFlow/tasks?${toQueryString(params)}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const refuse = (
  token: string,
  subdomain: string,
  taskId: number,
  payload: RefuseTaskPayload
): Promise<RefuseTaskAPIResponse> => {
  return axios
    .put(`/api/v3/printerFlow/tasks/${taskId}/refuse`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const setAssignee = (
  token: string,
  subdomain: string,
  taskId: number,
  payload: SetAssigneePayload
): Promise<SetAssigneeTaskAPIResponse> => {
  return axios
    .put(`/api/v3/printerFlow/tasks/${taskId}/setAssignee`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const show = (
  token: string,
  subdomain: string,
  taskId: number
): Promise<ShowTaskAPIResponse> => {
  return axios
    .get(`/api/v3/printerFlow/tasks/${taskId}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const update = (
  token: string,
  subdomain: string,
  taskId: number,
  payload: UpdateTaskPayload
): Promise<UpdateTaskAPIResponse> => {
  return axios
    .put(`/api/v3/printerFlow/tasks/${taskId}`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const resetAssignee = (
  token: string,
  subdomain: string,
  taskId: number,
  payload: ResetTaskAssigneePayload
): Promise<ResetTaskAssigneeAPIResponse> => {
  return axios
    .put(`/api/v3/printerFlow/tasks/${taskId}/resetAssignee`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

export const TaskService = {
  accept,
  create,
  deleteTask,
  finish,
  index,
  refuse,
  resetAssignee,
  setAssignee,
  show,
  update,
};
