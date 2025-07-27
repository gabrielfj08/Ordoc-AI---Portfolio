import axios from 'axios';
import {
  CreateDownloadJobAPIResponse,
  CreateDownloadJobPayload,
  ShowDownloadJobAPIResponse,
} from './types';

const create = (
  token: string,
  subdomain: string,
  payload: CreateDownloadJobPayload
): Promise<CreateDownloadJobAPIResponse> => {
  return axios
    .post('/api/v3/printerAir/downloadJobs', payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const show = (
  token: string,
  subdomain: string,
  id: number
): Promise<ShowDownloadJobAPIResponse> => {
  return axios
    .get(`/api/v3/printerAir/downloadJobs/${id}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

export const DownloadJobService = {
  create,
  show,
};
