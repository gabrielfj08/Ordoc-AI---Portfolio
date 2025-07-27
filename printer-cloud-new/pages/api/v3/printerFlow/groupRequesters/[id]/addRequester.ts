import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../../client';
import { AddRequestersToGroupAPIResponse } from '../../../../../../services/printer-flow/types';

const transformData = (data): AddRequestersToGroupAPIResponse => {
  return {
    id: data.id,
    ids: data.ids,
    payload: {
      groupRequesterId: data.payload.group_requester_id,
    },
    action: data.action,
    recordType: data.record_type,
    createdById: data.created_by_id,
    status: data.status,
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

  return client
    .put(
      `/v3/printer_flow/group_requesters/${req.query.id}/add_requester`,
      {
        requester_ids: [req.body.requesterIds],
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
