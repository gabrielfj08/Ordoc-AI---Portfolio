import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../../../client';
import { ShowDocumentVersionAPIResponse } from '../../../../../../../services/printer-air/types/documentVersion';

const transformShowData = (data): ShowDocumentVersionAPIResponse => {
  return {
    id: data.id,
    originalFilename: data.original_filename,
    description: data.description,
    location: data.location,
    status: data.status,
    directoryId: data.directory_id,
    prn: data.prn,
    versionId: data.version_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    url: data.url,
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

  switch (req.method) {
    case 'GET':
      return client
        .get(
          `/v3/printer_air/organizations/${req.query.organizationId}/document_versions/${req.query.id}`,
          config
        )
        .then((response) => {
          res.status(response.status).json(transformShowData(response.data));
        })
        .catch((error) => {
          res.status(error.response.status).json(error.response.data);
        });
    case 'DELETE':
      return client
        .delete(
          `/v3/printer_air/organizations/${req.query.organizationId}/document_versions/${req.query.id}`,
          config
        )
        .then((response) => {
          res.status(response.status).json(transformShowData(response.data));
        })
        .catch((error) => {
          res.status(error.response.status).json(error.response.data);
        });
  }
}
