import axios from 'axios';
import { toQueryString } from '../../utils';
import {
  IndexSharedDocumentsAPIResponse,
  IndexSharedDocumentsPayload,
} from './types';

const index = (
  token: string,
  subdomain: string,
  organizationId: number,
  payload: IndexSharedDocumentsPayload
): Promise<IndexSharedDocumentsAPIResponse> => {
  return axios
    .get(
      `/api/v3/printerAir/organizations/${organizationId}/sharedDocuments?${toQueryString(
        payload
      )}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => {
      return {
        sharedDocuments: response.data.sharedDocuments,
        meta: response.data.meta,
      };
    });
};

export const SharedDocumentWithMeService = {
  index,
};
