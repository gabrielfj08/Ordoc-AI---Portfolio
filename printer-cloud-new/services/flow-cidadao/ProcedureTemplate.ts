import axios from 'axios';
import { toQueryString } from '../../utils';
import {
  ExternalProcedureTemplatePayload,
  IndexExternalProcedureTemplateAPIResponse,
  ShowExternalProcedureTemplateAPIResponse,
} from './types/procedureTemplate';

const index = (
  token: string,
  subdomain: string,
  params: ExternalProcedureTemplatePayload
): Promise<IndexExternalProcedureTemplateAPIResponse> => {
  return axios
    .get(
      `/api/v3/flowCidadao/external/procedureTemplates?${toQueryString(
        params
      )}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const show = (
  token: string,
  subdomain: string,
  id: number
): Promise<ShowExternalProcedureTemplateAPIResponse> => {
  return axios
    .get(`/api/v3/flowCidadao/external/procedureTemplates/${id}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

export const ExternalProcedureTemplateService = {
  index,
  show,
};
