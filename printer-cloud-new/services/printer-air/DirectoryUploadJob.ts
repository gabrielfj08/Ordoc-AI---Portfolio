import axios from 'axios';
import {
  CreateDirectoryUploadJobAPIResponse,
  CreateDirectoryUploadJobPayload,
  ShowDirectoryUploadJobAPIResponse,
} from './types';

const create = (
  token: string,
  subdomain: string,
  payload: CreateDirectoryUploadJobPayload
): Promise<CreateDirectoryUploadJobAPIResponse> => {
  return axios
    .post('/api/v3/printerAir/directoryUploadJobs', payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const show = (
  token: string,
  subdomain: string,
  id: number
): Promise<ShowDirectoryUploadJobAPIResponse> => {
  return axios
    .get(`/api/v3/printerAir/directoryUploadJobs/${id}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

export const DirectoryUploadJobService = {
  create,
  show,
};
