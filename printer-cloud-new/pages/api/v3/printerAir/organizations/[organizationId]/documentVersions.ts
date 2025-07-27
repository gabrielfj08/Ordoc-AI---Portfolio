import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../../client';
import { IndexDocumentVersionAPIResponse } from '../../../../../../services/printer-air/types/documentVersion';
import { camelToSnake } from '../../../../../../utils';

const transformIndexData = (data): IndexDocumentVersionAPIResponse => {
  return {
    documentVersions: data['printer_air/documents'].map((documentData) => {
      return {
        id: documentData.id,
        originalFilename: documentData.original_filename,
        description: documentData.description,
        location: documentData.location,
        status: documentData.status,
        directoryId: documentData.directory_id,
        prn: documentData.prn,
        versionId: documentData.version_id,
        createdAt: documentData.created_at,
        updatedAt: documentData.updated_at,
        url: documentData.url,
        createdBy: {
          id: documentData.created_by.id,
          name: documentData.created_by.name,
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

  const queryString = new URLSearchParams(
    camelToSnake(req.query) as Record<string, string>
  ).toString();

  return client
    .get(
      `/v3/printer_air/organizations/${req.query.organizationId}/document_versions?${queryString}`,
      config
    )
    .then((response) => {
      res.status(response.status).json(transformIndexData(response.data));
    })
    .catch((error) => {
      res.status(error.response.status).json(error.response.data);
    });
}
