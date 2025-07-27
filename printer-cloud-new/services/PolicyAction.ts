import axios from 'axios';
import { IndexPolicyActionsAPIResponse } from './types';
import { toQueryString } from '../utils';

const index = (
  token: string,
  subdomain: string,
  options = {}
): Promise<IndexPolicyActionsAPIResponse> => {
  return axios
    .get(`/api/v3/printer_cloud/policy_actions?${toQueryString(options)}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

export const PolicyActionService = {
  index,
};
