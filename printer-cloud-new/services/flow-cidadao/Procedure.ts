import axios from 'axios';
import { toQueryString } from '../../utils';
import {
  CreateExternalProcedureAPIResponse,
  CreateExternalProcedurePayload,
  IndexExternalProcedureParams,
  IndexExternalProceduresAPIResponse,
  RunExternalProcedureAPIResponse,
  RequestFinishProcedureAPIResponse,
  RequestFinishProcedurePayload,
  ShowExternalProcedureAPIResponse,
  UpdateExternalProcedureAPIResponse,
  UpdateExternalProcedurePayload,
} from './types';

const create = (
  token: string,
  subdomain: string,
  payload: CreateExternalProcedurePayload
): Promise<CreateExternalProcedureAPIResponse> => {
  return axios
    .post(`/api/v3/flowCidadao/external/procedures`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const index = (
  token: string,
  subdomain: string,
  params: IndexExternalProcedureParams
): Promise<IndexExternalProceduresAPIResponse> => {
  return axios
    .get(`/api/v3/flowCidadao/external/procedures?${toQueryString(params)}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const run = (
  token: string,
  subdomain: string,
  procedureId: number
): Promise<RunExternalProcedureAPIResponse> => {
  return axios
    .put(
      `/api/v3/flowCidadao/external/procedures/${procedureId}/run`,
      {},
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const requestFinish = (
  token: string,
  subdomain: string,
  procedureId: number,
  payload: RequestFinishProcedurePayload
): Promise<RequestFinishProcedureAPIResponse> => {
  return axios
    .post(
      `/api/v3/flowCidadao/external/procedures/${procedureId}/requestFinish`,
      payload,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const show = (
  token: string,
  subdomain: string,
  procedureId: number
): Promise<ShowExternalProcedureAPIResponse> => {
  return axios
    .get(`/api/v3/flowCidadao/external/procedures/${procedureId}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const update = (
  token: string,
  subdomain: string,
  procedureId: number,
  payload: UpdateExternalProcedurePayload
): Promise<UpdateExternalProcedureAPIResponse> => {
  return axios
    .put(`/api/v3/flowCidadao/external/procedures/${procedureId}`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

export const ExternalProcedureService = {
  create,
  index,
  run,
  requestFinish,
  show,
  update,
};
