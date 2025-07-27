import axios from 'axios';
import { buildParams, toQueryString } from '../utils';
import {
  CreateUserGroupAPIResponse,
  CreateUserGroupPayload,
  DeactivateUserGroupAPIResponse,
  IndexUserGroupsAPIResponse,
  IndexUserGroupsParams,
} from './types';

const activate = (token: string, subdomain: string, id: number) => {
  return axios.put(
    `/api/v3/printer_cloud/user_groups/${id}/activate`,
    {},
    { headers: { token, 'X-Api-Subdomain': subdomain } }
  );
};

const addUser = (
  token: string,
  subdomain: string,
  id: number,
  user_id: number
) => {
  return axios.put(
    `/api/v3/printer_cloud/user_groups/${id}/add_user`,
    { user_id },
    {
      headers: { token, 'X-Api-Subdomain': subdomain },
    }
  );
};

const attachForUserGroup = (
  token: string,
  subdomain: string,
  group_id: number | null,
  policyIds: Array<number>
) => {
  return axios.put(
    `/api/v3/printer_cloud/user_groups/${group_id}/attach_policies`,
    policyIds,
    { headers: { token, 'X-Api-Subdomain': subdomain } }
  );
};

const create = (
  token: string,
  subdomain: string,
  payload: CreateUserGroupPayload
): Promise<CreateUserGroupAPIResponse> => {
  return axios
    .post(`/api/v3/printer_cloud/user_groups/create`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const deactivate = (
  token: string,
  subdomain: string,
  id: number
): Promise<DeactivateUserGroupAPIResponse> => {
  return axios
    .put(
      `/api/v3/printer_cloud/user_groups/${id}/deactivate`,
      {},
      { headers: { token, 'X-Api-Subdomain': subdomain } }
    )
    .then((response) => response.data);
};

const deleteGroup = (token: string, subdomain: string, id: number) => {
  return axios.delete(`/api/v3/printer_cloud/user_groups/${id}`, {
    headers: { token, 'X-Api-Subdomain': subdomain },
  });
};

const detachForUserGroup = (
  token: string,
  subdomain: string,
  group_id: number | null,
  policy_id: number | null
) => {
  return axios.put(
    `/api/v3/printer_cloud/user_groups/${group_id}/detach_policy`,
    { policy_id },
    { headers: { token, 'X-Api-Subdomain': subdomain } }
  );
};

const index = (token: string, subdomain: string, params: any) => {
  return axios
    .get(`/api/index-userGroups?${buildParams(params)}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => {
      return {
        userGroups: response.data['printer_cloud/user_groups'],
        meta: response.data.meta,
      };
    });
};

const indexV3 = (
  token: string,
  subdomain: string,
  params: IndexUserGroupsParams
): Promise<IndexUserGroupsAPIResponse> => {
  return axios
    .get(`/api/v3/printer_cloud/user_groups?${toQueryString(params)}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const show = (token: string, subdomain: string, id: number | null) => {
  return axios.get(`/api/v3/printer_cloud/user_groups/${id}`, {
    headers: { token, 'X-Api-Subdomain': subdomain },
  });
};

const removeUser = (
  token: string,
  subdomain: string,
  id: number | null,
  userID: number | null
) => {
  return axios.put(
    `/api/v3/printer_cloud/user_groups/${id}/remove_user`,
    { userID },
    {
      headers: { token, 'X-Api-Subdomain': subdomain },
    }
  );
};

const update = (
  token: string,
  subdomain: string,
  id: number | null,
  credentials: any
) => {
  return axios.put(`/api/v3/printer_cloud/user_groups/${id}`, credentials, {
    headers: { token, 'X-Api-Subdomain': subdomain },
  });
};

const UserGroupService = {
  activate,
  addUser,
  attachForUserGroup,
  create,
  deactivate,
  deleteGroup,
  detachForUserGroup,
  index,
  indexV3,
  show,
  removeUser,
  update,
};

export default UserGroupService;
