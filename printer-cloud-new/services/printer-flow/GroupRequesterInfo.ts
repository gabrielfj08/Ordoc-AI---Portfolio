import axios from 'axios';
import {
  CreateGroupRequesterInfoAPIResponse,
  ShowGroupRequesterInfoAPIResponse,
} from './types';

const create = (
  token: string,
  subdomain: string,
  id: number
): Promise<CreateGroupRequesterInfoAPIResponse> => {
  return axios
    .post(
      `/api/v3/printerFlow/groupRequesters/${id}/groupRequesterInfos`,
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
  id: number,
  groupRequesterInfoId: number
): Promise<ShowGroupRequesterInfoAPIResponse> => {
  return axios
    .get(
      `/api/v3/printerFlow/groupRequesters/${id}/groupRequesterInfos/${groupRequesterInfoId}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

export const GroupRequesterInfoService = {
  create,
  show,
};
