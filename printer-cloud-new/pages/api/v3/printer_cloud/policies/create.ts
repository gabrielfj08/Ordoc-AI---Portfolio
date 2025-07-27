import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../client';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const config = {
    headers: {
      Authorization: `Bearer ${req.headers.token}`,
      'X-Api-Subdomain': req.headers['x-api-subdomain'] as string,
      'X-Forwarded-For': req.headers['x-forwarded-for']
        ? (req.headers['x-forwarded-for'] as string).split(',')[0]
        : req.headers['x-real-ip']
        ? (req.headers['x-real-ip'] as string)
        : (req.socket.remoteAddress as string),
    },
  };

  return client
    .post(
      `/v3/printer_cloud/policies`,
      {
        policy: {
          name: req.body.name,
          description: req.body.description,
          effect: req.body.effect,
          action_ids: req.body.actionIds,
          resource: req.body.resource,
          service: req.body.service,
        },
      },
      config
    )
    .then((response) => {
      res.status(response.status).json(response.data);
    })
    .catch((error) => {
      if (error.response?.data?.message) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(error.response?.status || 500).json({
          message: 'Um erro inesperado ocorreu. Tente novamente mais tarde.',
        });
      }
    });
}
