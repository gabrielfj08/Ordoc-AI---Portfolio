import axios from 'axios';
import {
  CreateThemePIResponse,
  CreateThemePayload,
  DeleteThemeAPIResponse,
  ShowThemePIResponse,
  UpdateThemePIResponse,
  UpdateThemePayload,
} from './types';

const create = (
  token: string,
  subdomain: string,
  payload: CreateThemePayload
): Promise<CreateThemePIResponse> => {
  return axios.post('/api/v3/printer_cloud/themes', payload, {
    headers: { token, 'X-Api-Subdomain': subdomain },
  });
};

const deleteTheme = (
  token: string,
  subdomain: string
): Promise<DeleteThemeAPIResponse> => {
  return axios.delete(`/api/v3/printer_cloud/themes`, {
    headers: { token, 'X-Api-Subdomain': subdomain },
  });
};

const show = (
  token: string,
  subdomain: string
): Promise<ShowThemePIResponse> => {
  return axios
    .get(`/api/v3/printer_cloud/themes`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const update = (
  token: string,
  subdomain: string,
  payload: UpdateThemePayload
): Promise<UpdateThemePIResponse> => {
  return axios
    .put(`/api/v3/printer_cloud/themes`, payload, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

export const ThemeService = {
  create,
  deleteTheme,
  show,
  update,
};
