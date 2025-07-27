import client from '../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { camelToSnake } from '../../../../utils';
import { ShowThemePIResponse } from '../../../../services/types';

const transformData = (data): ShowThemePIResponse => {
  return {
    id: data.id,
    organizationId: data.organization_id,
    imageUrl: data.image_url,
    backgroundUrl: data.background_url,
    color: data.color,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

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
        .get(`/v3/printer_cloud/theme`, config)
        .then((response) => {
          res.status(response.status).json(transformData(response.data));
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

    case 'POST':
      return client
        .post(`/v3/printer_cloud/theme`, camelToSnake(req.body), config)
        .then((response) => {
          res.status(response.status).json(transformData(response.data));
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
        .put(`/v3/printer_cloud/theme`, camelToSnake(req.body), config)
        .then((response) => {
          res.status(response.status).json(transformData(response.data));
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
        .delete(`/v3/printer_cloud/theme`, config)
        .then((response) => {
          res.status(response.status).json(transformData(response.data));
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
