import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../../client';
import { IndexSharedDocumentsAPIResponse } from '../../../../../../services/printer-air/types';
import { camelToSnake } from '../../../../../../utils';

const transformIndexData = (data): IndexSharedDocumentsAPIResponse => {
  return {
    sharedDocuments: data['printer_air/shared_objects'].map(
      (sharedDocumentData) => {
        return {
          id: sharedDocumentData.id,
          parentSharedId: sharedDocumentData.parent_shared_id,
          objectPrn: sharedDocumentData.object_prn,
          organizationId: sharedDocumentData.organization_id,
          prn: sharedDocumentData.prn,
          userId: sharedDocumentData.user_id,
          createdAt: sharedDocumentData.created_at,
          updateAt: sharedDocumentData.updated_at,
          document: {
            id: sharedDocumentData.document.id,
            originalFilename: sharedDocumentData.document.original_filename,
            location: sharedDocumentData.document.location,
            description: sharedDocumentData.document.name,
            byteSize: sharedDocumentData.document.byte_size,
            url: sharedDocumentData.document.url,
            downloadUrl: sharedDocumentData.document.download_url,
          },
          createdBy: {
            id: sharedDocumentData.created_by.id,
            name: sharedDocumentData.created_by.name,
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
    .get(
      `/v3/printer_air/organizations/${req.query.organizationId}/shared_documents?${queryString}`,
      config
    )
    .then((response) => {
      res.status(response.status).json(transformIndexData(response.data));
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
