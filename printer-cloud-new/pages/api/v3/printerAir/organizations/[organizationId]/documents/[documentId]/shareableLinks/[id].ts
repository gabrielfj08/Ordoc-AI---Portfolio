import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../../../../../client';
import { DestroyShareableLinkAPIResponse } from '../../../../../../../../../services/printer-air/types';

const transformData = (data): DestroyShareableLinkAPIResponse => {
  return {
    id: data.id,
    uuid: data.uuid,
    expiresIn: data.expires_in,
    expiresAt: data.expires_at,
    documentPrn: data.document_prn,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    link: data.link,
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
      `/v3/printer_air/organizations/${req.query.organizationId}/documents/${req.query.documentId}/shareable_links/${req.query.id}`,
      config
    )
    .then((response) => {
      res.status(response.status).json(transformData(response.data));
    })
    .catch((error) => {
      res.status(error.response.status).json(error.response.data);
    });
}
