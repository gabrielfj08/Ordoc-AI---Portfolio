import axios from 'axios';
import {
  CreateRequesterInfoAPIResponse,
  ShowRequesterInfoAPIResponse,
} from './types';

const create = (
  token: string,
  subdomain: string,
  id: number
): Promise<CreateRequesterInfoAPIResponse> => {
  return axios
    .post(
      `/api/v3/printerFlow/requesters/${id}/requesterInfos`,
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
  requesterInfoId: number
): Promise<ShowRequesterInfoAPIResponse> => {
  return axios
    .get(
      `/api/v3/printerFlow/requesters/${id}/requesterInfos/${requesterInfoId}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

export const RequesterInfoService = {
  create,
  show,
};
