import axios from 'axios';
import {
  CreateDocumentVersionUploadJobAPIResponse,
  CreateDocumentVersionUploadJobPayload,
  ShowDocumentVersionUploadJobAPIResponse,
} from './types/documentVersionUploadJob';

const create = (
  token: string,
  subdomain: string,
  documentId: number,
  payload: CreateDocumentVersionUploadJobPayload
): Promise<CreateDocumentVersionUploadJobAPIResponse> => {
  return axios
    .post(
      `/api/v3/printerAir/documents/${documentId}/documentVersionUploadJobs`,
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
  id: number
): Promise<ShowDocumentVersionUploadJobAPIResponse> => {
  return axios
    .get(`/api/v3/printerAir/documentVersionUploadJobs/${id}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

export const DocumentVersionUploadJobService = {
  create,
  show,
};
