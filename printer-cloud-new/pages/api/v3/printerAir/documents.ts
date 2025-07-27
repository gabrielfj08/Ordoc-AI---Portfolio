import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../client';
import { IndexDocumentsAPIResponse } from '../../../../services/printer-air/types/document';
import { camelToSnake } from '../../../../utils';

const transformIndexData = (data): IndexDocumentsAPIResponse => {
  return {
    documents: data['printer_air/documents'].map((documentData) => {
      return {
        id: documentData.id,
        originalFilename: documentData.original_filename,
        status: documentData.status,
        description: documentData.description,
        location: documentData.location,
        directoryId: documentData.directory_id,
        path: documentData.path,
        prn: documentData.prn,
        createdAt: documentData.created_at,
        updatedAt: documentData.updated_at,
        previousParentPrn: documentData.previous_parent_prn,
        shared: documentData.shared,
        url: documentData.url,
        shareableLink: documentData.shareable_link,
        updatedBy: documentData.updated_by
          ? {
              id: documentData.updated_by.id,
              name: documentData.updated_by.name,
            }
          : null,
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
    .get(`/v3/printer_air/documents?${queryString}`, config)
    .then((response) => {
      res.status(response.status).json(transformIndexData(response.data));
    })
    .catch((error) => {
      res.status(error.response.status).json(error.response.data);
    });
}
