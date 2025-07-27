import axios from 'axios';

import { ShowBatchOperationAPIResponse } from './types';

const show = (
  token: string,
  subdomain: string,
  id: number
): Promise<ShowBatchOperationAPIResponse> => {
  return axios
    .get(`/api/v3/printerAir/batchOperations/${id}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

export const BatchOperationService = {
  show,
};
