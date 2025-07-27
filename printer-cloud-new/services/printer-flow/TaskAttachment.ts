import axios from 'axios';
import { toQueryString } from '../../utils';
import {
  CreateTaskAttachmentAPIResponse,
  CreateTaskAttachmentPayload,
  DeleteTaskAttachmentAPIResponse,
  IndexTaskAttachmentsAPIResponse,
  IndexTaskAttachmentPayload,
  ShowTaskAttachmentAPIResponse,
} from './types';

const create = (
  token: string,
  subdomain: string,
  payload: CreateTaskAttachmentPayload
): Promise<CreateTaskAttachmentAPIResponse> => {
  return axios
    .post(`/api/v3/printerFlow/taskAttachments`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const deleteTaskAttachment = (
  token: string,
  subdomain: string,
  taskAttachmentId: number
): Promise<DeleteTaskAttachmentAPIResponse> => {
  return axios
    .delete(`/api/v3/printerFlow/taskAttachments/${taskAttachmentId}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const index = (
  token: string,
  subdomain: string,
  payload: IndexTaskAttachmentPayload
): Promise<IndexTaskAttachmentsAPIResponse> => {
  return axios
    .get(`/api/v3/printerFlow/taskAttachments?${toQueryString(payload)}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const show = (
  token: string,
  subdomain: string,
  taskAttachmentId: number
): Promise<ShowTaskAttachmentAPIResponse> => {
  return axios
    .get(`/api/v3/printerFlow/taskAttachments/${taskAttachmentId}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

export const TaskAttachmentService = {
  create,
  deleteTaskAttachment,
  index,
  show,
};
