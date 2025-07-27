import { toQueryString } from '../../utils';
import axios from 'axios';
import { IndexProceduresAPIResponse, IndexProceduresPayload } from './types';
import {
  CreateProcedureAPIResponse,
  CreateProcedurePayload,
  ShowProcedureAPIResponse,
  ArchiveProcedurePayload,
  UnarchiveProcedurePayload,
  UpdateProcedureAPIResponse,
  UpdateProcedurePayload,
  CountProceduresByStatusAPIResponse,
  CountProcedureByStatusPayload,
} from './types';

const create = (
  token: string,
  subdomain: string,
  groupRequesterId: number,
  payload: CreateProcedurePayload
): Promise<CreateProcedureAPIResponse> => {
  return axios.post(
    `/api/v3/printerFlow/groupRequesters/${groupRequesterId}/procedures`,
    payload,
    {
      headers: { token, 'X-Api-Subdomain': subdomain },
    }
  );
};

const countByStatus = (
  token: string,
  subdomain: string,
  params: CountProcedureByStatusPayload
): Promise<CountProceduresByStatusAPIResponse> => {
  return axios
    .get(
      `/api/v3/printerFlow/procedures/countByStatus?${toQueryString(params)}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const archive = (
  token: string,
  subdomain: string,
  groupRequesterId: number,
  procedureId: number,
  payload: ArchiveProcedurePayload
): Promise<UpdateProcedureAPIResponse> => {
  return axios
    .put(
      `/api/v3/printerFlow/groupRequesters/${groupRequesterId}/procedures/${procedureId}/archive`,
      payload,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const finish = (
  token: string,
  subdomain: string,
  groupRequesterId: number,
  procedureId: number
): Promise<UpdateProcedureAPIResponse> => {
  return axios
    .put(
      `/api/v3/printerFlow/groupRequesters/${groupRequesterId}/procedures/${procedureId})/finish`,
      {},
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const index = (
  token: string,
  subdomain: string,
  params: IndexProceduresPayload
): Promise<IndexProceduresAPIResponse> => {
  return axios
    .get(`/api/v3/printerFlow/procedures?${toQueryString(params)}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const show = (
  token: string,
  subdomain: string,
  groupRequesterId: number,
  procedureId: number
): Promise<ShowProcedureAPIResponse> => {
  return axios
    .get(
      `/api/v3/printerFlow/groupRequesters/${groupRequesterId}/procedures/${procedureId})`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const unarchive = (
  token: string,
  subdomain: string,
  groupRequesterId: number,
  procedureId: number,
  payload: UnarchiveProcedurePayload
): Promise<UpdateProcedureAPIResponse> => {
  return axios
    .put(
      `/api/v3/printerFlow/groupRequesters/${groupRequesterId}/procedures/${procedureId})/unarchive`,
      payload,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const update = (
  token: string,
  subdomain: string,
  groupRequesterId: number,
  procedureId: number,
  updateProcedurePayload: UpdateProcedurePayload
): Promise<UpdateProcedureAPIResponse> => {
  return axios
    .put(
      `/api/v3/printerFlow/groupRequesters/${groupRequesterId}/procedures/${procedureId})`,
      updateProcedurePayload,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

export const ProcedureService = {
  create,
  countByStatus,
  archive,
  finish,
  index,
  show,
  unarchive,
  update,
};
