import axios from 'axios';
import { toQueryString } from '../../utils';
import { CreateProcedureTemplateDocumentPayload } from './types';
import {
  BaseProcedureTemplateDocument,
  CreateProcedureTemplateDocumentAPIResponse,
  IndexProcedureTemplateDocuments,
  IndexProcedureTemplateDocumentsPayload,
  ShowProcedureTemplateDocument,
} from './types';

const create = (
  token: string,
  subdomain: string,
  id: number,
  payload: CreateProcedureTemplateDocumentPayload
): Promise<CreateProcedureTemplateDocumentAPIResponse> => {
  return axios
    .post(
      `/api/v3/printerFlow/procedureTemplates/${id}/procedureTemplateDocuments`,
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
  id: number,
  params: IndexProcedureTemplateDocumentsPayload
): Promise<IndexProcedureTemplateDocuments> => {
  return axios
    .get(
      `/api/v3/printerFlow/procedureTemplates/${id}/procedureTemplateDocuments?${toQueryString(
        params
      )}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const remove = (
  token: string,
  subdomain: string,
  id: number,
  procedureTemplateDocumentId: number
): Promise<BaseProcedureTemplateDocument> => {
  return axios
    .delete(
      `/api/v3/printerFlow/procedureTemplates/${id}/procedureTemplateDocuments/${procedureTemplateDocumentId}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const show = (
  token: string,
  subdomain: string,
  id: number,
  procedureTemplateDocumentId: number
): Promise<ShowProcedureTemplateDocument> => {
  return axios
    .get(
      `/api/v3/printerFlow/procedureTemplates/${id}/procedureTemplateDocuments/${procedureTemplateDocumentId}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

export const ProcedureTemplateDocumentService = {
  create,
  index,
  remove,
  show,
};
