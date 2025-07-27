import client from '../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { ManifestJson } from '../../../../services/types/about';

const transformData = (data) => {
  return {
    name: data.name,
    version: data.version,
    releasedAt: data.released_at,
  } as ManifestJson;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return client
    .get('/manifest.json')
    .then((response) => {
      res.status(response.status).json(transformData(response.data));
    })
    .catch((error) => {
      res.status(error.response.status).json(error.response.data);
    });
}
