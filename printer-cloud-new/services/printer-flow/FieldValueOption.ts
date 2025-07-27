import axios from 'axios';
import {
  BaseFieldValueOption,
  BaseFieldValueOptionPayload,
  IndexFieldValueOptions,
} from './types';

const create = (
  token: string,
  subdomain: string,
  id: number,
  payload: BaseFieldValueOptionPayload
): Promise<BaseFieldValueOption> => {
  return axios
    .post(`/api/v3/printerFlow/fields/${id}/fieldValueOptions`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const index = (
  token: string,
  subdomain: string,
  id: number
): Promise<IndexFieldValueOptions> => {
  return axios
    .get(`/api/v3/printerFlow/fields/${id}/fieldValueOptions`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const show = (
  token: string,
  subdomain: string,
  id: number,
  fieldValueOptionId: number
): Promise<BaseFieldValueOption> => {
  return axios
    .get(
      `/api/v3/printerFlow/fields/${id}/fieldValueOptions/${fieldValueOptionId}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const update = (
  token: string,
  subdomain: string,
  id: number,
  fieldValueOptionId: number,
  payload: BaseFieldValueOptionPayload
): Promise<BaseFieldValueOption> => {
  return axios
    .put(
      `/api/v3/printerFlow/fields/${id}/fieldValueOptions/${fieldValueOptionId}`,
      payload,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const deleteFieldValueOption = (
  token: string,
  subdomain: string,
  id: number,
  fieldValueOptionId: number
): Promise<BaseFieldValueOption> => {
  return axios
    .delete(
      `/api/v3/printerFlow/fields/${id}/fieldValueOptions/${fieldValueOptionId}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

export const FieldValueOptionService = {
  create,
  index,
  show,
  update,
  deleteFieldValueOption,
};
