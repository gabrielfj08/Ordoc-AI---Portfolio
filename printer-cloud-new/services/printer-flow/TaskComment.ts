import axios from 'axios';
import { toQueryString } from '../../utils';
import {
  CreateTaskCommentAPIResponse,
  CreateTaskCommentPayload,
  DeleteTaskCommentAPIResponse,
  IndexTaskCommentsAPIResponse,
  ShowTaskCommentAPIResponse,
  TaskCommentPayload,
  UpdateTaskCommentAPIResponse,
  UpdateTaskCommentPayload,
} from './types';

const create = (
  token: string,
  subdomain: string,
  taskId: number,
  payload: CreateTaskCommentPayload
): Promise<CreateTaskCommentAPIResponse> => {
  return axios
    .post(`/api/v3/printerFlow/tasks/${taskId}/taskComments`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const deleteComment = (
  token: string,
  subdomain: string,
  taskId: number,
  id: number
): Promise<DeleteTaskCommentAPIResponse> => {
  return axios
    .delete(`/api/v3/printerFlow/tasks/${taskId}/taskComments/${id}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const index = (
  token: string,
  subdomain: string,
  taskId: number,
  params: TaskCommentPayload
): Promise<IndexTaskCommentsAPIResponse> => {
  return axios
    .get(
      `/api/v3/printerFlow/tasks/${taskId}/taskComments?${toQueryString(
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
  taskId: number,
  id: number
): Promise<ShowTaskCommentAPIResponse> => {
  return axios
    .get(`/api/v3/printerFlow/tasks/${taskId}/taskComments/${id}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const update = (
  token: string,
  subdomain: string,
  taskId: number,
  id: number,
  payload: UpdateTaskCommentPayload
): Promise<UpdateTaskCommentAPIResponse> => {
  return axios
    .put(`/api/v3/printerFlow/tasks/${taskId}/taskComments/${id}`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

export const TaskCommentService = {
  create,
  deleteComment,
  index,
  show,
  update,
};
