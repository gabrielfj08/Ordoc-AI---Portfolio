import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../client';
import { ShowBatchOperationAPIResponse } from '../../../../../services/printer-air/types';

const transformShowData = (data): ShowBatchOperationAPIResponse => {
  return {
    id: data.id,
    recordType: data.record_type,
    ids: data.ids,
    action: data.action,
    status: data.status,
    payload: data.payload,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    createdById: data.created_by_id,
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

  return client
    .get(`/v3/printer_air/batch_operations/${req.query.id}`, config)
    .then((response) => {
      res.status(response.status).json(transformShowData(response.data));
    })
    .catch((error) => {
      res.status(error.response.status).json(error.response.data);
    });
}
