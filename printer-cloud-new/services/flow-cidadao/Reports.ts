import axios from 'axios';
import {
  CreateExternalReportAPIResponse,
  ShowExternalReportAPIResponse,
} from './types';

const create = (
  token: string,
  subdomain: string
): Promise<CreateExternalReportAPIResponse> => {
  return axios
    .post(
      `/api/v3/flowCidadao/external/reports`,
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
  reportId: number
): Promise<ShowExternalReportAPIResponse> => {
  return axios
    .get(`/api/v3/flowCidadao/external/reports/${reportId}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

export const ExternalReportService = {
  create,
  show,
};
