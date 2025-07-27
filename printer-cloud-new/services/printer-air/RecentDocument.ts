import axios from 'axios';
import { toQueryString } from '../../utils';
import {
  IndexRecentDocumentAPIResponse,
  IndexRecentDocumentPayload,
} from './types/recentDocument';

const index = (
  token: string,
  subdomain: string,
  payload: IndexRecentDocumentPayload
): Promise<IndexRecentDocumentAPIResponse> => {
  return axios
    .get(`/api/v3/printerAir/recentDocuments?${toQueryString(payload)}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => {
      return {
        recentDocument: response.data.recentDocument,
        meta: response.data.meta,
      };
    });
};

export const RecentDocumentService = {
  index,
};
