import axios from 'axios';
import { toQueryString } from '../../utils';
import { IndexJustificationNotes } from './types';
import { JustificationNotesParams } from './types/justificationNote';

const index = (
  token: string,
  subdomain: string,
  params: JustificationNotesParams
): Promise<IndexJustificationNotes> => {
  return axios
    .get(`/api/v3/printerFlow/justificationNotes?${toQueryString(params)}`, {
      headers: { token, 'X-Api-Subdomain': subdomain },
    })
    .then((response) => response.data);
};

export const JustificationNotesService = {
  index,
};
