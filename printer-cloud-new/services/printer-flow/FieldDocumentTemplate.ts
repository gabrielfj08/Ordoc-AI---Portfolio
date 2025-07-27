import axios from 'axios';
import { toQueryString } from '../../utils';
import {
  IndexFieldDocumentTemplates,
  IndexFieldDocumentTemplatePayload,
  BaseFieldDocumentTemplate,
  CreateFieldDocumentTemplatePayload,
} from './types';

const create = (
  token: string,
  subdomain: string,
  payload: CreateFieldDocumentTemplatePayload
): Promise<BaseFieldDocumentTemplate> => {
  return axios
    .post(`/api/v3/printerFlow/fieldDocumentTemplates`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const index = (
  token: string,
  subdomain: string,
  params: IndexFieldDocumentTemplatePayload
): Promise<IndexFieldDocumentTemplates> => {
  return axios
    .get(
      `/api/v3/printerFlow/fieldDocumentTemplates?${toQueryString(params)}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const show = (
  token: string,
  subdomain: string,
  id: number
): Promise<BaseFieldDocumentTemplate> => {
  return axios
    .get(`/api/v3/printerFlow/fieldDocumentTemplates/${id}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

export const FieldDocumentTemplateService = {
  create,
  index,
  show,
};
