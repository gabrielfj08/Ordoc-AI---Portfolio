import axios from 'axios';
import { toQueryString } from '../../utils';
import {
  IndexSharedDirectoriesAPIResponse,
  IndexSharedDirectoriesPayload,
} from './types';

const index = (
  token: string,
  subdomain: string,
  organizationId: number,
  payload: IndexSharedDirectoriesPayload
): Promise<IndexSharedDirectoriesAPIResponse> => {
  return axios
    .get(
      `/api/v3/printerAir/organizations/${organizationId}/sharedDirectories?${toQueryString(
        payload
      )}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => {
      return {
        sharedDirectories: response.data.sharedDirectories,
        meta: response.data.meta,
      };
    });
};

export const SharedDirectoryWithMeService = {
  index,
};
