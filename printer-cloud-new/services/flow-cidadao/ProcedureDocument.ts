import axios from 'axios';
import {
  CreateProcedureDocumentAPIResponse,
  CreateProcedureDocumentPayload,
  DeleteProcedureDocumentAPIResponse,
  IndexProcedureDocumentsParams,
  IndexProcedureDocumentsAPIResponse,
  ShowProcedureDocumentAPIResponse,
} from './types';
import { toQueryString } from '../../utils';

const create = (
  token: string,
  subdomain: string,
  procedureId: number,
  payload: CreateProcedureDocumentPayload
): Promise<CreateProcedureDocumentAPIResponse> => {
  return axios
    .post(
      `/api/v3/flowCidadao/external/procedures/${procedureId}/procedureDocuments`,
      payload,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const deleteDocument = (
  token: string,
  subdomain: string,
  procedureId: number,
  documentId: number
): Promise<DeleteProcedureDocumentAPIResponse> => {
  return axios
    .delete(
      `/api/v3/flowCidadao/external/procedures/${procedureId}/procedureDocuments/delete/${documentId}`,
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
      `/api/v3/flowCidadao/external/procedures/${procedureId}/procedureDocuments?${toQueryString(
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
      `/api/v3/flowCidadao/external/procedures/${procedureId}/procedureDocuments/${uuid}`,
      { headers: { token, 'X-Api-Subdomain': subdomain } }
    )
    .then((response) => response.data);
};

export const ExternalProcedureDocumentService = {
  create,
  deleteDocument,
  index,
  show,
};
