import client from '../../../../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { ShareDirectoryAPIResponse } from '../../../../../../../services/printer-air/types';

const transformData = (data): ShareDirectoryAPIResponse => {
  return {
    id: data.id,
    ids: data.ids,
    payload: {
      userId: data.payload.user_id,
    },
    action: data.action,
    recordType: data.record_type,
    createdById: data.created_by_id,
    status: data.status,
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

  return client
    .post(
      `/v3/printer_air/organizations/${req.query.organizationId}/directories/share`,
      {
        ids: req.body.ids,
        payload: {
          user_id: req.body.payload.userId,
        },
      },
      config
    )
    .then((response) => {
      res.status(response.status).json(transformData(response.data));
    })
    .catch((error) => {
      res.status(error.response.status).json(error.response.data);
    });
}
