import axios from 'axios';
import {
  CreateExternalProcedureReportAPIResponse,
  ShowExternalProcedureReportAPIResponse,
} from './types';

const create = (
  token: string,
  subdomain: string,
  procedureId: number
): Promise<CreateExternalProcedureReportAPIResponse> => {
  return axios
    .post(
      `/api/v3/flowCidadao/external/procedures/${procedureId}/procedureReports`,
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
  procedureReportId: number
): Promise<ShowExternalProcedureReportAPIResponse> => {
  return axios
    .get(
      `/api/v3/flowCidadao/external/procedures/${procedureId}/procedureReports/${procedureReportId}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

export const ExternalProcedureReportService = {
  create,
  show,
};
