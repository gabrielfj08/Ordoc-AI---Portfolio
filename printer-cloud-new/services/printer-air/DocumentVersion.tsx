import axios from 'axios';
import { toQueryString } from '../../utils';
import {
  IndexDocumentVersionAPIResponse,
  IndexDocumentVersionPayload,
  ShowDocumentVersionAPIResponse,
  DeleteDocumentVersionAPIResponse,
} from './types';

const index = (
  token: string,
  subdomain: string,
  organizationId: number,
  payload: IndexDocumentVersionPayload
): Promise<IndexDocumentVersionAPIResponse> => {
  return axios
    .get(
      `/api/v3/printerAir/organizations/${organizationId}/documentVersions?${toQueryString(
        payload
      )}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => {
      return {
        documentVersions: response.data.documentVersions,
        meta: response.data.meta,
      };
    });
};

const show = (
  token: string,
  subdomain: string,
  organizationId: number,
  id: number
): Promise<ShowDocumentVersionAPIResponse> => {
  return axios
    .get(
      `/api/v3/printerAir/organizations/${organizationId}/documentVersions/${id}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const destroy = (
  token: string,
  subdomain: string,
  organizationId: number,
  id: number
): Promise<DeleteDocumentVersionAPIResponse> => {
  return axios
    .delete(
      `/api/v3/printerAir/organizations/${organizationId}/documentVersions/${id}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

export const DocumentVersionService = {
  index,
  show,
  destroy,
};
