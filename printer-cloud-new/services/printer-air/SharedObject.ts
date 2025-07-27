import axios from 'axios';
import {
  IndexSharedObjectDirectoriesAPIResponse,
  IndexSharedDocumentAPIResponse,
} from './types';

const indexDirectories = (
  token: string,
  subdomain: string,
  organizationId: number,
  directoryId: number
): Promise<IndexSharedObjectDirectoriesAPIResponse> => {
  return axios
    .get(
      `/api/v3/printerAir/organizations/${organizationId}/directories/${directoryId}/sharedObjects`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const indexDocuments = (
  token: string,
  subdomain: string,
  organizationId: number,
  documentId: number
): Promise<IndexSharedDocumentAPIResponse> => {
  return axios
    .get(
      `/api/v3/printerAir/organizations/${organizationId}/documents/${documentId}/sharedObjects`,
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
  sharedObjectId: number
) => {
  return axios
    .delete(
      `/api/v3/printerAir/organizations/${organizationId}/sharedObjects/${sharedObjectId}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

export const SharedObjectService = {
  destroy,
  indexDirectories,
  indexDocuments,
};
