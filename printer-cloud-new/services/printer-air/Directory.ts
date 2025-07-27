import axios from 'axios';
import { toQueryString } from '../../utils';
import {
  CreateDirectoryAPIResponse,
  CreateDirectoryPayload,
  IndexDirectoriesAPIResponse,
  IndexDirectoriesOptions,
  MoveDirectoryAPIResponse,
  MoveDirectoryPayload,
  ShowDirectoryAPIResponse,
  TrashDirectoryAPIResponse,
  TrashDirectoryPayload,
  UpdateDirectoryAPIResponse,
  UpdateDirectoryPayload,
  RestoreDirectoriesPayload,
  RestoreDirectoriesAPIResponse,
} from './types';
import {
  ShareDirectoryAPIResponse,
  ShareDirectoryPayload,
} from './types/directory';

const create = (
  token: string,
  subdomain: string,
  organizationId: number,
  payload: CreateDirectoryPayload
): Promise<CreateDirectoryAPIResponse> => {
  return axios
    .post(
      `/api/v3/printerAir/organizations/${organizationId}/directories`,
      payload,
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
  options: IndexDirectoriesOptions = {}
): Promise<IndexDirectoriesAPIResponse> => {
  return axios
    .get(
      `/api/v3/printerAir/organizations/${organizationId}/directories?${toQueryString(
        options
      )}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => {
      return {
        directories: response.data.directories,
        meta: response.data.meta,
      };
    });
};

const move = (
  token: string,
  subdomain: string,
  organizationId: number,
  payload: MoveDirectoryPayload
): Promise<MoveDirectoryAPIResponse> => {
  return axios
    .post(
      `/api/v3/printerAir/organizations/${organizationId}/directories/move`,
      payload,
      { headers: { token, 'X-Api-Subdomain': subdomain } }
    )
    .then((response) => response.data);
};

const share = (
  token: string,
  subdomain: string,
  organizationId: number,
  payload: ShareDirectoryPayload
): Promise<ShareDirectoryAPIResponse> => {
  return axios
    .post(
      `/api/v3/printerAir/organizations/${organizationId}/directories/share`,
      payload,
      { headers: { token, 'X-Api-Subdomain': subdomain } }
    )
    .then((response) => response.data);
};

const restore = (
  token: string,
  subdomain: string,
  organizationId: number,
  payload: RestoreDirectoriesPayload
): Promise<RestoreDirectoriesAPIResponse> => {
  return axios
    .post(
      `/api/v3/printerAir/organizations/${organizationId}/directories/restore`,
      payload,
      { headers: { token, 'X-Api-Subdomain': subdomain } }
    )
    .then((response) => response.data);
};

const show = (
  token: string,
  subdomain: string,
  organizationId: number,
  id: number
): Promise<ShowDirectoryAPIResponse> => {
  return axios
    .get(
      `/api/v3/printerAir/organizations/${organizationId}/directories/${id}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const trash = (
  token: string,
  subdomain: string,
  organizationId: number,
  payload: TrashDirectoryPayload
): Promise<TrashDirectoryAPIResponse> => {
  return axios
    .post(
      `/api/v3/printerAir/organizations/${organizationId}/directories/trash`,
      payload,
      { headers: { token, 'X-Api-Subdomain': subdomain } }
    )
    .then((response) => response.data);
};

const update = (
  token: string,
  subdomain: string,
  organizationId: number,
  id: number,
  payload: UpdateDirectoryPayload
): Promise<UpdateDirectoryAPIResponse> => {
  return axios
    .put(
      `/api/v3/printerAir/organizations/${organizationId}/directories/${id}`,
      payload,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};
export const DirectoryService = {
  index,
  create,
  move,
  share,
  restore,
  show,
  trash,
  update,
};
