import axios from 'axios';
import { toQueryString } from '../../utils';
import {
  CreateProcedureDocumentPayload,
  CreateProcedureDocumentAPIResponse,
  IndexProcedureDocumentsAPIResponse,
  ShowProcedureDocumentAPIResponse,
  DeleteProcedureDocumentAPIResponse,
  IndexProcedureDocumentsParams,
} from './types';

const create = (
  token: string,
  subdomain: string,
  procedureId: number,
  payload: CreateProcedureDocumentPayload
): Promise<CreateProcedureDocumentAPIResponse> => {
  return axios
    .post(
      `/api/v3/printerFlow/procedures/${procedureId}/procedureDocuments`,
      payload,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const index = (
  token: string,
  subdomain: string,
  procedureId: number,
  params: IndexProcedureDocumentsParams
): Promise<IndexProcedureDocumentsAPIResponse> => {
  return axios
    .get(
      `/api/v3/printerFlow/procedures/${procedureId}/procedureDocuments?${toQueryString(
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
  procedureId: number,
  uuid: string
): Promise<ShowProcedureDocumentAPIResponse> => {
  return axios
    .get(
      `/api/v3/printerFlow/procedures/${procedureId}/procedureDocuments/${uuid}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const deleteProcedureDocument = (
  token: string,
  subdomain: string,
  procedureId: number,
  procedureDocumentId: number
): Promise<DeleteProcedureDocumentAPIResponse> => {
  return axios
    .delete(
      `/api/v3/printerFlow/procedures/${procedureId}/procedureDocuments/delete/${procedureDocumentId}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

export const ProcedureDocumentService = {
  create,
  index,
  show,
  deleteProcedureDocument,
};
