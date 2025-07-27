// TODO: DEPRECATE
import axios from 'axios';
import { buildParams } from '../utils';

const index = (token: string, subdomain: string, params: any) => {
  return axios
    .get(
      `/api/v3/printer_cloud/organization_memberships?${buildParams(params)}`,
      { headers: { token, 'X-Api-Subdomain': subdomain } }
    )
    .then((response) => {
      return {
        organizationMemberships:
          response.data['printer_cloud/organization_memberships'],
        meta: response.data.meta,
      };
    });
};

const OrganizationMembership = {
  index,
};

export default OrganizationMembership;
