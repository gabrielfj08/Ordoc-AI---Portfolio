import axios from 'axios';
import { toQueryString } from '../../utils';
import {
  BaseField,
  IndexFieldParams,
  BaseFieldPayload,
  AttachDocumentTemplatePayload,
  DetachDocumentTemplatePayload,
  IndexFields,
} from './types';

const create = (
  token: string,
  subdomain: string,
  id: number,
  payload: BaseFieldPayload
): Promise<BaseField> => {
  return axios
    .post(`/api/v3/printerFlow/procedureTemplates/${id}/fields`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const deleteField = (
  token: string,
  subdomain: string,
  id: number,
  fieldId: number
): Promise<BaseField> => {
  return axios
    .delete(`/api/v3/printerFlow/procedureTemplates/${id}/fields/${fieldId}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const index = (
  token: string,
  subdomain: string,
  id: number,
  params: IndexFieldParams
): Promise<IndexFields> => {
  return axios
    .get(
      `/api/v3/printerFlow/procedureTemplates/${id}/fields?${toQueryString(
        params
      )}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => {
      return {
        fields: response.data.fields,
        meta: response.data.meta,
      };
    });
};

const update = (
  token: string,
  subdomain: string,
  id: number,
  fieldId: number,
  payload: BaseFieldPayload
): Promise<BaseField> => {
  return axios
    .put(
      `/api/v3/printerFlow/procedureTemplates/${id}/fields/${fieldId}`,
      payload,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const attachDocumentTemplate = (
  token: string,
  subdomain: string,
  id: number,
  payload: AttachDocumentTemplatePayload
): Promise<BaseField> => {
  return axios
    .put(`/api/v3/printerFlow/fields/${id}/attachDocumentTemplate`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const detachDocumentTemplate = (
  token: string,
  subdomain: string,
  id: number,
  payload: DetachDocumentTemplatePayload
): Promise<BaseField> => {
  return axios
    .put(`/api/v3/printerFlow/fields/${id}/detachDocumentTemplate`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

export const FieldService = {
  create,
  deleteField,
  index,
  update,
  attachDocumentTemplate,
  detachDocumentTemplate,
};
