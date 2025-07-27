import axios from 'axios';
import {
  CreatedProcedureReportsAPIResponse,
  ShowProcedureReportsAPIResponse,
} from './types';

const create = (
  token: string,
  subdomain: string,
  procedureId: number
): Promise<CreatedProcedureReportsAPIResponse> => {
  return axios
    .post(
      `/api/v3/printerFlow/procedures/${procedureId}/procedureReports`,
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
  procedureId: number,
  id: number
): Promise<ShowProcedureReportsAPIResponse> => {
  return axios
    .get(
      `/api/v3/printerFlow/procedures/${procedureId}/procedureReports/${id}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

export const ProcedureReportService = {
  create,
  show,
};
