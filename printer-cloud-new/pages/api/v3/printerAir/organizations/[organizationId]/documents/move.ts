import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../../../client';

const transformData = (data) => {
  return {
    id: data.id,
    status: data.status,
    recordType: data.record_type,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    createdById: data.created_by_id,
    action: data.action,
    ids: data.ids,
    payload: {
      directoryId: data.payload.directory_id,
    },
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
      `/v3/printer_air/organizations/${req.query.organizationId}/documents/move`,
      {
        ids: req.body.ids,
        batch_action: req.body.batchAction,
        payload: {
          directory_id: req.body.payload.directoryId,
        },
      },
      config
    )
    .then((response) => {
      res.status(response.status).json(transformData(response.data));
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
