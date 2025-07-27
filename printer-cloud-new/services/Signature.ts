import axios from 'axios';
import {
  PublicIndexSignaturesAPIResponse,
  PublicIndexSignaturesPayload,
} from './types';
import { toQueryString } from '../utils';

const index = (
  subdomain: string,
  payload: PublicIndexSignaturesPayload
): Promise<PublicIndexSignaturesAPIResponse> => {
  return axios
    .get(`/api/signatures?${toQueryString(payload)}`, {
      headers: { 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

export const PublicSignatureService = {
  index,
};
