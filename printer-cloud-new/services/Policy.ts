import axios from 'axios';
import { buildParams } from '../utils';
import {
  AttachToUserGroupsPayload,
  PutAttachPolicyToUserGroupsAPIResponse,
  ShowPolicyAPIResponse,
  UpdatePolicyAPIResponse,
  UpdatePolicyPayload,
  CreatePolicyAPIResponse,
  CreatePolicyPayload,
  IndexPoliciesAPIResponse,
  AttachToUserPayload,
} from './types';
import { IndexPoliciesParams } from '../types/policy';
import { PutAttachPolicyToUserAPIResponse } from './types';

const attachToUser = (
  token: string,
  subdomain: string,
  policyId: number,
  user_id: number
): Promise<PutAttachPolicyToUserAPIResponse> => {
  return axios
    .put(
      `/api/v3/printer_cloud/policies/${policyId}/attach_policy_to_user`,
      { user_id },
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const attachToUserGroups = (
  token: string,
  subdomain: string,
  policyId: number,
  payload: AttachToUserGroupsPayload
): Promise<PutAttachPolicyToUserGroupsAPIResponse> => {
  return axios
    .put(
      `/api/v3/printer_cloud/policies/${policyId}/attach_policy_to_user_groups`,
      payload,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const create = (
  token: string,
  subdomain: string,
  payload: CreatePolicyPayload
): Promise<CreatePolicyAPIResponse> => {
  return axios
    .post(`/api/v3/printer_cloud/policies/create`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const deletePolicy = (token: string, subdomain: string, policyId: number) => {
  return axios.delete(`/api/v3/printer_cloud/policies/${policyId}`, {
    headers: { token, 'X-Api-Subdomain': subdomain },
  });
};

const index = (
  token: string,
  subdomain: string,
  params: IndexPoliciesParams
): Promise<IndexPoliciesAPIResponse> => {
  return axios
    .get(`/api/v3/printer_cloud/policies?${buildParams(params)}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const show = (
  token: string,
  subdomain: string,
  policyId: number
): Promise<ShowPolicyAPIResponse> => {
  return axios
    .get(`/api/v3/printer_cloud/policies/${policyId}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const update = (
  token: string,
  subdomain: string,
  policyId: number,
  data: UpdatePolicyPayload
): Promise<UpdatePolicyAPIResponse> => {
  return axios
    .put(`/api/v3/printer_cloud/policies/${policyId}`, data, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const PolicyService = {
  attachToUser,
  attachToUserGroups,
  create,
  deletePolicy,
  index,
  show,
  update,
};

export default PolicyService;
