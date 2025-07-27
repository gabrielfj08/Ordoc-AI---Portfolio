import axios from 'axios';
import {
  CreateDocumentUploadJobAPIResponse,
  CreateDocumentUploadJobPayload,
  ShowDocumentUploadJobAPIResponse,
} from './types';

const create = (
  token: string,
  subdomain: string,
  payload: CreateDocumentUploadJobPayload
): Promise<CreateDocumentUploadJobAPIResponse> => {
  return axios
    .post('/api/v3/printerAir/documentUploadJobs', payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const show = (
  token: string,
  subdomain: string,
  id: number
): Promise<ShowDocumentUploadJobAPIResponse> => {
  return axios
    .get(`/api/v3/printerAir/documentUploadJobs/${id}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

export const DocumentUploadJobService = {
  create,
  show,
};
