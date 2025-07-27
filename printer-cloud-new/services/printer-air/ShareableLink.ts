import axios from 'axios';
import { ShowShareableLinkAPIResponse } from './types/shareableLink';
import {
  CreateShareableLinkAPIResponse,
  CreateShareableLinkPayload,
  DestroyShareableLinkAPIResponse,
  IndexShareableLinkAPIResponse,
} from './types/shareableLink';

const create = (
  token: string,
  subdomain: string,
  organizationId: number,
  documentId: number,
  payload: CreateShareableLinkPayload
): Promise<CreateShareableLinkAPIResponse> => {
  return axios
    .post(
      `/api/v3/printerAir/organizations/${organizationId}/documents/${documentId}/shareableLinks`,
      payload,
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
  documentId: number,
  id: number
): Promise<DestroyShareableLinkAPIResponse> => {
  return axios
    .delete(
      `/api/v3/printerAir/organizations/${organizationId}/documents/${documentId}/shareableLinks/${id}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const index = (
  token: string,
  subdomain: string,
  organizationId: number,
  documentId: number
): Promise<IndexShareableLinkAPIResponse> => {
  return axios
    .get(
      `/api/v3/printerAir/organizations/${organizationId}/documents/${documentId}/shareableLinks`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const show = (uuid: string): Promise<ShowShareableLinkAPIResponse> => {
  return axios
    .get(`/api/v3/printerAir/shareableLinks/${uuid}`)
    .then((response) => response.data);
};

export const ShareableLinkService = {
  create,
  destroy,
  index,
  show,
};
