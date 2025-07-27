import axios from 'axios';
import { buildParams, toQueryString } from '../utils';
import {
  IndexOrganizationsAPIResponse,
  IndexOrganizationParams,
  OrganizationAPIResponse,
  ShowOrganizationAPIResponse,
  UpdateOrganizationAPIResponse,
} from './types';
import { EditOrganizationFormValues } from '../PrinterCloud/Organizations/Edit/types';

const activate = (id: number, token: string) => {
  return axios.put('/api/activate-organization', { id, token });
};

const addUser = (
  token: string,
  subdomain: string,
  id: number | null | undefined,
  email: string
) => {
  return axios.put(
    `/api/v3/printer_cloud/organizations/${id}/add_user?email=${email}`,
    {},
    { headers: { token, 'X-Api-Subdomain': subdomain } }
  );
};

const create = (token: string, subdomain: string, credentials: any) => {
  return axios.post('/api/organizations/create', credentials, {
    headers: { token, 'X-Api-Subdomain': subdomain },
  });
};

const deactivate = (token: string, subdomain: string, id: number) => {
  return axios.put(
    `/api/organizations/${id}/deactivate`,
    {},
    { headers: { token, 'X-Api-Subdomain': subdomain } }
  );
};

const deleteOrganization = (token: string, subdomain: string, id: number) => {
  return axios.delete(`/api/organizations/${id}/delete`, {
    headers: { token, 'X-Api-Subdomain': subdomain },
  });
};

const index = (token: string, subdomain: string, params: any) => {
  return axios
    .get(`/api/index-organizations?${buildParams(params)}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => {
      return {
        organizations: response.data.organizations,
        meta: response.data.meta,
      };
    });
};

const indexV3 = (
  token: string,
  subdomain: string,
  params: IndexOrganizationParams
): Promise<IndexOrganizationsAPIResponse> => {
  return axios
    .get(`/api/v3/printer_cloud/organizations?${toQueryString(params)}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const organization = (subdomain: string): Promise<OrganizationAPIResponse> => {
  return axios
    .get('/api/organization', { headers: { 'X-Api-Subdomain': subdomain } })
    .then((response) => response.data);
};

const removeUser = (
  token: string,
  subdomain: string,
  organizationId: number,
  id: number | undefined
) => {
  return axios.put(
    `/api/v3/printer_cloud/organizations/${organizationId}/remove_user?user_id=${id}`,
    {},
    {
      headers: { token, 'X-Api-Subdomain': subdomain },
    }
  );
};

// TODO: DEPRECATE
const show = (
  token: string,
  subdomain: string,
  organization_id: number | null
) => {
  return axios.get(`/api/v3/printer_cloud/organizations/${organization_id}`, {
    headers: { token, 'X-Api-Subdomain': subdomain },
  });
};

const showV3 = (
  token: string,
  subdomain: string,
  organizationId: number
): Promise<ShowOrganizationAPIResponse> => {
  return axios
    .get(`/api/v3/printer_cloud/organizations/${organizationId}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const update = (
  token: string,
  subdomain: string,
  organizationId: number,
  organization: EditOrganizationFormValues
): Promise<UpdateOrganizationAPIResponse> => {
  return axios
    .put(
      `/api/v3/printer_cloud/organizations/${organizationId}`,
      organization,
      {
        headers: { token, 'X-Api-Subdomain': subdomain },
      }
    )
    .then((response) => response.data);
};

const OrganizationService = {
  activate,
  addUser,
  create,
  deactivate,
  deleteOrganization,
  index,
  indexV3,
  organization,
  removeUser,
  show,
  showV3,
  update,
};

export default OrganizationService;
