import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../client';
import { IndexAppsAPIResponse } from '../../../../services/types';
import { camelToSnake } from '../../../../utils';

const transformData = (data) => {
  return data.map((appData) => {
    return {
      id: appData.id,
      name: appData.name,
      createdAt: appData.created_at,
      updatedAt: appData.updated_at,
      description: appData.description,
      prn: appData.prn,
      logoUrl: appData.logo_url,
      service: appData.service,
    };
  }) as IndexAppsAPIResponse;
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

  let queryString = new URLSearchParams(
    camelToSnake(req.query) as Record<string, string>
  ).toString();

  return client
    .get(`/v3/printer_cloud/apps?${queryString}`, config)
    .then((response) => {
      res.status(response.status).json(transformData(response.data));
    })
    .catch((error) => {
      res.status(error.response.status).json(error.response.data);
    });
}
