import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../../../client';
import { DestroySharedObjectAPIResponse } from '../../../../../../../services/printer-air/types/sharedObject';

const transformData = (data): DestroySharedObjectAPIResponse => {
  return {
    id: data.id,
    recordType: data.record_type,
    objectPrn: data.object_prn,
    parentSharedId: data.parent_shared_id,
    organizationId: data.organization_id,
    prn: data.prn,
    createdById: data.created_by_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    user: {
      id: data.user.id,
      name: data.user.name,
      email: data.user.name,
      avatarUrl: data.avatar_url,
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
    .delete(
      `/v3/printer_air/organizations/${req.query.organizationId}/shared_objects/${req.query.sharedObjectId}`,
      config
    )
    .then((response) => {
      res.status(response.status).json(transformData(response.data));
    })
    .catch((error) => {
      res.status(error.response.status).json(error.response.data);
    });
}
