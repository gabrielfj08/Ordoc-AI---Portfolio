import axios from 'axios';
import {
  CreateDocumentCopyAPIResponse,
  ShowDocumentCopyAPIResponse,
} from './types';

const create = (
  token: string,
  subdomain: string,
  documentId: number
): Promise<CreateDocumentCopyAPIResponse> => {
  return axios
    .post(
      `/api/v3/printerAir/documents/${documentId}/documentCopies`,
      {},
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const show = (
  token: string,
  subdomain: string,
  documentId: number,
  documentCopyId: number
): Promise<ShowDocumentCopyAPIResponse> => {
  return axios
    .get(
      `/api/v3/printerAir/documents/${documentId}/documentCopies/${documentCopyId}`,
      { headers: { token, 'X-Api-Subdomain': subdomain } }
    )
    .then((response) => response.data);
};

export const DocumentCopyService = {
  create,
  show,
};
