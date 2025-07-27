import axios from 'axios';
import { toQueryString } from '../../utils';
import {
  IndexExternalTaskDocumentsParams,
  IndexExternalTaskDocumentsAPIResponse,
  CreateExternalTaskDocumentPayload,
  CreateExternalTaskDocumentAPIResponse,
  ShowExternalTaskDocumentAPIResponse,
} from './types';
import { DeleteExternalTaskDocumentAPIResponse } from './types/taskDocument';

const create = (
  token: string,
  subdomain: string,
  taskId: number,
  payload: CreateExternalTaskDocumentPayload
): Promise<CreateExternalTaskDocumentAPIResponse> => {
  return axios
    .post(
      `/api/v3/flowCidadao/external/tasks/${taskId}/taskDocuments`,
      payload,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const deleteTaskDocument = (
  token: string,
  subdomain: string,
  taskId: number,
  taskDocumentId: number
): Promise<DeleteExternalTaskDocumentAPIResponse> => {
  return axios
    .delete(
      `/api/v3/flowCidadao/external/tasks/${taskId}/taskDocuments/${taskDocumentId}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const index = (
  token: string,
  subdomain: string,
  params: IndexExternalTaskDocumentsParams
): Promise<IndexExternalTaskDocumentsAPIResponse> => {
  return axios
    .get(
      `/api/v3/flowCidadao/external/taskDocuments?${toQueryString(params)}`,
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
  taskDocumentId: number
): Promise<ShowExternalTaskDocumentAPIResponse> => {
  return axios
    .get(
      `/api/v3/flowCidadao/external/tasks/${taskId}/taskDocuments/${taskDocumentId}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

export const ExternalTaskDocumentService = {
  create,
  deleteTaskDocument,
  index,
  show,
};
