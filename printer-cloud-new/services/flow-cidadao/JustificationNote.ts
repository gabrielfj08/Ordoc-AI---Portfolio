import axios from 'axios';
import { toQueryString } from '../../utils';
import {
  IndexExternalJustificationNotesParams,
  IndexExternalJustificationNotesAPIResponse,
} from './types';

const index = (
  token: string,
  subdomain: string,
  params: IndexExternalJustificationNotesParams
): Promise<IndexExternalJustificationNotesAPIResponse> => {
  return axios
    .get(
      `/api/v3/flowCidadao/external/justificationNotes?${toQueryString(
        params
      )}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

export const ExternalJustificationNoteService = {
  index,
};
