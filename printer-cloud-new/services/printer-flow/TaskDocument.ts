import { toQueryString } from '../../utils';
import axios from 'axios';
import {
  CreateTaskDocumentAPIResponse,
  CreateTaskDocumentPayload,
  CreateTaskDocumentV4APIResponse,
  CreateTaskDocumentV4Payload,
  IndexTaskDocumentsAPIResponse,
  IndexTaskDocumentPayload,
  DeleteTaskDocumentAPIResponse,
  ShowTaskDocumentAPIResponse,
} from './types';

const create = (
  token: string,
  subdomain: string,
  taskId: number,
  payload: CreateTaskDocumentPayload
): Promise<CreateTaskDocumentAPIResponse> => {
  return axios
    .post(`/api/v3/printerFlow/tasks/${taskId}/taskDocuments`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const createV4 = (
  token: string,
  subdomain: string,
  taskId: number,
  payload: CreateTaskDocumentV4Payload
): Promise<CreateTaskDocumentV4APIResponse> => {
  return axios
    .post(`/api/v4/printerFlow/tasks/${taskId}/taskDocuments`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const deleteTaskDocument = (
  token: string,
  subdomain: string,
  taskId: number,
  taskDocumentId: number
): Promise<DeleteTaskDocumentAPIResponse> => {
  return axios
    .delete(
      `/api/v3/printerFlow/tasks/${taskId}/taskDocuments/${taskDocumentId}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const index = (
  token: string,
  subdomain: string,
  params: IndexTaskDocumentPayload
): Promise<IndexTaskDocumentsAPIResponse> => {
  return axios
    .get(`/api/v3/printerFlow/taskDocuments?${toQueryString(params)}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const show = (
  token: string,
  subdomain: string,
  taskId: number,
  taskDocumentId: number
): Promise<ShowTaskDocumentAPIResponse> => {
  return axios
    .get(
      `/api/v3/printerFlow/tasks/${taskId}/taskDocuments/${taskDocumentId}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

export const TaskDocumentService = {
  create,
  createV4,
  deleteTaskDocument,
  index,
  show,
};
