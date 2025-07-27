import client from '../../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';

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

  switch (req.method) {
    case 'GET':
      return client
        .get(`/v3/printer_cloud/user_groups/${req.query.group_id}`, config)
        .then((response) => {
          res.status(response.status).json(response.data);
        })
        .catch((error) => {
          if (error.response.data.message) {
            res.status(error.response.status).json(error.response.data);
          } else {
            res.status(error.response.status || 500).json({
              message:
                'Um erro inesperado ocorreu. Tente novamente mais tarde.',
            });
          }
        });

    case 'PUT':
      return client
        .put(
          `/v3/printer_cloud/user_groups/${req.query.group_id}`,
          {
            user_group: {
              name: req.body.name,
              description: req.body.description,
            },
          },
          config
        )
        .then((response) => {
          res.status(response.status).json(response.data);
        })
        .catch((error) => {
          if (error.response.data.message) {
            res.status(error.response.status).json(error.response.data);
          } else {
            res.status(error.response.status || 500).json({
              message:
                'Um erro inesperado ocorreu. Tente novamente mais tarde.',
            });
          }
        });

    case 'DELETE':
      return client
        .delete(`/v3/printer_cloud/user_groups/${req.query.group_id}`, config)
        .then((response) => {
          res.status(response.status).json(response.data);
        })
        .catch((error) => {
          if (error.response.data.message) {
            res.status(error.response.status).json(error.response.data);
          } else {
            res.status(error.response.status || 500).json({
              message:
                'Um erro inesperado ocorreu. Tente novamente mais tarde.',
            });
          }
        });

    default:
      throw Error;
  }
}
