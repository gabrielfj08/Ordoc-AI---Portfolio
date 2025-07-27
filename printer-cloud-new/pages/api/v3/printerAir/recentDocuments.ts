import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../client';
import { IndexRecentDocumentAPIResponse } from '../../../../services/printer-air/types';
import { camelToSnake } from '../../../../utils';

const transformData = (data): IndexRecentDocumentAPIResponse => {
  return {
    recentDocument: data['printer_air/recent_documents'].map(
      (recentDocumentData) => {
        return {
          documentId: recentDocumentData.document_id,
          lastAccessedAt: recentDocumentData.last_accessed_at,
          userId: recentDocumentData.userId,
          document: {
            id: recentDocumentData.document.id,
            originalFilename: recentDocumentData.document.original_filename,
            status: recentDocumentData.document.status,
            content: recentDocumentData.document.content,
            description: recentDocumentData.document.description,
            location: recentDocumentData.document.location,
            prn: recentDocumentData.document.prn,
            directoryId: recentDocumentData.document.directory_id,
            path: recentDocumentData.document.path,
            url: recentDocumentData.document.url,
            size: recentDocumentData.document.size,
            createdAt: recentDocumentData.document.created_at,
            updatedAt: recentDocumentData.document.updated_at,
          },
        };
      }
    ),
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
    .get(`/v3/printer_air/recent_documents?${queryString}`, config)
    .then((response) => {
      res.status(response.status).json(transformData(response.data));
    })
    .catch((error) => {
      res.status(error.response.status).json(error.response.data);
    });
}
