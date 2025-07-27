import axios from 'axios';
import { toQueryString } from '../../utils';
import {
  AddRequestersToGroupAPIResponse,
  AddRequestersToGroupPayload,
  CreateGroupRequesterAPIResponse,
  CreateGroupRequesterPayload,
  IndexGroupRequestersAPIResponse,
  IndexGroupRequestersOptions,
  IndexRequestersFromGroupAPIResponse,
  IndexRequestersFromGroupPayload,
  ShowGroupRequesterAPIResponse,
  RemoveRequesterFromGroupAPIResponse,
  RemoveRequesterFromGroupPayload,
  UpdateGroupRequesterAPIResponse,
  UpdateGroupRequesterPayload,
} from './types';

const create = (
  token: string,
  subdomain: string,
  payload: CreateGroupRequesterPayload
): Promise<CreateGroupRequesterAPIResponse> => {
  return axios
    .post(`/api/v3/printerFlow/groupRequesters`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const index = (
  token: string,
  subdomain: string,
  options: IndexGroupRequestersOptions
): Promise<IndexGroupRequestersAPIResponse> => {
  return axios
    .get(`/api/v3/printerFlow/groupRequesters?${toQueryString(options)}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const indexRequestersFromGroup = (
  token: string,
  subdomain: string,
  id: number,
  options: IndexRequestersFromGroupPayload
): Promise<IndexRequestersFromGroupAPIResponse> => {
  return axios
    .get(
      `/api/v3/printerFlow/groupRequesters/${id}/requesters?${toQueryString(
        options
      )}`,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const addRequestersToGroup = (
  token: string,
  subdomain: string,
  id: number,
  requesterIds: AddRequestersToGroupPayload
): Promise<AddRequestersToGroupAPIResponse> => {
  return axios
    .put(
      `/api/v3/printerFlow/groupRequesters/${id}/addRequester`,
      requesterIds,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const removeRequesterFromGroup = (
  token: string,
  subdomain: string,
  id: number,
  requesterId: RemoveRequesterFromGroupPayload
): Promise<RemoveRequesterFromGroupAPIResponse> => {
  return axios
    .put(
      `/api/v3/printerFlow/groupRequesters/${id}/removeRequester`,
      requesterId,
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
): Promise<ShowGroupRequesterAPIResponse> => {
  return axios
    .get(`/api/v3/printerFlow/groupRequesters/${id}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const showTree = (
  token: string,
  subdomain: string,
  groupRequesterId: number
) => {
  return axios
    .get(`/api/v3/printerFlow/groupRequesters/${groupRequesterId}/tree`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const update = (
  token: string,
  subdomain: string,
  id: number,
  payload: UpdateGroupRequesterPayload
): Promise<UpdateGroupRequesterAPIResponse> => {
  return axios
    .put(`/api/v3/printerFlow/groupRequesters/${id}`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

export const GroupRequesterService = {
  create,
  index,
  indexRequestersFromGroup,
  addRequestersToGroup,
  removeRequesterFromGroup,
  show,
  showTree,
  update,
};
