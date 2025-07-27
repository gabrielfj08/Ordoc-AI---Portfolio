import axios from 'axios';
import { ShowDirectoryInfoJobAPIResponse } from './types';
import { CreateDirectoryInfoJobAPIResponse } from './types/directoryInfosJob';

const create = (
  token: string,
  subdomain: string,
  directoryId: number
): Promise<CreateDirectoryInfoJobAPIResponse> => {
  return axios
    .post(
      `/api/v3/printerAir/directories/${directoryId}/directoryInfosJob`,
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
  directoryId: number,
  id: number
): Promise<ShowDirectoryInfoJobAPIResponse> => {
  return axios
    .get(
      `/api/v3/printerAir/directories/${directoryId}/directoryInfosJob/${id}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

export const DirectoryInfoJobService = {
  create,
  show,
};
