import axios from 'axios';
import { toQueryString } from '../../utils';
import {} from './types';
import {
  BaseProcedureTemplate,
  CreateProcedureTemplatePayload,
  DeactivateProcedureTemplatePayload,
  IndexProcedureTemplateAPIResponse,
  IndexProcedureTemplatePayload,
  ShowProcedureTemplate,
  UpdateProcedureTemplate,
  UpdateProcedureTemplatePayload,
} from './types';

const activate = (
  token: string,
  subdomain: string,
  id: number
): Promise<BaseProcedureTemplate> => {
  return axios
    .put(
      `/api/v3/printerFlow/procedureTemplates/${id}/activate`,
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
  payload: CreateProcedureTemplatePayload
): Promise<BaseProcedureTemplate> => {
  return axios
    .post(`/api/v3/printerFlow/procedureTemplates`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const deactivate = (
  token: string,
  subdomain: string,
  id: number,
  payload: DeactivateProcedureTemplatePayload
): Promise<BaseProcedureTemplate> => {
  return axios
    .put(`/api/v3/printerFlow/procedureTemplates/${id}/deactivate`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const index = (
  token: string,
  subdomain: string,
  params: IndexProcedureTemplatePayload
): Promise<IndexProcedureTemplateAPIResponse> => {
  return axios
    .get(`/api/v3/printerFlow/procedureTemplates?${toQueryString(params)}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const show = (
  token: string,
  subdomain: string,
  id: number
): Promise<ShowProcedureTemplate> => {
  return axios
    .get(`/api/v3/printerFlow/procedureTemplates/${id}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const update = (
  token: string,
  subdomain: string,
  id: number,
  payload: UpdateProcedureTemplatePayload
): Promise<UpdateProcedureTemplate> => {
  return axios
    .put(`/api/v3/printerFlow/procedureTemplates/${id}`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

export const ProcedureTemplateService = {
  activate,
  create,
  deactivate,
  index,
  show,
  update,
};
