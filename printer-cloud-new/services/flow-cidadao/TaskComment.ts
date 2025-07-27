import axios from 'axios';
import { toQueryString } from '../../utils';
import {
  CreateExternalTaskCommentAPIResponse,
  CreateExternalTaskCommentPayload,
  DeleteExternalTaskCommentAPIResponse,
  IndexExternalTaskCommentsAPIResponse,
  ShowExternalTaskCommentAPIResponse,
  TaskExternalCommentPayload,
  UpdateExternalTaskCommentAPIResponse,
  UpdateExternalTaskCommentPayload,
} from './types/taskComment';

const create = (
  token: string,
  subdomain: string,
  taskId: number,
  payload: CreateExternalTaskCommentPayload
): Promise<CreateExternalTaskCommentAPIResponse> => {
  return axios
    .post(
      `/api/v3/flowCidadao/external/tasks/${taskId}/taskComments`,
      payload,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const deleteComment = (
  token: string,
  subdomain: string,
  taskId: number,
  id: number
): Promise<DeleteExternalTaskCommentAPIResponse> => {
  return axios
    .delete(`/api/v3/flowCidadao/external/tasks/${taskId}/taskComments/${id}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const index = (
  token: string,
  subdomain: string,
  taskId: number,
  params: TaskExternalCommentPayload
): Promise<IndexExternalTaskCommentsAPIResponse> => {
  return axios
    .get(
      `/api/v3/flowCidadao/external/tasks/${taskId}/taskComments?${toQueryString(
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
): Promise<ShowExternalTaskCommentAPIResponse> => {
  return axios
    .get(`/api/v3/flowCidadao/external/tasks/${taskId}/taskComments/${id}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const update = (
  token: string,
  subdomain: string,
  taskId: number,
  id: number,
  payload: UpdateExternalTaskCommentPayload
): Promise<UpdateExternalTaskCommentAPIResponse> => {
  return axios
    .put(
      `/api/v3/flowCidadao/external/tasks/${taskId}/taskComments/${id}`,
      payload,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

export const ExternalTaskCommentService = {
  create,
  deleteComment,
  index,
  show,
  update,
};
