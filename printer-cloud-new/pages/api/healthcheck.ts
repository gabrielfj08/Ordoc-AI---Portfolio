import client from '../../client';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  status: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  return client.get('/healthcheck')
    .then(response => {
      res.status(response.status).json(response.data);
    });
}