import axios from 'axios';
import { toQueryString } from '../../utils';
import {
  IndexDocumentsAPIResponse,
  IndexDocumentsPayload,
  MoveDocumentAPIResponse,
  MoveDocumentPayload,
  ShowDocumentAPIResponse,
  TrashDocumentAPIResponse,
  TrashDocumentPayload,
  UpdateDocumentAPIResponse,
  UpdateDocumentPayload,
  DocumentOCRAPIResponse,
  DocumentOCRPayload,
  RestoreDocumentsPayload,
  RestoreDocumentsAPIResponse,
  SearchDocumentsAPIResponse,
} from './types';
import {
  ShareDocumentAPIResponse,
  ShareDocumentPayload,
} from './types/document';

const index = (
  token: string,
  subdomain: string,
  payload: IndexDocumentsPayload
): Promise<IndexDocumentsAPIResponse> => {
  return axios
    .get(`/api/v3/printerAir/documents?${toQueryString(payload)}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => {
      return {
        documents: response.data.documents,
        meta: response.data.meta,
      };
    });
};

const move = (
  token: string,
  subdomain: string,
  organizationId: number,
  payload: MoveDocumentPayload
): Promise<MoveDocumentAPIResponse> => {
  return axios
    .post(
      `/api/v3/printerAir/organizations/${organizationId}/documents/move`,
      payload,
      { headers: { token, 'X-Api-Subdomain': subdomain } }
    )
    .then((response) => response.data);
};

const share = (
  token: string,
  subdomain: string,
  organizationId: number,
  payload: ShareDocumentPayload
): Promise<ShareDocumentAPIResponse> => {
  return axios
    .post(
      `/api/v3/printerAir/organizations/${organizationId}/documents/share`,
      payload,
      { headers: { token, 'X-Api-Subdomain': subdomain } }
    )
    .then((response) => response.data);
};

const ocr = (
  token: string,
  subdomain: string,
  payload: DocumentOCRPayload
): Promise<DocumentOCRAPIResponse> => {
  return axios
    .post(`/api/v3/printerAir/documents/ocr`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const restore = (
  token: string,
  subdomain: string,
  organizationId: number,
  payload: RestoreDocumentsPayload
): Promise<RestoreDocumentsAPIResponse> => {
  return axios
    .post(
      `/api/v3/printerAir/organizations/${organizationId}/documents/restore`,
      payload,
      { headers: { token, 'X-Api-Subdomain': subdomain } }
    )
    .then((response) => response.data);
};

const show = (
  token: string,
  subdomain: string,
  documentId: number
): Promise<ShowDocumentAPIResponse> => {
  return axios
    .get(`/api/v3/printerAir/documents/${documentId}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const trash = (
  token: string,
  subdomain: string,
  organizationId: number,
  payload: TrashDocumentPayload
): Promise<TrashDocumentAPIResponse> => {
  return axios
    .post(
      `/api/v3/printerAir/organizations/${organizationId}/documents/trash`,
      payload,
      { headers: { token, 'X-Api-Subdomain': subdomain } }
    )
    .then((response) => response.data);
};

const update = (
  token: string,
  subdomain: string,
  documentId: number,
  payload: UpdateDocumentPayload
): Promise<UpdateDocumentAPIResponse> => {
  return axios
    .put(`/api/v3/printerAir/documents/${documentId}`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const search = (
  token: string,
  subdomain: string,
  queryString: string
): Promise<SearchDocumentsAPIResponse> => {
  return axios
    .get(`/api/v3/printerAir/documents/search?${queryString}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

export const DocumentService = {
  index,
  move,
  share,
  restore,
  show,
  trash,
  update,
  ocr,
  search,
};
