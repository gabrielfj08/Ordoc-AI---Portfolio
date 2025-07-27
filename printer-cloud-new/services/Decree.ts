import axios from 'axios';
import { ShowDecreeAPIResponse } from './types';

const show = (subdomain: string): Promise<ShowDecreeAPIResponse> => {
  return axios
    .get(`/api/decrees`, {
      headers: { 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

export const DecreeService = {
  show,
};
