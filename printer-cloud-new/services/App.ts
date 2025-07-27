import axios from 'axios';
import { toQueryString } from '../utils';
import { IndexAppsOptions } from './types';
import { IndexAppsAPIResponse } from './types';

const index = (
  token: string,
  subdomain: string,
  options: IndexAppsOptions = {}
): Promise<IndexAppsAPIResponse> => {
  return axios
    .get(`/api/v3/printer_cloud/apps?${toQueryString(options)}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

const AppService = {
  index,
};

export default AppService;
