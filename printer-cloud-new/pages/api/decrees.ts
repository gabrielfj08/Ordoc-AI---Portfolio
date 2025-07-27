import client from '../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { ShowDecreeAPIResponse } from '../../services/types';

const transformData = (data): ShowDecreeAPIResponse => {
  return {
    id: data.id,
    decreeNumber: data.decree_number,
    decreeDate: data.decree_date,
    decreeUrl: data.decree_url,
    lawNumber: data.law_number,
    lawDate: data.law_date,
    lawUrl: data.law_url,
    body: data.body,
    organizationId: data.organization_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const config = {
    headers: {
      'X-Api-Subdomain': req.headers['x-api-subdomain'] as string,
      'X-Forwarded-For': req.headers['x-forwarded-for']
        ? (req.headers['x-forwarded-for'] as string).split(',')[0]
        : req.headers['x-real-ip']
        ? (req.headers['x-real-ip'] as string)
        : (req.socket.remoteAddress as string),
    },
  };

  return client
    .get(`/decrees`, config)
    .then((response) => {
      res.status(response.status).json(transformData(response.data));
    })
    .catch((error) => {
      if (error.response.data.message) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(error.response.status || 500).json({
          message: 'Um erro inesperado ocorreu. Tente novamente mais tarde.',
        });
      }
    });
}
