import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../client';
import { SearchDocumentsAPIResponse } from '../../../../../services/printer-air/types';

const transformData = (data): SearchDocumentsAPIResponse => {
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
        previousParentPrn: documentData.previous_parent_prn,
        createdAt: documentData.created_at,
        updatedAt: documentData.updated_at,
        deletedAt: documentData.deleted_at,
        byteSize: documentData.byte_size,
        versionId: documentData.version_id,
        shared: documentData.shared,
        shareableLink: documentData.shareable_link,
        previewContent: documentData.preview_content,
        updatedBy: {
          id: documentData.updated_by.id,
          name: documentData.updated_by.name,
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
    req.query as Record<string, string>
  ).toString();

  return client
    .get(`/v3/printer_air/documents/search?${queryString}`, config)
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
