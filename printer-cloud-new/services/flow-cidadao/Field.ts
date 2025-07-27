import axios from 'axios';
import { toQueryString } from '../../utils';
import {
  IndexExternalFieldParams,
  IndexExternalFieldsAPIResponse,
} from './types';

const index = (
  token: string,
  subdomain: string,
  procedureTemplateId: number,
  params: IndexExternalFieldParams
): Promise<IndexExternalFieldsAPIResponse> => {
  return axios
    .get(
      `/api/v3/flowCidadao/external/procedureTemplates/${procedureTemplateId}/fields?${toQueryString(
        params
      )}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

export const ExternalFieldService = {
  index,
};
