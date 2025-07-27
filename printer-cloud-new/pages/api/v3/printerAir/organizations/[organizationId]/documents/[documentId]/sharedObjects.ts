import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../../../../client';
import { IndexSharedDocumentAPIResponse } from '../../../../../../../../services/printer-air/types';

const transformIndexData = (data): IndexSharedDocumentAPIResponse => {
  return {
    sharedDocuments: data['printer_air/shared_objects'].map((sharedObject) => {
      return {
        id: sharedObject.id,
        recordType: sharedObject.record_type,
        objectPrn: sharedObject.object_prn,
        parentSharedId: sharedObject.parent_shared_id,
        organizationId: sharedObject.organization_id,
        prn: sharedObject.prn,
        createdById: sharedObject.created_by_id,
        createdAt: sharedObject.created_at,
        updatedAt: sharedObject.updated_at,
        user: {
          id: sharedObject.user.id,
          name: sharedObject.user.name,
          email: sharedObject.user.email,
          avatarUrl: sharedObject.user.avatar_url,
        },
      };
    }),
    meta: {
      total: data.meta.total,
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
    .get(
      `/v3/printer_air/organizations/${req.query.organizationId}/documents/${req.query.documentId}/shared_objects`,
      config
    )
    .then((response) => {
      res.status(response.status).json(transformIndexData(response.data));
    })
    .catch((error) => {
      res.status(error.response.status).json(error.response.data);
    });
}
